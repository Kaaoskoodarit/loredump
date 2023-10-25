import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask import Flask, Response, jsonify, request
from api.models import User
from passlib.hash import sha256_crypt

from dotenv import load_dotenv
load_dotenv()

uri = os.getenv("DOMAIN")

app = Flask(__name__)

# # Create a new client and connect to the server
# client = MongoClient(uri, server_api=ServerApi('1'))

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['LoreDump']

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

# routes for api/users.py
@app.route('/api/users', methods=['GET', 'POST', 'DELETE', 'PUT'])
def users():
    if request.method == 'GET':
        users_collection = db['users']
        user_data = users_collection.find_one({'username': request.json['username']})
        if user_data:
            return jsonify({'id': str(user_data['_id']), 'username': user_data['username']})
        else:
            return jsonify({'error': 'User not found'}), 404
            
        
    elif request.method == 'POST':
        try:
            User.register(request.json)
            return jsonify({'success': 'User successfully created'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 400
    
    elif request.method == 'DELETE':
        users_collection = db['users']
        user_data = users_collection.delete_one({'username': request.json['username']})
        if user_data:
            return jsonify({'id': str(user_data['_id']), 'username': user_data['username']})
        else:
            return jsonify({'error': 'User not found'})
    elif request.method == 'PUT':
        users_collection = db['users']
        user_data = users_collection.update_one({'username': request.json['username']})
        if user_data:
            return jsonify({'id': str(user_data['_id']), 'username': user_data['username']})
        else:
            return jsonify({'error': 'User not found'})

if __name__ == "__main__":
    app.run("127.0.0.1", port=5000, debug=True)