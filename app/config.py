import json, pickle
from huggingface_hub import hf_hub_download

ASR_MODEL = "aijadugar/gujarati-asr"
LLM_MODEL = "aijadugar/gujarati-nanogpt"
DEVICE = "cuda"

model_path = hf_hub_download(
    repo_id="aijadugar/gujarati-nanogpt",
    filename="pytorch_model.bin"
)

meta_path = hf_hub_download(
    repo_id="aijadugar/gujarati-nanogpt",
    filename="meta.pkl"
)

config_path = hf_hub_download(
    repo_id="aijadugar/gujarati-nanogpt",
    filename="config.json"
)