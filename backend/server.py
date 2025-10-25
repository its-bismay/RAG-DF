from fastapi import FastAPI
from utils.db import client
from routes.user_router import router

app = FastAPI()

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
