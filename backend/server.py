from fastapi import FastAPI
from utils.db import client
from routes.user_router import router
from routes.file_router import fileRouter
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],         # 👈 allow all origins
    allow_credentials=True,
    allow_methods=["*"],         # 👈 allow all HTTP methods (GET, POST, PUT, DELETE, OPTIONS, etc.)
    allow_headers=["*"],         # 👈 allow all headers (Authorization, Content-Type, etc.)
)

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

@app.get('/')
def test():
    return {
        "message": "The webserver is running!!!"
    }
    
app.include_router(router)

app.include_router(fileRouter)
