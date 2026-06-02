from fastapi import (
    FastAPI,
    UploadFile,
    File
)

import tempfile
from fastapi.middleware.cors import CORSMiddleware
from huggingface_hub import login
login("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")
from app.asr import transcribe
from app.llm import generate_answer

app = FastAPI(
    title="Gujarati AI"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health():
    return {
        "status": "running"
    }


@app.post("/speech")
async def speech_chat(
    audio: UploadFile = File(...)
):

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".webm"
    ) as temp:

        temp.write(
            await audio.read()
        )

        audio_path = temp.name

    text = transcribe(
        audio_path
    )

    return {
        "transcript": text,
    }


@app.post("/chat")
async def chat(
    payload: dict
):

    text = payload["text"]

    answer = generate_answer(
        text
    )

    return {
    "answer": answer
}