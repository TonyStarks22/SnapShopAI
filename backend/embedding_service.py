from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import io
import torch

processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")

def embed_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    inputs = processor(images=image, return_tensors="pt")
    pixel_values = inputs['pixel_values']
    with torch.no_grad():
        # Get vision model outputs
        vision_outputs = model.vision_model(pixel_values)
        # Extract the [CLS] token embedding (first token)
        cls_embedding = vision_outputs.last_hidden_state[:, 0, :]
        # Apply the visual projection to get the final 512-dim embedding
        embeddings = model.visual_projection(cls_embedding)
    return embeddings.cpu().numpy().tolist()[0]