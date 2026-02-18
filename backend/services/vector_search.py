from qdrant_client import QdrantClient
from qdrant_client.http import models
import numpy as np

client = QdrantClient("localhost", port=6333)

def create_collection():
    client.recreate_collection(
        collection_name="products",
        vectors_config=models.VectorParams(size=4096, distance=models.Distance.COSINE),
        # For multi-vector (ColPali), use models.VectorParamsMulti...
    )

def search_vector(vector, top_k=100):
    hits = client.search(
        collection_name="products",
        query_vector=vector,
        limit=top_k,
        with_payload=True,
    )
    return hits