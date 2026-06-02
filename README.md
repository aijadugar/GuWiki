# GuWiki 🇮🇳


**Gujarati Language Model & Automatic Speech Recognition (ASR) System Built from Scratch**

GuWiki is an open-source initiative focused on building AI systems specifically for the Gujarati language. The project combines a custom-trained Gujarati Language Model with a Gujarati Speech Recognition system to make Gujarati knowledge and voice interactions more accessible.

The goal is simple:

> Bring Gujarati knowledge, speech, and AI together in one place.

---

## 🚀 Features

### 🧠 Gujarati Language Model

* Trained from scratch on large-scale Gujarati text data
* Character-level tokenization and encoding
* Knowledge collected from:

  * Gujarati Wikipedia
  * Public Gujarati text sources
  * Curated raw Gujarati documents
* Designed specifically for Gujarati understanding and generation

### 🎙️ Gujarati Automatic Speech Recognition (ASR)

* Wav2Vec2-based speech recognition model
* Trained from scratch on Gujarati audio datasets
* Supports Gujarati voice-to-text conversion
* Optimized for real-world Gujarati speech

### 🌐 Full Stack Application

* **Frontend:** Next Web Application (`src/`)
* **Backend:** FastAPI (`app/`, `models/`)
* Supports:

  * Text-based conversations
  * Voice-based conversations
  * AI-powered Gujarati knowledge retrieval

---

## 📂 Project Structure

```bash
GuWiki/
│
├── src/                # Frontend Application
├── app/                # FastAPI Backend
├── models/             # LLM and ASR Models
├── requirements.txt
├── Dockerfile
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend

* Next
* TypeScript

### Backend

* FastAPI
* Python

### AI & ML

* PyTorch
* Hugging Face Transformers
* Custom Gujarati ASR Model
* Custom Gujarati Character-Level Language Model

---

## 🏃 Running Locally

### Clone Repository

```bash
git clone https://github.com/aijadugar/GuWiki.git

cd GuWiki
```

### Backend Setup

```bash
python -m venv venv

source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run FastAPI server:

```bash
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd src

npm install

npm run dev
```

---

## 🐳 Docker

Build image:

```bash
docker build -t guwiki .
```

Run container:

```bash
docker run -p 8000:8000 guwiki
```

---

## 🎯 Vision

Gujarati is one of the most widely spoken languages in India, with over 60 million native speakers worldwide, yet it remains significantly underrepresented in modern AI systems.

GuWiki aims to build:

* High-quality Gujarati language models
* Robust Gujarati speech recognition
* Open-source datasets and benchmarks
* AI tools designed specifically for Gujarati users

---

## 🔮 Roadmap

The next generation of GuWiki will include:

### Language Model Improvements

* SentencePiece Tokenization
* Byte Pair Encoding (BPE)
* Larger Gujarati corpora
* Better context understanding
* Improved benchmark performance

### Speech Recognition Improvements

* Larger Gujarati voice datasets
* Noise-robust training
* Better pronunciation handling
* Reduced Word Error Rate (WER)

### Platform Improvements

* Real-time voice conversations
* Knowledge-grounded responses
* Mobile applications
* Community-driven dataset expansion

---

## 🤝 Contributing

Contributions are welcome!

You can help by:

* Improving model architectures
* Adding Gujarati datasets
* Enhancing ASR performance
* Fixing bugs
* Improving documentation
* Creating benchmarks

Fork the repository, create a feature branch, and submit a pull request.

---

## 📜 License

This project is open-source and available under the MIT License.

---

## ⭐ Support the Project

If you find GuWiki useful, consider giving the repository a star.

Every contribution helps advance Gujarati AI and open-source language technology.
