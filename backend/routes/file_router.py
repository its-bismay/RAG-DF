from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from datetime import datetime
from pathlib import Path
from utils.pdf_processor import extract_and_chunk_pdf
from utils.vectorStore import store_chunks_in_qdrant, search_similar_chunks
import google.generativeai as genai
import os

fileRouter = APIRouter()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)


@fileRouter.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """Upload a PDF → extract chunks → embed via Jina → store in Qdrant"""
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    base_name = Path(file.filename).stem
    ext = Path(file.filename).suffix
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    new_filename = f"{base_name}_{timestamp}{ext}"
    file_path = UPLOAD_DIR / new_filename

    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Extract chunks using Docling/text splitter
    processed_data = extract_and_chunk_pdf(file_path)
    chunks = processed_data["chunks"]

    # Store in Qdrant via vectorStore.py helper
    qdrant_resp = store_chunks_in_qdrant(chunks, collection_name=base_name)

    return {
        "message": "Upload, extraction & embedding successful!",
        "original_filename": file.filename,
        "saved_as": new_filename,
        "total_chunks": processed_data["total_chunks"],
        "qdrant_status": qdrant_resp,
        "sample_chunks": chunks[:3],
    }


@fileRouter.post("/query")
async def ask_question(payload: dict):
    """
    Ask a question:
      1️⃣ Create query embedding via Jina (vectorStore helper)
      2️⃣ Perform similarity search on Qdrant
      3️⃣ Pass context + question to Gemini Flash 2.5 for response
    """
    question = payload.get("question")
    collection = payload.get("collection_name")

    if not question:
        raise HTTPException(status_code=400, detail="Missing 'question' field")
    if not collection:
        raise HTTPException(status_code=400, detail="Missing 'collection_name' field")

    # Step 1 & 2: Retrieve top chunks (handled in vectorStore)
    top_chunks = search_similar_chunks(question, collection_name=collection)

    if not top_chunks:
        return {"answer": "No relevant context found in the database."}

    # Step 3: Prepare context for Gemini
    context = "\n\n".join(top_chunks)

    prompt = f"""
    You are a helpful assistant. Use the following context from the document to answer.
    If the answer isn't clear from the context, say "I don't have enough information in the document."

    Context:
    {context}

    Question:
    {question}
    """

    # Step 4: Generate answer from Gemini Flash 2.5
    model = genai.GenerativeModel("gemini-2.5-flash")  
    response = model.generate_content(prompt)
    answer = response.text.strip()

    return {
        "question": question,
        "answer": answer,
        "context_used": top_chunks,
    }
