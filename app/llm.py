import json
import pickle
import torch
from huggingface_hub import hf_hub_download
from models.models import GPT

from app.config import model_path, meta_path, config_path

# tokenizer = AutoTokenizer.from_pretrained(
#     LLM_MODEL
# )

# model = torch.load(
#     "nanogpt_model.pt",
#     map_location="cuda"
# )

# model.eval()

device = "cuda" if torch.cuda.is_available() else "cpu"

with open(config_path) as f:
    cfg = json.load(f)
cfg["bias"] = False

with open(meta_path, "rb") as f:
    meta = pickle.load(f)

stoi = meta["stoi"]
itos = meta["itos"]
vocab_size = meta["vocab_size"]

model = GPT(cfg)
state_dict = torch.load(
    model_path,
    map_location=device
)

model.load_state_dict(state_dict)
del state_dict

model.to(device)
model.eval()

# def generate_answer(prompt):

#     prompt = f"""
# પ્રશ્ન:
# {prompt}

# જવાબ:
# """

#     tokens = tokenizer.encode(
#         prompt,
#         return_tensors="pt"
#     ).cuda()

#     with torch.no_grad():

#         output = model.generate(
#             tokens,
#             max_new_tokens=128,
#             temperature=0.7,
#             top_k=40
#         )

#     answer = tokenizer.decode(
#         output[0],
#         skip_special_tokens=True
#     )

#     return answer

def generate_answer(prompt):

    ids = [
        stoi[ch]
        for ch in prompt
        if ch in stoi
    ]

    if len(ids) == 0:
        ids = [0]

    x = torch.tensor(
        ids,
        dtype=torch.long,
        device=device
    )[None, ...]

    with torch.no_grad():

        y = model.generate(
            x,
            max_new_tokens=150,
            temperature=0.8,
            top_k=40
        )

    generated = "".join(
    itos[int(i)]
    for i in y[0].tolist())

    answer = generated[len(prompt):]

    return answer.strip()