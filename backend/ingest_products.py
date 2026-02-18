import os
import requests
from qdrant_client import QdrantClient
from qdrant_client.http import models
from embedding_service import embed_image
import json
from PIL import Image
import io

# Connect to Qdrant
client = QdrantClient("localhost", port=6333)

# Create collection
VECTOR_SIZE = 512 if not USE_QWEN else 4096  # CLIP:512, Qwen:4096
client.recreate_collection(
    collection_name="products",
    vectors_config=models.VectorParams(size=VECTOR_SIZE, distance=models.Distance.COSINE),
)

# Download a small sample of LGS (or use local images)
# For demonstration, we'll create mock products with placeholder images
sample_products = [
    {"id": "1", "title": "Nike Air Max", "price": 120, "image_url": "https://via.placeholder.com/150", "retailer": "Nike"},
    {"id": "2", "title": "Adidas Ultraboost", "price": 150, "image_url": "https://via.placeholder.com/150", "retailer": "Adidas"},
    {"id": "3", "title": "Puma RS-X", "price": 110, "image_url": "https://via.placeholder.com/150", "retailer": "Puma"},
]

# For real images, you would download actual product images. Here we'll use placeholder (just a gray image)
# But for proper testing, you should use real product images. Let's generate a dummy image.
def get_dummy_image():
    from PIL import Image
    img = Image.new('RGB', (224, 224), color='gray')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG')
    return img_bytes.getvalue()

for product in sample_products:
    # In reality: image_bytes = requests.get(product["image_url"]).content
    image_bytes = get_dummy_image()
    vector = embed_image(image_bytes)
    client.upsert(
        collection_name="products",
        points=[
            models.PointStruct(
                id=int(product["id"]),
                vector=vector,
                payload=product
            )
        ]
    )
    print(f"Inserted {product['title']}")