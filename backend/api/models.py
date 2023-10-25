from flask import jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['LoreDump']

# Define User model
class User:
    def __init__(self, id, username, password):
        self.id = id
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