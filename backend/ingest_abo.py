#!/usr/bin/env python3
"""
Ingest Amazon Berkeley Objects (ABO) dataset into Qdrant.
Streams metadata files directly from S3, downloads images, generates CLIP embeddings,
and upserts into Qdrant. Includes collection creation, fallback to other images,
extraction of price/rating metadata, and storage of main_image_id.

Usage:
    python abo_ingest.py [--reset] [--max MAX_PRODUCTS]
"""

import io
import json
import gzip
import hashlib
import logging
import argparse
import requests
from tqdm import tqdm
from qdrant_client import QdrantClient, models
from embedding_service import embed_image  # your existing CLIP embedding function

# ----------------------------------------------------------------------
# Configuration
# ----------------------------------------------------------------------
ABO_BASE_URL = "https://amazon-berkeley-objects.s3.amazonaws.com"
METADATA_FILES = [f"listings/metadata/listings_{i}.json.gz" for i in range(16)]  # 16 files total
IMAGE_BASE_URL = "https://m.media-amazon.com/images/I/"
QDRANT_COLLECTION = "products"
BATCH_SIZE = 50                     # number of points per upsert
EMBEDDING_DIM = 512                  # CLIP ViT-B/32 dimension – adjust if you use a different model

# Logging setup
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ----------------------------------------------------------------------
# Helper functions
# ----------------------------------------------------------------------
def get_image_bytes(image_id):
    """Download image bytes from ABO S3 bucket."""
    img_url = f"{IMAGE_BASE_URL}{image_id}.jpg"
    try:
        response = requests.get(img_url, timeout=10)
        response.raise_for_status()
        return response.content
    except Exception as e:
        logger.warning(f"Could not download image {image_id}: {e}")
        return None


def stream_json_gz(url):
    """Yield parsed JSON objects from a gzipped file streamed from S3."""
    try:
        response = requests.get(url, stream=True, timeout=30)
        response.raise_for_status()
        # Wrap the raw response in a gzip decompressor
        with gzip.GzipFile(fileobj=io.BytesIO(response.content)) as gz:
            for line in gz:
                yield json.loads(line.decode('utf-8'))
    except Exception as e:
        logger.error(f"Failed to download/parse {url}: {e}")
        return


def get_text_field(obj, field, language='en_US', default='Unknown'):
    """
    Extract a text field in the preferred language or fallback to the first available.
    Many ABO fields are lists of dicts with 'language_tag' and 'value'.
    """
    entries = obj.get(field, [])
    if not entries:
        return default
    for entry in entries:
        if entry.get('language_tag') == language:
            return entry.get('value', default)
    # Fallback to the first entry's value
    return entries[0].get('value', default)


def get_price_info(obj):
    """
    Extract price and currency from the 'offers' field if present.
    Returns (price, currency) – price as float if possible, else None.
    """
    offers = obj.get('offers', [])
    if not offers:
        return None, None
    # Take the first offer (simplistic)
    offer = offers[0]
    price = offer.get('price')
    if price is not None:
        try:
            price = float(price)
        except (ValueError, TypeError):
            price = None
    currency = offer.get('currency', 'USD')
    return price, currency


def get_rating(obj):
    """
    Extract average rating from 'customer_reviews' if present.
    Returns float or None.
    """
    reviews = obj.get('customer_reviews', [])
    if not reviews:
        return None
    # Take first review entry (if any)
    rating = reviews[0].get('average_rating')
    if rating is not None:
        try:
            rating = float(rating)
        except (ValueError, TypeError):
            rating = None
    return rating


def get_bullet_points(obj, language='en_US'):
    """
    Extract bullet point descriptions (may be useful for future text search).
    Returns list of strings.
    """
    bullets = obj.get('bullet_point', [])
    result = []
    for bullet in bullets:
        if bullet.get('language_tag') == language:
            result.append(bullet.get('value', ''))
    # If none in preferred language, take any
    if not result and bullets:
        result = [b.get('value', '') for b in bullets]
    return result


def stable_id(item_id):
    """Generate a stable 64-bit integer ID from an item_id string."""
    return int(hashlib.sha256(item_id.encode()).hexdigest()[:16], 16) % (2**63 - 1)


def reset_collection(client):
    """Delete and recreate the collection."""
    try:
        client.delete_collection(QDRANT_COLLECTION)
        logger.info(f"Deleted existing collection '{QDRANT_COLLECTION}'.")
    except Exception as e:
        logger.info(f"Collection '{QDRANT_COLLECTION}' did not exist or could not be deleted: {e}")

    client.create_collection(
        collection_name=QDRANT_COLLECTION,
        vectors_config=models.VectorParams(
            size=EMBEDDING_DIM,
            distance=models.Distance.COSINE
        )
    )
    logger.info(f"Collection '{QDRANT_COLLECTION}' recreated.")


def ensure_collection(client, reset=False):
    """Ensure collection exists. If reset=True, delete and recreate."""
    if reset:
        reset_collection(client)
    else:
        collections = client.get_collections().collections
        if not any(c.name == QDRANT_COLLECTION for c in collections):
            client.create_collection(
                collection_name=QDRANT_COLLECTION,
                vectors_config=models.VectorParams(
                    size=EMBEDDING_DIM,
                    distance=models.Distance.COSINE
                )
            )
            logger.info(f"Collection '{QDRANT_COLLECTION}' created.")
        else:
            logger.info(f"Collection '{QDRANT_COLLECTION}' already exists.")


# ----------------------------------------------------------------------
# Main ingestion loop
# ----------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(description="Ingest ABO dataset into Qdrant.")
    parser.add_argument("--reset", action="store_true", help="Delete and recreate the collection before ingestion.")
    parser.add_argument("--max", type=int, default=None, help="Maximum number of products to ingest (for testing).")
    args = parser.parse_args()

    # Connect to Qdrant
    client = QdrantClient("localhost", port=6333)
    ensure_collection(client, reset=args.reset)

    points_buffer = []
    total_processed = 0
    MAX_PRODUCTS = args.max

    for file_path in METADATA_FILES:
        file_url = f"{ABO_BASE_URL}/{file_path}"
        logger.info(f"Processing {file_url}...")

        for product in stream_json_gz(file_url):
            # --- Extract core identifiers ---
            item_id = product.get('item_id')
            main_image_id = product.get('main_image_id')
            if not item_id or not main_image_id:
                continue

            # --- Text fields ---
            title = get_text_field(product, 'item_name', language='en_US', default='No Title')
            brand = get_text_field(product, 'brand', language='en_US', default='Unknown')
            # Product type is an array of objects with a "value" field; take the first.
            product_type = product.get('product_type', [{}])[0].get('value', 'Unknown')
            bullet_points = get_bullet_points(product, language='en_US')
            color = get_text_field(product, 'color', language='en_US', default='Unknown')

            # --- Price & rating ---
            price, currency = get_price_info(product)
            rating = get_rating(product)

            # --- Image download with fallback ---
            img_bytes = get_image_bytes(main_image_id)
            # If main image fails, try other_image_id list
            if not img_bytes:
                other_images = product.get('other_image_id', [])
                for other_id in other_images:
                    img_bytes = get_image_bytes(other_id)
                    if img_bytes:
                        logger.debug(f"Using fallback image {other_id} for {item_id}")
                        main_image_id = other_id  # update to the actual used ID
                        break

            if not img_bytes:
                logger.warning(f"No image could be downloaded for {item_id}, skipping.")
                continue

            # --- Generate embedding ---
            try:
                vector = embed_image(img_bytes)
                # If embed_image returns a numpy array, convert to list
                if hasattr(vector, 'tolist'):
                    vector = vector.tolist()
            except Exception as e:
                logger.error(f"Embedding failed for {item_id}: {e}")
                continue

            # --- Prepare payload (include all useful metadata) ---
            payload = {
                'item_id': item_id,
                'main_image_id': main_image_id,      # <-- CRITICAL for later image URL construction
                'title': title,
                'brand': brand,
                'category': product_type,
                'color': color,
                'price': price,
                'currency': currency,
                'rating': rating,
                'bullet_points': bullet_points[:5],  # keep first 5
                'source': 'ABO'
            }
            # Remove None values to keep payload clean
            payload = {k: v for k, v in payload.items() if v is not None}

            points_buffer.append(models.PointStruct(
                id=stable_id(item_id),
                vector=vector,
                payload=payload
            ))

            # --- Batch upsert ---
            if len(points_buffer) >= BATCH_SIZE:
                try:
                    client.upsert(
                        collection_name=QDRANT_COLLECTION,
                        points=points_buffer
                    )
                    total_processed += len(points_buffer)
                    logger.info(f"Upserted batch of {len(points_buffer)} (total {total_processed})")
                except Exception as e:
                    logger.error(f"Batch upsert failed: {e}")
                finally:
                    points_buffer = []

            if MAX_PRODUCTS and total_processed >= MAX_PRODUCTS:
                logger.info(f"Reached max products limit ({MAX_PRODUCTS}). Stopping.")
                break

        if MAX_PRODUCTS and total_processed >= MAX_PRODUCTS:
            break

    # Final upsert for remaining points
    if points_buffer:
        try:
            client.upsert(
                collection_name=QDRANT_COLLECTION,
                points=points_buffer
            )
            total_processed += len(points_buffer)
            logger.info(f"Final upsert of {len(points_buffer)} (total {total_processed})")
        except Exception as e:
            logger.error(f"Final batch upsert failed: {e}")

    logger.info(f"Ingestion complete. Total products upserted: {total_processed}")


if __name__ == "__main__":
    main()