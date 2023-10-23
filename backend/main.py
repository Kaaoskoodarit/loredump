import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask import Flask

from dotenv import load_dotenv
load_dotenv()

from models import lorepages,sessions,users

uri = os.getenv("DOMAIN")

app = Flask(__name__)

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

if __name__ == "__main__":
    app.run("127.0.0.1", port=5000, debug=True)