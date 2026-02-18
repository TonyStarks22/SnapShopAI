from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import random
import uuid

app = FastAPI()

# Allow mobile app to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Product(BaseModel):
    id: str
    title: str
    price: float
    image_url: str
    retailer: str
    badge: str | None = None

# Mock product database
MOCK_PRODUCTS = [
    Product(
        id="1",
        title="Nike Air Max 270",
        price=129.99,
        image_url="https://via.placeholder.com/150",
        retailer="Nike",
    ),
    Product(
        id="2",
        title="Adidas Ultraboost 22",
        price=159.99,
        image_url="https://via.placeholder.com/150",
        retailer="Adidas",
    ),
    Product(
        id="3",
        title="Puma RS-X",
        price=109.99,
        image_url="https://via.placeholder.com/150",
        retailer="Puma",
    ),
]

@app.post("/search")
async def search(file: UploadFile = File(...)):
    # In mock mode, ignore image and return random products with badges
    results = random.sample(MOCK_PRODUCTS, 2)
    # Assign badges dynamically
    results[0].badge = "Best Overall"
    results[1].badge = "Best Value"
    return results

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)