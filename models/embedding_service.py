from transformers import AutoProcessor, AutoModel
import torch
from PIL import Image
import base64
import io

model_name = "Qwen/Qwen3-VL-8B-Embedding"  # or llama-nemotron-vl-1b
processor = AutoProcessor.from_pretrained(model_name, trust_remote_code=True)
model = AutoModel.from_pretrained(model_name, trust_remote_code=True, torch_dtype=torch.float16).cuda()

def embed_image(image_base64: str):
    image_bytes = base64.b64decode(image_base64)
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    inputs = processor(images=image, return_tensors="pt").to("cuda")
    with torch.no_grad():
        embeddings = model(**inputs).last_hidden_state.mean(dim=1)
    return embeddings.cpu().numpy().tolist()[0]

def embed_text(text: str):
    inputs = processor(text=text, return_tensors="pt", padding=True).to("cuda")
    with torch.no_grad():
        embeddings = model(**inputs).last_hidden_state.mean(dim=1)
    return embeddings.cpu().numpy().tolist()[0]