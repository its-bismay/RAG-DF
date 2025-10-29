from docling.document_converter import DocumentConverter
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pathlib import Path

def extract_and_chunk_pdf(pdf_path: Path, chunk_size: int = 1000, overlap: int = 150):
    # Initialize Docling converter
    converter = DocumentConverter()
    result = converter.convert(pdf_path)

    # Extract full text from the document
    full_text = result.document.export_to_markdown()

    # Split text into smaller chunks
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=overlap,
        separators=["\n", ".", " ", ""],
    )
    chunks = splitter.split_text(full_text)

    return {
        "full_text": full_text,
        "chunks": chunks,
        "total_chunks": len(chunks)
    }
