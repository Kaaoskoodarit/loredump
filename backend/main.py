import datetime, os, jwt
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask import Flask, Response, jsonify, request, session
import pytz
from api.models import User, Session, World, Category, LorePage
from pprint import pprint
import requests

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

# Session Time-To-Alive, until user has to log in again
ttl = 60 # minutes

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

@app.route('/', methods=['GET'])
def index():
    if request.method == 'GET':
        if session['ttl'] < datetime.datetime.utcnow():
            # Reset session Time-To-Live
            session['ttl'] = datetime.datetime.utcnow() + datetime.timedelta(minutes=ttl)
        else:
            # Delete session
            session.clear()
            return jsonify({'error': 'Session expired'}), 401
        return jsonify({'message': 'Welcome to LoreDump!'})

# Routes for User model
# Get currently logged in user:
@app.route('/api/user', methods=['GET'])
def user():
    """
    Returns the username of the logged in user, if any.
    """
    if request.method == 'GET':
        try:
            # token = request.headers['Authorization'].split()[1]
            # session = Session.get_by_token(token)
            # if not session:
            #     return jsonify({'error': 'User not logged in'}), 403
            if 'user_id' not in session:
                return jsonify({'error': 'User not logged in'}), 401
            user = User.get_by_id(session['user_id'])
            return jsonify({
                'id': str(user.id),
                'username': user.username,
                'worlds': [world.serialize() for world in World.get_all_by_creator(user.username)]
            })
        except Exception as e:
            return jsonify({'error': str(e)}), 401

@app.route('/register', methods=['POST'])
def register():
    if session:
        return jsonify({'error': 'User already logged in'}), 403
    # Register new user:
    if request.method == 'POST':
        try:
            # Get username and password from request body
            username = request.json['username']
            password = request.json['password']
            user = User(None, username, password)
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
            if session:
                return jsonify({'error': 'User already logged in'}), 403
            username = request.json['username']
            password = request.json['password']
            user = User.get_by_username(username)
            # Check if user exists
            if not user:
                return jsonify({'error': 'User not found'}), 404
            # Check if password is correct
            if not user.check_password(password):
                return jsonify({'error': 'Invalid password'}), 401
            """# session = Session(username)
            # session.save()
            # token = session.token
            # response = jsonify({'success': 'User successfully logged in'})
            # response.headers['Authorization'] = f'Bearer {token}'
            # return response, {'Authorization': f'Bearer {token}'}"""
            session['user_id'] = user.id
            session['username'] = user.username
            session['ttl'] = datetime.datetime.now(pytz.utc) + datetime.timedelta(minutes=ttl)
            return jsonify({'success': 'User successfully logged in'}), 200
        except Exception as e:
            return jsonify({'error': str(e)})
        
@app.route('/protected')
def protected():
    # Check if user is logged in
    if 'user_id' not in session:
        return jsonify({'error': 'User not logged in'}), 401
    # Get user ID from session
    user_id = session['user_id']
    user = User.get_by_id(user_id)
    return jsonify({'id': str(user.id), 'username': user.username}), 200

@app.before_request
def before_request():
    if request.endpoint in ['register', 'login']:
        return
    if 'user_id' not in session:
        return jsonify({'error': 'User not logged in'}), 401
    if session['ttl'] > datetime.datetime.now(pytz.utc):
        # Reset session Time-To-Live
        session['ttl'] = datetime.datetime.now(pytz.utc) + datetime.timedelta(minutes=ttl)
    else:
        # Delete session
        session.clear()
        return jsonify({'error': 'Session expired'}), 401

""" TOKEN SÄÄTÖÄ
@app.after_request
def add_token_headers(response):
    if 'Authorization' not in request.headers:
        return response
    token = request.headers['Authorization'].split()[1]
    session = Session.get_by_token(token)
    if not session:
        return response
    user = User.get_by_username(session.user)
    new_headers = dict(response.headers)
    new_headers['Authorization'] = f'Bearer {token}'
    # new_headers['X-User-ID'] = str(user.id)
    new_headers['X-Username'] = user.username
    response.headers = new_headers
    return response
"""

        
@app.route('/logout' , methods=['POST'])
def logout():
    # Clear session:
    pprint(vars(session))
    session.clear()
    return jsonify({'success': 'User successfully logged out'}), 200
    """ vanhaa koodia:
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
    return jsonify({'success': 'User successfully logged out'}), 200"""

""" /api/users/<id>
# TODO: Make it so that you can't search for other users by id
@app.route('/api/users/<id>', methods=['GET', 'PUT', 'DELETE'])
def get_user(id):
    if request.method == 'GET':
        user = User.get_by_id(id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        else:
            return jsonify({'id': str(user.id), 'username': user.username})"""

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
    
# Routes for World model
@app.route('/api/worlds', methods=['GET', 'POST', 'PUT', 'DELETE'])
def get_worlds():
    if request.method == 'GET':
        worlds = World.get_all_by_creator(session['username'])
        if worlds:
            return jsonify([world.serialize() for world in worlds])
        else:
            return jsonify({'error': 'User hasn\'t created any worlds'}), 404
    
    elif request.method == 'POST':
        try:
            world = World(
                id=None,
                name=request.json['name'],
                description=request.json['description'],
                creator=session['username']
            )
            world.save()
            return jsonify({'success': 'World successfully created'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 400

if __name__ == "__main__":
    app.run("127.0.0.1", port=3001, debug=True)