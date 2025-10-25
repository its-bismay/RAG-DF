# 🚀 RAG-Powered Document Q&A System

A production-ready Retrieval-Augmented Generation (RAG) application built with FastAPI that enables intelligent question-answering over PDF documents using advanced vector search and large language models.

## ✨ Features

- **📄 PDF Processing**: Upload and process PDF documents seamlessly
- **🔐 Secure Authentication**: JWT-based authentication system
- **🗄️ Document Management**: Store and manage user data with MongoDB
- **🧠 Intelligent Retrieval**: Vector similarity search using Qdrant
- **💬 Natural Language Q&A**: Context-aware responses powered by LLMs
- **⚡ High Performance**: Built on FastAPI for async operations

## 🏗️ Architecture

### Tech Stack

- **Backend Framework**: FastAPI
- **Database**: MongoDB (User data & metadata)
- **Vector Database**: Qdrant
- **Embeddings**: Google Gemini Embedding Model
- **Authentication**: JWT (JSON Web Tokens)
- **Language Model**: LLM (for response generation)

### System Flow

```
┌─────────────┐
│   Frontend  │
└──────┬──────┘
       │ Upload PDF
       ▼
┌─────────────────────────────────────────┐
│           FastAPI Backend               │
├─────────────────────────────────────────┤
│  1. Receive & Store PDF                 │
│  2. Extract & Chunk Text                │
│  3. Generate Embeddings (Gemini)        │
│  4. Store Vectors (Qdrant)              │
└─────────────────────────────────────────┘
       │
       │ User Query
       ▼
┌─────────────────────────────────────────┐
│        Query Processing                 │
├─────────────────────────────────────────┤
│  1. Convert Query to Embeddings         │
│  2. Similarity Search (Qdrant)          │
│  3. Retrieve Relevant Chunks            │
│  4. Generate Response (LLM)             │
└─────────────────────────────────────────┘
```

## 🔄 RAG Pipeline

### Document Ingestion

1. **Upload**: User uploads PDF through the frontend
2. **Storage**: PDF is saved on the server
3. **Chunking**: Document is split into manageable chunks
4. **Embedding**: Each chunk is converted to vector embeddings using Gemini
5. **Indexing**: Vectors are stored in Qdrant vector database

### Query Processing

1. **Query Input**: User submits a question
2. **Vectorization**: Query is converted to embeddings using the same Gemini model
3. **Similarity Search**: Qdrant performs vector similarity search
4. **Context Retrieval**: Most relevant document chunks are retrieved
5. **Response Generation**: LLM generates answer based on retrieved context

## 🚦 Getting Started

### Prerequisites

- Python 3.8+
- MongoDB
- Qdrant (local or cloud instance)
- Google Gemini API key

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd <project-directory>

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Configuration

Create a `.env` file in the root directory:

```env
# MongoDB
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=rag_app

# Qdrant
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your_qdrant_api_key

# Gemini
GEMINI_API_KEY=your_gemini_api_key

# JWT
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# LLM Configuration
LLM_MODEL=your_llm_model
LLM_API_KEY=your_llm_api_key
```

### Running the Application

```bash
# Start the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

Access the interactive API docs at `http://localhost:8000/docs`

## 📚 API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and receive JWT token
- `POST /auth/refresh` - Refresh access token

### Document Management

- `POST /documents/upload` - Upload PDF document
- `GET /documents/` - List user's documents
- `DELETE /documents/{document_id}` - Delete document

### Query

- `POST /query` - Ask questions about uploaded documents

## 🔒 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 🛠️ Development

### Project Structure

```
.
├── app/
│   ├── api/
│   │   ├── auth.py
│   │   ├── documents.py
│   │   └── query.py
│   ├── core/
│   │   ├── config.py
│   │   └── security.py
│   ├── models/
│   │   └── user.py
│   ├── services/
│   │   ├── embedding.py
│   │   ├── rag.py
│   │   └── vector_store.py
│   └── main.py
├── uploads/
├── requirements.txt
└── .env
```

## 🧪 Testing

```bash
# Run tests
pytest tests/

# Run with coverage
pytest --cov=app tests/
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ using FastAPI, Qdrant, and Google Gemini**
