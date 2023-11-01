import datetime, os, jwt
from random import Random
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask import Flask, Response, jsonify, request, session
import pytz
from api.models import User, Session, World, Category, LorePage
from pprint import pprint
import requests
from faker import Faker
from bson import ObjectId

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

fake = Faker()

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
@app.route('/api/user', methods=['GET', 'PUT', 'DELETE'])
def user():
    """
    Returns the username of the logged in user, if any.
    """
    if request.method == 'GET':
        try:
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
    if request.method == 'PUT':
        try:
            if 'user_id' not in session:
                return jsonify({'error': 'User not logged in'}), 401
            user = User.get_by_id(session['user_id'])
            # user.username = request.json['username']
            if 'password' in request.json:
                user.password = request.json['password']
            else:
                user.password = user.password
            user.save()
            return jsonify({'success': 'User successfully updated'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 400
    if request.method == 'DELETE':
        try:
            if 'user_id' not in session:
                return jsonify({'error': 'User not logged in'}), 401
            user = User.get_by_id(session['user_id'])
            user.delete()
            World.delete_all_by_creator(user.username)
            Category.delete_all_by_creator(user.username)
            LorePage.delete_all_by_creator(user.username)
            session.clear()
            return jsonify({'success': 'User successfully deleted'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 400

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
            if str(e) == 'User already exists':
                return jsonify({'error': 'User already exists'}), 409
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
    if request.endpoint in ['register', 'login', 'add_fake_data'] or request.method != 'POST':
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

# Routes for World model
@app.route('/api/worlds', methods=['GET', 'POST'])
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
                creator=session['username'],
                description=request.json['description'],
                image=request.json['image'],
                private_notes=request.json['private_notes'],
            )
            world.save()
            return jsonify({'success': 'World successfully created'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 400
        
@app.route('/api/worlds/<id>', methods=['GET', 'PUT', 'DELETE'])
def get_world(id):
    if request.method == 'GET':
        world = World.get_by_id(id)
        if not world:
            return jsonify({'error': 'World not found'}), 404
        else:
            return jsonify(world.serialize())
    elif request.method == 'PUT':
        try:
            world = World.get_by_id(id)
            if not world:
                return jsonify({'error': 'World not found'}), 404
            world.name = request.json['name']
            world.description = request.json['description']
            world.image=request.json['image']
            world.private_notes=request.json['private_notes']
            world.save()
            return jsonify({'success': 'World successfully updated'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 400
    elif request.method == 'DELETE':
        try:
            world = World.get_by_id(id)
            if not world:
                return jsonify({'error': 'World not found'}), 404
            world.delete()
            Category.delete_all_by_world(id)
            LorePage.delete_all_by_world(id)
            return jsonify({'success': 'World successfully deleted'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 400
        
# Routes for Category model
@app.route('/api/worlds/<world_id>/categories', methods=['GET', 'POST'])
def get_categories(world_id):
    if request.method == 'GET':
        categories = Category.get_all_by_world(world_id)
        if categories:
            return jsonify([category.serialize() for category in categories])
        else:
            return jsonify({'error': 'World doesn\'t have any categories'}), 404
    elif request.method == 'POST':
        try:
            category = Category(
                id=None,
                name=request.json['name'],
                creator=session['username'],
                description=request.json['description'],
                image=request.json['image'],
                private_notes=request.json['private_notes'],
                world=world_id
            )
            category.save()
            World.add_category(world_id, category.name)
            return jsonify({'success': 'Category successfully created'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 400
        
@app.route('/api/categories/<category_id>', methods=['GET', 'PUT', 'DELETE'])
def get_category(category_id):
    if request.method == 'GET':
        category = Category.get_by_id(category_id)
        if not category:
            return jsonify({'error': 'Category not found'}), 404
        else:
            return jsonify(category.serialize())
    elif request.method == 'PUT':
        try:
            category = Category.get_by_id(category_id)
            if not category:
                return jsonify({'error': 'Category not found'}), 404
            category.name = request.json['name']
            category.description = request.json['description']
            category.image=request.json['image']
            category.private_notes=request.json['private_notes']
            category.save()
            return jsonify({'success': 'Category successfully updated'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 400
    elif request.method == 'DELETE':
        try:
            category = Category.get_by_id(category_id)
            if not category:
                return jsonify({'error': 'Category not found'}), 404
            category.delete()
            return jsonify({'success': 'Category successfully deleted'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 400
        
# Routes for LorePage model
@app.route('/api/categories/<category_id>/lore-pages', methods=['GET', 'POST'])
def get_lore_pages(category_id):
    if request.method == 'GET':
        lore_pages = LorePage.get_all_by_category(category_id)
        if lore_pages:
            return jsonify([lore_page.serialize() for lore_page in lore_pages])
        else:
            return jsonify({'error': 'Category doesn\'t have any lore pages'}), 404
    elif request.method == 'POST':
        try:
            lore_page = LorePage(
                id=None,
                name=request.json['name'],
                creator=session['username'],
                description=request.json['description'],
                image=request.json['image'],
                private_notes=request.json['private_notes'],
                category=category_id
            )
            lore_page.save()
            return jsonify({'success': 'Lore page successfully created'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 400
        
@app.route('/api/lore-pages/<lore_page_id>', methods=['GET', 'PUT', 'DELETE'])
def get_lore_page(lore_page_id):
    if request.method == 'GET':
        lore_page = LorePage.get_by_id(lore_page_id)
        if not lore_page:
            return jsonify({'error': 'Lore page not found'}), 404
        else:
            return jsonify(lore_page.serialize())
    elif request.method == 'PUT':
        try:
            lore_page = LorePage.get_by_id(lore_page_id)
            if not lore_page:
                return jsonify({'error': 'Lore page not found'}), 404
            lore_page.name = request.json['name']
            lore_page.description = request.json['description']
            lore_page.image=request.json['image']
            lore_page.private_notes=request.json['private_notes']
            lore_page.save()
            return jsonify({'success': 'Lore page successfully updated'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 400
    elif request.method == 'DELETE':
        try:
            lore_page = LorePage.get_by_id(lore_page_id)
            if not lore_page:
                return jsonify({'error': 'Lore page not found'}), 404
            lore_page.delete()
            return jsonify({'success': 'Lore page successfully deleted'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 400
        
# add fake data:
@app.route('/api/fake-data', methods=['POST'])
def add_fake_data():
    if app.debug == False:
        return jsonify({'error': 'Can\'t add fake data outside of debug mode'}), 400
    try:
        num_users = request.json.get('num_users', 10)
        num_worlds_per_user = request.json.get('num_worlds_per_user', 10)
        num_lore_pages_per_world = request.json.get('num_lore_pages_per_world', 5)
        num_categories_per_world = request.json.get('num_categories_per_world', 5)
        categories = ['Uncategorized']

        for _ in range(num_users):
            username = fake.name()
            password = fake.password()
            user = User(
                id=ObjectId(),
                username=username,
                password=password
            )
            user.register()
            session['user_id'] = user.id
            session['username'] = user.username
            session['ttl'] = datetime.datetime.now(pytz.utc) + datetime.timedelta(minutes=ttl)

            for _ in range(num_worlds_per_user):
                world = World(
                    id=ObjectId(),
                    creator=session['username'],
                    name=fake.word()
                )
                world.id = world.save()

                for _ in range(num_categories_per_world):
                    category = Category(
                        id=ObjectId(),
                        creator=world.creator,
                        world=world.id,
                        name=fake.word(),
                        description=fake.text(),
                        image=fake.image_url(),
                        private_notes=fake.text()
                    )
                    category.save()
                    categories.append(category.name)
                    print(categories)

                for _ in range(num_lore_pages_per_world):
                    random_category = categories[Random().randrange(0, len(categories)-1)] # adds random category
                    lore_page = LorePage(
                        id=ObjectId(),
                        creator=world.creator,
                        world_id=world.id,
                        name=fake.sentence(),
                        description=fake.text(),
                        image=fake.image_url(),
                        private_notes=fake.text(),
                        categories=[random_category]
                    )
                    lore_page.save()
            session.clear()
            categories = ['Uncategorized']

        return jsonify({'success': 'Fake data successfully added'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == "__main__":
    app.run("127.0.0.1", port=3001, debug=True)