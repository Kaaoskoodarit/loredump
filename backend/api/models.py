from flask import jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['LoreDump']

# Define User model
class User:
    def __init__(self, id, username, password):
        self.id = id  # is needed?
        self.username = username
        self.password = password
    
    def register(self):
        users_collection = db['users']

        # Does user already exist?
        existing_user = users_collection.find_one({'username': self.username})
        if existing_user:
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
        users_collection = db['users']
        user_data = users_collection.find_one({'username': username})
        if user_data:
            return User(user_data['username'], user_data['password'])
        else:
            return None
    
    @staticmethod
    def get_by_id(id):
        users_collection = db['users']
        user_data = users_collection.find_one({'_id': ObjectId(id)})
        if user_data:
            return User(user_data['_id'], user_data['username'], user_data['password'])
        else:
            return None

    def is_valid(self):
        return len(self.username) >= 4 and len(self.password) >= 8
    
    # TODO: Implement save method so that user can only edit their own account.
    def save(self):
        users_collection = db['users']
        # Hash the password before saving
        self.password = generate_password_hash(self.password)
        user_data = {
            'username': self.username,
            'password': self.password
        }
        users_collection.update_one({'_id': ObjectId(self.id)}, {'$set': user_data})
    
    # TODO: Implement delete method. Must have session and JWT data to delete user. User can only delete their own account.
    def delete(self):
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
    # TODO: Implement session class to handle user sessions
    def __init__(self, user_id):
        self.user_id = user_id
        self.token = None
        self.expiration = None
    
    def create_token(self, secret_key, expiration_minutes=30):
        # Set the expiration time for the token
        self.expiration = datetime.utcnow() + timedelta(minutes=expiration_minutes)
        
        # Create the token payload
        payload = {
            'user_id': str(self.user_id),
            'exp': self.expiration
        }
        
        # Encode the token using the secret key
        self.token = jwt.encode(payload, secret_key, algorithm='HS256')
    
    @staticmethod
    def decode_token(token, secret_key):
        try:
            # Decode the token using the secret key
            payload = jwt.decode(token, secret_key, algorithms=['HS256'])
            
            # Check if the token has expired
            if datetime.utcnow() > datetime.fromisoformat(payload['exp']):
                return None
            
            # Return the user ID from the token payload
            return ObjectId(payload['user_id'])
        except:
            return None

