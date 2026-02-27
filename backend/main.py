from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import random
import uuid
import time

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
    badge: Optional[str] = None

# Mock product database (keep your existing products)
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
    # Mock mode: return random products with badges
    results = random.sample(MOCK_PRODUCTS, 2)
    results[0].badge = "Best Overall"
    results[1].badge = "Best Value"
    return results

@app.get("/health")
async def health():
    return {"status": "ok"}

# ----- New Mock Checkout Endpoint -----
class CheckoutRequest(BaseModel):
    product_id: str
    price: float
    retailer: str

class CheckoutResponse(BaseModel):
    mandate: str          # mock mandate token
    expires_at: int        # Unix timestamp

@app.post("/create-mandate", response_model=CheckoutResponse)
async def create_mandate(request: CheckoutRequest):
    """
    Mock Google UCP mandate generation.
    Returns a unique mandate ID and an expiry time (10 minutes from now).
    """
    mandate_id = f"mandate_{uuid.uuid4().hex[:8]}"
    expires_at = int(time.time()) + 600   # 10 minutes
    return CheckoutResponse(mandate=mandate_id, expires_at=expires_at)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)