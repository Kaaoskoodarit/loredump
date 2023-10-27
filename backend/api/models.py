import os
from flask import current_app, jsonify
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

    def __init__(self, username, password):
        # self.id = id
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
            raise Exception('Username and password must be at least 4 and 8 characters long, respectively')
        
        # Hash the password before saving
        hashed_password = generate_password_hash(self.password)
        user_data = {
            'username': self.username,
            'password': hashed_password
        }
        
        users_collection.insert_one(user_data)

    
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
                return User(user_data['username'], user_data['password'])
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
        return len(self.username) >= 4 and len(self.password) >= 8
    
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


    #TODO: Implement logout method. Delete token from database.
    def logout(self):
        pass
    

# Define World model
class World:
    def __init__(self, id, creator, name, image, description, private_notes, categories):
        self.id = id
        self.creator = creator
        self.name = name
        self.image = image
        self.description = description
        self.private_notes = private_notes
        self.categories = categories
    
    def save(self):
        # TODO: Implement save method to save the world to the database
        pass
    
    def delete(self):
        # TODO: Implement delete method to delete the world from the database
        pass

    def update(self):
        # TODO: Implement update method to update the lore page in the database
        pass

# Define Category model
class Category:
    def __init__(self, id, creator, name, image, description, pages, private_notes):
        self.id = id
        self.creator = creator
        self.name = name
        self.image = image
        self.description = description
        self.pages = pages
        self.private_notes = private_notes
    
    def save(self):
        # TODO: Implement save method to save the category to the database
        pass
    
    def delete(self):
        # TODO: Implement delete method to delete the category from the database
        pass

    def update(self):
        # TODO: Implement update method to update the lore page in the database
        pass

class LorePage:
    def __init__(self, id, creator, name, categories, image, description, short_description, relationships, private_notes):
        self.id = id
        self.creator = creator
        self.name = name
        self.categories = categories
        self.image = image
        self.description = description
        self.short_description = short_description
        self.relationships = relationships
        self.private_notes = private_notes
    
    def save(self):
        # TODO: Implement save method to save the lore page to the database
        pass
    
    def delete(self):
        # TODO: Implement delete method to delete the lore page from the database
        pass

    def update(self):
        # TODO: Implement update method to update the lore page in the database
        pass

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
                existing_session['token'] = self.token
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

    ''' def __init__(self, id, user_id, token):
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

