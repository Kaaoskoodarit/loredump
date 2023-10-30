import datetime, os, jwt
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask import Flask, Response, jsonify, request
from api.models import User, Session, World, Category, LorePage
from pprint import pprint

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

# Get currently logged in user:
@app.route('/api/user', methods=['GET'])
def user():
    """
    Returns the username of the logged in user, if any.
    """
    if request.method == 'GET':
        try:
            token = request.headers['Authorization'].split()[1]
            session = Session.get_by_token(token)
            if not session:
                return jsonify({'error': 'User not logged in'}), 403
            user = User.get_by_username(session.user)
            print("User found")
            return jsonify({'username': user.username})
        except Exception as e:
            return jsonify({'error': str(e)}), 403

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
            return jsonify({'error': str(e)})
        
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
            session = Session(username)
            session.save()
            token = session.token
            response = jsonify({'success': 'User successfully logged in'})
            response.headers['Authorization'] = f'Bearer {token}'
            return response, {'Authorization': f'Bearer {token}'}
        except Exception as e:
            return jsonify({'error': str(e)})
        
@app.before_request
def add_token_to_headers():
    if 'Authorization' not in request.headers:
        return
    token = request.headers['Authorization'].split()[1]
    session = Session.get_by_token(token)
    if not session:
        return
    user = User.get_by_username(session.user)
    new_headers = dict(request.headers)
    new_headers['Authorization'] = f'Bearer {token}'
    # new_headers['X-User-ID'] = str(user.id)
    new_headers['X-Username'] = user.username
    request.headers = new_headers
        
@app.route('/logout', methods=['POST'])
def logout():
    # Logout user:
    if request.method == 'POST':
        try:
            # Get username from request body
            username = request.json['username']
            session = Session.get_token_of_user(username)
            if not session:
                return jsonify({'error': 'User not logged in'}), 404
            session.delete()
            return jsonify({'success': 'User successfully logged out'}), 200
        except Exception as e:
            return jsonify({'error': str(e)})
    return jsonify({'success': 'User successfully logged out'}), 200

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