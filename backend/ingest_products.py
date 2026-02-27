import os
import io
import requests
from qdrant_client import QdrantClient
from qdrant_client.http import models
from embedding_service import embed_image
import json
from PIL import Image

# Define which embedding model you're using (CLIP = False, Qwen = True)
USE_QWEN = False

# Connect to Qdrant using service name or environment variable
QDRANT_HOST = os.getenv("QDRANT_HOST", "qdrant")
client = QdrantClient(QDRANT_HOST, port=6333)

# Create collection
VECTOR_SIZE = 512 if not USE_QWEN else 4096  # CLIP:512, Qwen:4096
client.recreate_collection(
    collection_name="products",
    vectors_config=models.VectorParams(size=VECTOR_SIZE, distance=models.Distance.COSINE),
)

# Sample products with ratings and return policies
sample_products = [
    {"id": 1, "title": "Nike Air Max 270", "price": 129.99, "retailer": "Nike", "rating": 4.5, "return_policy": "free"},
    {"id": 2, "title": "Adidas Ultraboost 22", "price": 159.99, "retailer": "Adidas", "rating": 4.7, "return_policy": "free"},
    {"id": 3, "title": "Puma RS-X", "price": 109.99, "retailer": "Puma", "rating": 4.3, "return_policy": "30 days"},
    {"id": 4, "title": "New Balance 574", "price": 89.99, "retailer": "New Balance", "rating": 4.4, "return_policy": "free"},
]

def get_dummy_image():
    img = Image.new('RGB', (224, 224), color='gray')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG')
    return img_bytes.getvalue()

for product in sample_products:
    image_bytes = get_dummy_image()
    vector = embed_image(image_bytes)
    client.upsert(
        collection_name="products",
        points=[
            models.PointStruct(
                id=product["id"],
                vector=vector,
                payload=product
            )
        ]
    )
    print(f"Inserted {product['title']}")