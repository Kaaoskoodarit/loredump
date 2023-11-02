import os
import pprint
from flask import current_app, jsonify, request, session
from pymongo import MongoClient
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
from jwt import encode
import secrets

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['LoreDump']

# Define User model
class User:

    # User Schema:
    id: ObjectId
    username: str
    password: str
    # isLoggedin: bool
    # last_seen: datetime
    required_fields = ['username', 'password']
    unique_fields = ['username']

    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password
    
    def register(self):
        """
            Registers a new user in the database.

            Raises:
                Exception: If the user already exists or if the username and password are invalid.
        """
        users_collection = db['users']

        # Does user already exist?
        existing_user = users_collection.find_one({'username': self.username})
        if existing_user:
            print("User already exists")
            raise Exception('User already exists')
        
        # Validate username and password
        if not self.is_valid():
            raise Exception('Invalid username or password')
        
        # Hash the password before saving
        hashed_password = generate_password_hash(self.password)
        user_data = {
            'username': self.username,
            'password': hashed_password
        }
        
        users_collection.insert_one(user_data)

    def delete(self):
        """
            Deletes a user from the database.

            Raises:
                Exception: If the user does not exist.
        """
        users_collection = db['users']
        result = users_collection.delete_one({'_id': ObjectId(self.id)})
        if result.deleted_count == 1:
            return True
        else:
            return False

    
    @staticmethod
    def get_by_username(username):
            """
            Retrieve a user from the database by their username.

            Args:
                username (str): The username of the user to retrieve.

            Returns:
                User or None: If a user with the given username is found in the database, a User object
                representing that user is returned. Otherwise, None is returned.
            """
            users_collection = db['users']
            user_data = users_collection.find_one({'username': username})
            if user_data:
                return User(
                    id=str(user_data['_id']),
                    username=user_data['username'],
                    password=user_data['password'],
                ) 
            else:
                return None

    
    @staticmethod
    def get_by_id(id):
            """
            Retrieve a user from the database by their ID.

            Args:
                id (str): The ID of the user to retrieve.

            Returns:
                User or None: The User object if the user is found, otherwise None.
            """
            users_collection = db['users']
            user_data = users_collection.find_one({'_id': ObjectId(id)})
            if user_data:
                return User(
                    id=str(user_data['_id']),
                    username=user_data['username'],
                    password=user_data['password'],
                )
            else:
                return None

    def is_valid(self):
        # no spaces in username
        if ' ' in self.username:
            return False
        # username and password must be at least 4 and 8 characters long, respectively
        if len(self.username) < 4 or len(self.password) < 8:
            return False
        return True
    
    # TODO: Implement save method so that user can only edit their own account.
    def save(self):
        """
        Saves the user's data to the database.

        Hashes the user's password before saving it to the database.

        Args:
            None

        Returns:
            None
        """
        users_collection = db['users']
        # Hash the password before saving
        self.password = generate_password_hash(self.password)
        user_data = {
            'username': self.username,
            'password': self.password
        }
        users_collection.update_one({'_id': ObjectId(self.id)}, {'$set': user_data})

    def check_password(self, password):
        # check_password_hash returns True if the password matches the hash
        return check_password_hash(self.password, password)
    
    """ Following functions are done in main.py
    # TODO: Implement delete method so that user can only delete their own account.
    def delete(self):
        users_collection = db['users']
        result = users_collection.delete_one({'_id': ObjectId(self.id), 'username': self.username})
        return result.deleted_count == 1


    # TODO: Implement login method.
    # Pakollinen?
    def login(self):
        pass
    
    # TODO: Implement is_loggedin method. Should check if token is valid.
    def is_loggedin(self):
        pass

    # TODO: Implement get_current_user method. Should return the current user.
    def get_current_user(self):
        pass

    #TODO: Implement logout method. Delete token from database.
    def logout(self):
        pass
    """

# Define World model
class World:

    # World Schema:
    id: ObjectId
    creator: str
    name: str
    image: str #???
    description: str
    private_notes: str
    categories: list
    required_fields = ['creator', 'name']
    unique_fields = ['id']

    def __init__(self, id, creator, name, image=None, description=None, private_notes=None, categories=['Uncategorised']):
        self.id = id
        self.creator = creator
        self.name = name
        self.image = image
        self.description = description
        self.private_notes = private_notes
        self.categories = categories

    def serialize(self):
        return {
            'id': str(self.id),
            'creator': self.creator,
            'name': self.name,
            'image': self.image,
            'description': self.description,
            'private_notes': self.private_notes,
            'categories': self.categories
        }

    def save(self):
        worlds_collection = db['worlds']
        self.creator = session['username']
        result = worlds_collection.insert_one({
            'creator': self.creator,
            'name': self.name,
            'image': self.image,
            'description': self.description,
            'private_notes': self.private_notes,
            'categories': self.categories
        })
        return result.inserted_id
    
    def add_category(self, category):
        worlds_collection = db['worlds']
        try:
            result = worlds_collection.update_one(
                {'_id': ObjectId(self.id)},
                {'$push': {'categories': category}}
            )
            return result.modified_count == 1
        except Exception as e:
            print(e)
            return False
    
    @staticmethod
    def get_by_id(id):
        worlds_collection = db['worlds']
        result = worlds_collection.find_one({'_id': ObjectId(id)})
        if result:
            return World(
                id=result['_id'],
                creator=result['creator'],
                name=result['name'],
                image=result['image'],
                description=result['description'],
                private_notes=result['private_notes'],
                categories=result['categories']
            )
        else:
            return jsonify({'error': 'World not found'}), 404
        
    @staticmethod
    def get_all_by_creator(creator):
        worlds_collection = db['worlds']
        results = worlds_collection.find({'creator': creator})
        worlds = []
        for result in results:
            world = World(
                id=result['_id'],
                creator=result['creator'],
                name=result['name'],
                image=result['image'],
                description=result['description'],
                private_notes=result['private_notes'],
                categories=result['categories']
            )
            worlds.append(world)
        return worlds
    
    @staticmethod
    def delete_all_by_creator(creator):
        worlds_collection = db['worlds']
        results = worlds_collection.delete_many({'creator': creator})
        return results.deleted_count

    def delete(self):
        worlds_collection = db['worlds']
        result = worlds_collection.delete_one({'_id': ObjectId(self.id)})
        if result.deleted_count == 1:
            return True
        else:
            return False
        
    def delete_many(self, ids):
        worlds_collection = db['worlds']
        results = worlds_collection.delete_many({'_id': {'$in': ids}})
        return results.deleted_count

    def update(self):
        worlds_collection = db['worlds']
        result = worlds_collection.update_one(
            {'_id': self.id},
            {'$set': {
                'name': self.name,
                'image': self.image,
                'description': self.description,
                'private_notes': self.private_notes,
                'categories': self.categories
            }}
        )
        if result.modified_count == 1:
            return True
        else:
            return False

# Define Category model
class Category:

    # Category Schema:
    id: ObjectId
    creator: str
    name: str
    world_id: ObjectId
    image: str
    description: str
    pages: list
    private_notes: str
    required_fields = ['creator', 'name']
    unique_fields = ['id']

    def __init__(self, id, creator, name, world_id=None, image=None, description=None, lore_pages=[], private_notes=None):
        self.id = id
        self.creator = creator
        self.name = name
        self.world_id = world_id
        self.image = image
        self.description = description
        self.lore_pages = lore_pages
        self.private_notes = private_notes

    def serialize(self):
        print(self.world_id)
        return {
            'id': str(self.id),
            'creator': self.creator,
            'name': self.name,
            'world': {
                'id': str(self.world_id),
                'name': World.get_by_id(ObjectId(self.world_id)).name
            },
            'image': self.image,
            'description': self.description,
            'lore_pages': self.lore_pages,
            'private_notes': self.private_notes
        }
    
    def save(self):
        categories_collection = db['categories']
        self.creator = session['username']
        result = categories_collection.insert_one({
            'creator': self.creator,
            'name': self.name,
            'image': self.image,
            'description': self.description,
            'lore_pages': self.lore_pages,
            'private_notes': self.private_notes,
            'world_id': self.world_id
        })
        addCat = World.get_by_id(ObjectId(self.world_id))
        addCat.add_category(self.name)
        if result.inserted_id:
            return True
        else:
            return False
    
    def delete(self):
        categories_collection = db['categories']
        result = categories_collection.delete_one({'_id': ObjectId(self.id)})
        if result.deleted_count == 1:
            return True
        else:
            return False
    
    @staticmethod
    def delete_all_by_creator(creator):
        categories_collection = db['categories']
        result = categories_collection.delete_many({'creator': creator})
        return result.deleted_count
    
    @staticmethod
    def delete_all_by_world(world_id):
        categories_collection = db['categories']
        result = categories_collection.delete_many({'world_id': world_id})
        return result.deleted_count

    def update(self):
        categories_collection = db['categories']
        result = categories_collection.update_one(
            {'_id': ObjectId(self.id)},
            {'$set': {
                'creator': self.creator,
                'name': self.name,
                'image': self.image,
                'description': self.description,
                'pages': self.pages,
                'private_notes': self.private_notes
            }}
        )
        if result.modified_count == 1:
            return True
        else:
            return False

    @staticmethod
    def get_by_id(id):
        categories_collection = db['categories']
        category = categories_collection.find_one({'_id': ObjectId(id)})
        if category:
            return Category(
                str(category['_id']),
                category['creator'],
                category['name'],
                category['world_id'],
                category['image'],
                category['description'],
                category['lore_pages'],
                category['private_notes']
            )
        else:
            return None

    @staticmethod
    def get_all_by_creator(creator):
        categories_collection = db['categories']
        categories = categories_collection.find({'creator': creator})
        return [
            Category(
                str(category['_id']),
                category['creator'],
                category['name'],
                category['world_id'],
                category['image'],
                category['description'],
                category['pages'],
                category['private_notes']
            ) for category in categories
        ]
    
    @staticmethod
    def get_all_by_world(world_id):
        categories_collection = db['categories']
        categories = categories_collection.find({'world_id': world_id})
        return [
            Category(
                str(category['_id']),
                category['creator'],
                category['name'],
                category['world_id'],
                category['image'],
                category['description'],
                category['lore_pages'],
                category['private_notes']
            ) for category in categories
        ]

class LorePage:

    # LorePage Schema:
    id: ObjectId
    world_id: ObjectId
    creator: str
    name: str
    categories: list
    image: str #???
    description: str
    short_description: str
    relationships: list
    private_notes: str

    def __init__(self, id, creator, name, world_id, categories=['Uncategorised'], image=None, description=None, short_description=None, relationships=[], private_notes=[]):
        self.id = id
        self.creator = creator
        self.name = name
        self.world_id = world_id
        self.categories = categories
        self.image = image
        self.description = description
        self.short_description = short_description
        self.relationships = relationships
        self.private_notes = private_notes

    def serialize(self):
        return {
            'id': str(self.id),
            'creator': self.creator,
            'name': self.name,
            'categories': self.categories,
            'image': self.image,
            'description': self.description,
            'short_description': self.short_description,
            'relationships': self.relationships,
            'private_notes': self.private_notes
        }

    def save(self):
        lorepages_collection = db['lorepages']
        lorepage_data = {
            'creator': self.creator,
            'name': self.name,
            'categories': self.categories,
            'image': self.image,
            'description': self.description,
            'short_description': self.short_description,
            'relationships': self.relationships,
            'private_notes': self.private_notes
        }
        result = lorepages_collection.insert_one(lorepage_data)
        self.id = str(result.inserted_id)

    def delete(self):
        lorepages_collection = db['lorepages']
        lorepages_collection.delete_one({'_id': ObjectId(self.id)})

    @staticmethod
    def delete_all_by_creator(creator):
        lorepages_collection = db['lorepages']
        lorepages_collection.delete_many({'creator': creator})

    @staticmethod
    def delete_all_by_world(world):
        lorepages_collection = db['lorepages']
        lorepages_collection.delete_many({'world': world})

    def update(self):
        lorepages_collection = db['lorepages']
        lorepage_data = {
            'name': self.name,
            'creator': self.creator,
            'categories': self.categories,
            'image': self.image,
            'description': self.description,
            'short_description': self.short_description,
            'relationships': self.relationships,
            'private_notes': self.private_notes
        }
        lorepages_collection.update_one({'_id': ObjectId(self.id)}, {'$set': lorepage_data})

    @staticmethod
    def get_by_id(id):
        lorepages_collection = db['lorepages']
        lorepage = lorepages_collection.find_one({'_id': ObjectId(id)})
        if lorepage:
            return LorePage(
                str(lorepage['_id']),
                lorepage['creator'],
                lorepage['name'],
                lorepage['categories'],
                lorepage['image'],
                lorepage['description'],
                lorepage['short_description'],
                lorepage['relationships'],
                lorepage['private_notes']
            )
        else:
            return None

    @staticmethod
    def get_all_by_creator(creator):
        lorepages_collection = db['lorepages']
        lorepages = lorepages_collection.find({'creator': creator})
        return [
            LorePage(
                str(lorepage['_id']),
                lorepage['creator'],
                lorepage['name'],
                lorepage['categories'],
                lorepage['image'],
                lorepage['description'],
                lorepage['short_description'],
                lorepage['relationships'],
                lorepage['private_notes']
            ) for lorepage in lorepages
        ]
    
    @staticmethod
    def get_all_by_world(world):
        lorepages_collection = db['lorepages']
        lorepages = lorepages_collection.find({'world': world})
        return [
            LorePage(
                str(lorepage['_id']),
                lorepage['creator'],
                lorepage['name'],
                lorepage['categories'],
                lorepage['image'],
                lorepage['description'],
                lorepage['short_description'],
                lorepage['relationships'],
                lorepage['private_notes']
            ) for lorepage in lorepages
        ]
    
    @staticmethod
    def get_all_by_category(category):
        lorepages_collection = db['lorepages']
        lorepages = lorepages_collection.find({'categories': category})
        return [
            LorePage(
                str(lorepage['_id']),
                lorepage['creator'],
                lorepage['name'],
                lorepage['categories'],
                lorepage['image'],
                lorepage['description'],
                lorepage['short_description'],
                lorepage['relationships'],
                lorepage['private_notes']
            ) for lorepage in lorepages
        ]


''' OLD SESSION CLASS:
class Session:
    # Create random token of 64 bytes
    user: str
    ttl: datetime
    token: str

    def __init__(self, user):
        self.user = user
        self.ttl = datetime.utcnow() + timedelta(minutes=30)
        self.token = Session.createToken()

    @staticmethod
    def createToken():
        # This method creates a random token of 64 bytes and converts it to hex
        token = secrets.token_hex(32)
        return token
    
    def save(self):
        # Save session to database
        try:
            sessions_collection = db['sessions']
            # Check if session already exists
            existing_session = sessions_collection.find_one({'user': self.user})
            if existing_session:
                # Update session
                existing_session['ttl'] = self.ttl
                #existing_session['token'] = existing_session['token']
                sessions_collection.update_one({'user': self.user}, {'$set': existing_session})
                return
            session_data = {
                'user': self.user,
                'ttl': self.ttl,
                'token': self.token
            }
            sessions_collection.insert_one(session_data)
        except Exception as e:
            print(e)
            return jsonify({'error': f"Creation of token failed with error {str(e)}"})
    
    @staticmethod
    def get_by_token(token):
        # Get session by token
        sessions_collection = db['sessions']
        session_data = sessions_collection.find_one({'token': token})
        if session_data:
            return Session(session_data['user'])
        else:
            return None

    def get_token_of_user(self):
        sessions_collection = db['sessions']
        session_data = sessions_collection.find_one({'user': self.user})
        # Check if session exists and if it's still valid
        if session_data and session_data['ttl'] > datetime.utcnow():
            # Add more time to token if it's still valid
            session_data['ttl'] = datetime.utcnow() + timedelta(minutes=30)
            sessions_collection.update_one({'user': self.user}, {'$set': session_data})
            return session_data['token']
        else:
            # Delete session
            sessions_collection.delete_one({'user': self.user})
            # Log user out
            User.logout(self.user)
            return None

    def __init__(self, id, user_id, token):
    #     self.id = id
    #     self.user_id = user_id
    #     self.token = token
    
    # @staticmethod
    # def create_token(self, user, secret_key=os.environ.get('SECRET_KEY'), algorithm='HS256'):
    #     # Create token
    #     try:
    #         token = encode({
    #             'exp': datetime.utcnow() + timedelta(minutes=30),
    #             'iat': datetime.utcnow(),
    #             'user_id': user.id,
    #             'username': self.username,
    #             'password': self.password,
    #             'algorithm': algorithm
    #         }, secret_key)
    #         return token
    #     except Exception as e:
    #         print(e)
    #         return e
    
    # @staticmethod
    # def decode_token(token, secret_key=os.environ.get('SECRET_KEY')):
    #     # Decode token
    #     try:
    #         payload = jwt.decode(token, secret_key)
    #         return payload['user_id']
    #     except jwt.ExpiredSignatureError:
    #         return 'Signature expired. Please log in again.'
    #     except jwt.InvalidTokenError:
    #         return 'Invalid token. Please log in again.'
        
    # # def save_token(self):
    # #     tokens = db['tokens']
    # #     token_data = {
    # #         'session_id': self.id,
    # #         'user_id': self.user_id,
    # #         'token': self.token
    # #     }
    # #     tokens.insert_one(token_data) '''