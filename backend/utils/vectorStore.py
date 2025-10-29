# import os
# from dotenv import load_dotenv
# from qdrant_client import QdrantClient, models
# from langchain_google_genai import GoogleGenerativeAIEmbeddings

# load_dotenv()

# # ✅ Use Gemini embedding model (3072-dim by default)
# embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

# def get_qdrant_client():
#     """
#     Connects to Qdrant Cloud using environment variables.
#     """
#     return QdrantClient(
#         url=os.getenv("QDRANT_URL"),
#         api_key=os.getenv("QDRANT_API_KEY"),
#     )

# def store_chunks_in_qdrant(chunks, collection_name="pdf_chunks"):
#     """
#     Embeds all text chunks using Gemini (3072-dim) and uploads to Qdrant Cloud.
#     """
#     client = get_qdrant_client()

#     # ✅ 3072 dimensions for latest embedding model
#     client.recreate_collection(
#         collection_name=collection_name,
#         vectors_config=models.VectorParams(
#             size=3072,
#             distance=models.Distance.COSINE,
#         ),
#     )

#     # ✅ Generate embeddings (3072-dim by default)
#     vectors = embeddings.embed_documents(chunks)

#     # Prepare and upload points
#     points = [
#         models.PointStruct(
#             id=i,
#             vector=vectors[i],
#             payload={"text": chunks[i]},
#         )
#         for i in range(len(chunks))
#     ]

#     client.upsert(collection_name=collection_name, points=points)

#     return {"message": f"{len(chunks)} chunks stored in Qdrant Cloud (3072-dim) successfully."}

import os
from dotenv import load_dotenv
from qdrant_client import QdrantClient, models
import requests

load_dotenv()

JINA_API_KEY = os.getenv("JINA_API_KEY")
JINA_URL = "https://api.jina.ai/v1/embeddings"
MODEL = "jina-embeddings-v3"
DEFAULT_DIM = 1024  # default dimension for Jina-v3 per docs :contentReference[oaicite:1]{index=1}

def get_qdrant_client():
    return QdrantClient(
        url=os.getenv("QDRANT_URL"),
        api_key=os.getenv("QDRANT_API_KEY")
    )

def get_jina_embeddings(texts, task="retrieval.passage", dimensions=DEFAULT_DIM):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {JINA_API_KEY}"
    }
    payload = {
        "model": MODEL,
        "input": texts,
        "task": task,
        "dimensions": dimensions
    }
    resp = requests.post(JINA_URL, headers=headers, json=payload)
    resp.raise_for_status()
    data = resp.json()["data"]
    embeddings = [item["embedding"] for item in data]
    return embeddings

def store_chunks_in_qdrant(chunks, collection_name="pdf_chunks", dimensions=DEFAULT_DIM):
    client = get_qdrant_client()

    # recreate collection with correct dimension
    client.recreate_collection(
        collection_name=collection_name,
        vectors_config=models.VectorParams(size=dimensions, distance=models.Distance.COSINE)
    )

    # get embeddings via Jina API
    vectors = get_jina_embeddings(chunks, task="retrieval.passage", dimensions=dimensions)

    # prepare points
    points = [
        models.PointStruct(
            id=i,
            vector=vectors[i],
            payload={"text": chunks[i]}
        )
        for i in range(len(chunks))
    ]

    client.upsert(collection_name=collection_name, points=points)
    return {"message": f"{len(chunks)} chunks stored (dim={dimensions}) in Qdrant."}

def search_similar_chunks(query, collection_name="pdf_chunks", top_k=5, dimensions=DEFAULT_DIM):
    client = get_qdrant_client()

    # embed query with task retrieval.query
    q_vec = get_jina_embeddings([query], task="retrieval.query", dimensions=dimensions)[0]

    results = client.search(
        collection_name=collection_name,
        query_vector=q_vec,
        limit=top_k
    )

    return [hit.payload["text"] for hit in results]

