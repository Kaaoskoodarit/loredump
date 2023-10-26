import datetime, os, jwt
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask import Flask, Response, jsonify, request
from api.models import User, Session

from dotenv import load_dotenv
load_dotenv()

uri = os.getenv("DOMAIN")

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

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
@app.route('/api/users', methods=['GET', 'POST'])
def users():
    #Get User by username: (delete this route later)
    if request.method == 'GET':
        users_collection = db['users']
        user_data = users_collection.find_one({'username': request.json['username']})
        if user_data:
            return jsonify({'id': str(user_data['_id']), 'username': user_data['username']})
        else:
            return jsonify({'error': 'User not found'}), 404

@app.route('/register', methods=['POST'])
def register():
    # Register new user:
    if request.method == 'POST':
        try:
            # Get username and password from request body
            username = request.json['username']
            password = request.json['password']
            user = User(username, password)
            user.register()
            return jsonify({'success': 'User successfully created'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 409
        
@app.route('/login', methods=['POST'])
def login():
    # Login user:
    if request.method == 'POST':
        try:
            # Get username and password from request body
            username = request.json['username']
            password = request.json['password']
            user = User.get_by_username(username)
            # Check if user exists
            if not user:
                return jsonify({'error': 'User not found'}), 404
            # Check if password is correct
            if not user.check_password(password):
                return jsonify({'error': 'Invalid password'}), 401
            return jsonify({'token': token.decode('UTF-8')})
        except Exception as e:
            return jsonify({'error': str(e)})

# TODO: Make it so that you can't search for other users by id
@app.route('/api/users/<id>', methods=['GET', 'PUT', 'DELETE'])
def get_user(id):
    if request.method == 'GET':
        user = User.get_by_id(id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        else:
            return jsonify({'id': str(user.id), 'username': user.username})

# TODO: Edit PUT and DELETE methods so that user can only edit their own account.
    # elif request.method == 'PUT':
    #     try:
    #         user = User.get_by_id(id)
    #         user.username = request.json['username']
    #         user.password = request.json['password']
    #         user.save()
    #         return jsonify({'success': 'User successfully updated'}), 200
    #     except Exception as e:
    #         return jsonify({'error': str(e)}), 400
        
    # elif request.method == 'DELETE':
    #     try:
    #         user = User.get_by_id(id)
    #         user.delete()
    #         return jsonify({'success': 'User successfully deleted'}), 200
    #     except Exception as e:
    #         return jsonify({'error': str(e)}), 400
    

if __name__ == "__main__":
    app.run("127.0.0.1", port=3001, debug=True)