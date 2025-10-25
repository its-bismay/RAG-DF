
from pymongo.mongo_client import MongoClient
import os
from dotenv import load_dotenv


load_dotenv()

uri = os.environ.get("MONGO_URI")

# Create a new client and connect to the server
client = MongoClient(uri)

db = client.ragAppDb

usersdb = db["Users"]
