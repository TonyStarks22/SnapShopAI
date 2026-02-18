import torch
from PIL import Image
import io
import numpy as np

# Option A: Qwen3-VL (requires GPU)
def load_qwen_model():
    from transformers import AutoProcessor, AutoModel
    model_name = "Qwen/Qwen3-VL-8B-Embedding"  # or "Qwen/Qwen2-VL-7B-Instruct"
    processor = AutoProcessor.from_pretrained(model_name, trust_remote_code=True)
    model = AutoModel.from_pretrained(model_name, trust_remote_code=True, torch_dtype=torch.float16).cuda()
    return processor, model

# Option B: CLIP (CPU friendly)
def load_clip_model():
    from transformers import CLIPProcessor, CLIPModel
    model_name = "openai/clip-vit-base-patch32"
    processor = CLIPProcessor.from_pretrained(model_name)
    model = CLIPModel.from_pretrained(model_name)
    return processor, model

# Choose one:
USE_QWEN = False  # Set to True if you have GPU and want Qwen
if USE_QWEN:
    processor, model = load_qwen_model()
else:
    processor, model = load_clip_model()

def embed_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    if USE_QWEN:
        inputs = processor(images=image, return_tensors="pt").to("cuda")
        with torch.no_grad():
            embeddings = model(**inputs).last_hidden_state.mean(dim=1)
    else:
        inputs = processor(images=image, return_tensors="pt")
        with torch.no_grad():
            embeddings = model.get_image_features(**inputs)
    return embeddings.cpu().numpy().tolist()[0]