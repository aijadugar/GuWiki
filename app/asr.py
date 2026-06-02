import subprocess
import tempfile
import os
import torch
import librosa

from transformers import (
    Wav2Vec2Processor,
    Wav2Vec2ForCTC
)

from app.config import ASR_MODEL

device = "cuda" if torch.cuda.is_available() else "cpu"

processor = Wav2Vec2Processor.from_pretrained(
    ASR_MODEL
)

model = Wav2Vec2ForCTC.from_pretrained(
    ASR_MODEL
).to(device)

model.eval()

def convert_webm_to_wav(input_path):
    temp_wav = tempfile.mktemp(suffix=".wav")

    command = [
        "ffmpeg",
        "-y",
        "-i", input_path,
        "-ar", "16000",
        "-ac", "1",
        temp_wav
    ]

    subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    return temp_wav

def transcribe(audio_path):

    wav_path = convert_webm_to_wav(audio_path)

    audio, sr = librosa.load(wav_path, sr=16000)

    inputs = processor(
        audio,
        sampling_rate=16000,
        return_tensors="pt",
        padding=True
    )

    input_values = inputs.input_values.to(device)

    with torch.no_grad():
        logits = model(input_values).logits

    pred_ids = torch.argmax(logits, dim=-1)

    text = processor.batch_decode(pred_ids)[0]

    os.remove(wav_path)

    return text.strip()