import os
import pprint
from flask import current_app, jsonify, request, session
from pymongo import MongoClient
from bson.objectid import ObjectId
import pytz
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
from jwt import encode
import secrets

from dotenv import load_dotenv


load_dotenv()

# Connect to MongoDB
if os.getenv("LOCAL") == "True":
    client = MongoClient("mongodb://localhost:27017/")
else:
    client = MongoClient("mongodb+srv://" + os.getenv("MONGODB_USER") + ":" + os.getenv("MONGODB_PASSWORD") + "@" + os.getenv("MONGODB_URL") + "/?retryWrites=true&w=majority")
db = client["LoreDump"]


# Define User model
class User:
    # User Schema:
    id: ObjectId
    username: str
    password: str
    # isLoggedin: bool
    # last_seen: datetime
    required_fields = ["username", "password"]
    unique_fields = ["username"]

    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

    def serialize(self):
        """
        Serialize the user object into a dictionary.

        Returns:
            A dictionary containing the serialized user data.
        """

        worlds = {}
        for world in World.get_all_by_creator(self.id):
            worlds[str(world.id)] = world.title
        categories = {}
        for category in Category.get_all_by_creator(self.id):
            categories[str(category.id)] = category.title
        lore_pages = {}
        for lore_page in LorePage.get_all_by_creator(self.id):
            lore_pages[str(lore_page.id)] = lore_page.title

        return {
            "id": str(self.id),
            "username": self.username,
            "worlds": worlds,
            "categories": categories,
            "lore_pages": lore_pages,
        }

    def register(self):
        """
        Registers a new user in the database.

        Raises:
            Exception: If the user already exists or if the username and password are invalid.
        """
        users_collection = db["users"]

        # Does user already exist?
        existing_user = users_collection.find_one({"username": self.username})
        if existing_user:
            print("User already exists")
            raise Exception("User already exists")

        # Validate username and password
        if not self.is_valid():
            raise Exception("Invalid username or password")

        # Hash the password before saving
        hashed_password = generate_password_hash(self.password)
        user_data = {"username": self.username, "password": hashed_password}

        users_collection.insert_one(user_data)

    def login(self):
        """
        Logs a user in.

        Raises:
            Exception: If the user does not exist or if the password is incorrect.
        """
        users_collection = db["users"]
        # Does user exist?
        existing_user = users_collection.find_one({"username": self.username})
        if not existing_user:
            raise Exception("User does not exist")

        # Check password
        if not check_password_hash(existing_user["password"], self.password):
            raise Exception("Incorrect password")

        # Create session
        session["user_id"] = str(existing_user["_id"])
        session["username"] = existing_user["username"]
        session["ttl"] = datetime.now(pytz.utc) + timedelta(minutes=60)

    def delete(self):
        """
        Deletes a user from the database.

        Raises:
            Exception: If the user does not exist.
        """
        users_collection = db["users"]
        result = users_collection.delete_one({"_id": ObjectId(self.id)})
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
        users_collection = db["users"]
        user_data = users_collection.find_one({"username": username})
        if user_data:
            return User(
                id=str(user_data["_id"]),
                username=user_data["username"],
                password=user_data["password"],
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
        users_collection = db["users"]
        user_data = users_collection.find_one({"_id": ObjectId(id)})
        if user_data:
            return User(
                id=str(user_data["_id"]),
                username=user_data["username"],
                password=user_data["password"],
            )
        else:
            return None

    def is_valid(self):
        # no spaces in username
        if " " in self.username:
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
        users_collection = db["users"]
        # Hash the password before saving
        self.password = generate_password_hash(self.password)
        user_data = {"username": self.username, "password": self.password}
        users_collection.update_one({"_id": ObjectId(self.id)}, {"$set": user_data})

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
    creator_id: str
    title: str  # name -> title
    custom_url: str
    image: str
    description: str
    private_notes: str
    categories: list
    lore_pages: list
    required_fields = ["creator_id", "title"]
    unique_fields = ["id"]

    def __init__(
        self,
        id,
        creator_id,
        title,
        custom_url=None,
        image=None,
        description=None,
        private_notes=None,
        categories=["Uncategorised"],
        lore_pages=[],
    ):
        self.id = id
        self.creator_id = creator_id
        self.title = title
        self.custom_url = custom_url  # Change to be set separately!!!!!!!!!!!!
        self.image = image
        self.description = description
        self.private_notes = private_notes
        self.categories = categories
        self.lore_pages = lore_pages

    def serialize(self):
        """
        Serializes the model instance into a dictionary.
        """
        return {
            "id": str(self.id),
            "creator_id": self.creator_id,
            "title": self.title,
            "custom_url": self.custom_url,
            "image": self.image,
            "description": self.description,
            "private_notes": self.private_notes,
            "categories": self.categories,
            "lore_pages": self.lore_pages,
        }

    def save(self):
        """
        Saves the current world object to the database.

        Returns:
            The ID of the inserted document.
        """
        worlds_collection = db["worlds"]
        self.creator_id = str(session["user_id"])
        # if self.categories.count("Uncategorised") == 0:
        #     self.categories.insert(0, "Uncategorised")  # Force "Uncategorised" to be first category
        result = worlds_collection.insert_one(
            {
                "creator_id": self.creator_id,
                "title": self.title,
                "custom_url": self.custom_url,
                "image": self.image,
                "description": self.description,
                "private_notes": self.private_notes,
                "categories": self.categories,
                "lore_pages": self.lore_pages,
            }
        )
        return result.inserted_id

    @staticmethod
    def get_all_custom_urls_from_worlds():
        """
        Returns a list of all custom URLs from the 'worlds' collection in the database.
        """
        worlds_collection = db["worlds"]
        results = worlds_collection.find({})
        results_list = list(results)
        custom_urls = []
        for result in results_list:
            custom_urls.append(result["custom_url"])
        return custom_urls

    def add_private_note(self):
        """
        Adds a private note to the world document in the database.

        Returns:
            bool: True if the note was added successfully, False otherwise.
        """
        worlds_collection = db["worlds"]
        try:
            result = worlds_collection.update_one(
                {"_id": ObjectId(self.id)},
                {"$push": {"private_notes": self.private_notes}},
            )
            return result.modified_count == 1
        except Exception as e:
            print(e)
            return False

    def add_category(self, category):
        """
        Adds a category to the world.

        Args:
            category (str): The category to be added.

        Returns:
            bool: True if the category was added successfully, False otherwise.
        """
        worlds_collection = db["worlds"]
        try:
            # if there's no categories, add "Uncategorised" as default
            # if len(self.categories) == 0:
            #     result = worlds_collection.update_one(
            #         {'_id': ObjectId(self.id)},
            #         {'$push': {'categories': 'Uncategorised'}}
            #     )
            result = worlds_collection.update_one({"_id": ObjectId(self.id)}, {"$push": {"categories": str(category)}})
            return result.modified_count == 1
        except Exception as e:
            print(e)
            return False

    def remove_category(self, category):
        """
        Removes a category from the world.

        Args:
            category (str): The category to be removed.

        Returns:
            bool: True if the category was removed successfully, False otherwise.
        """
        worlds_collection = db["worlds"]
        try:
            result = worlds_collection.update_one({"_id": ObjectId(self.id)}, {"$pull": {"categories": str(category)}})
            return result.modified_count == 1
        except Exception as e:
            print(e)
            return False

    def remove_category(self, category):
        """
        Removes a category from the world.

        Args:
            category (str): The category to be removed.

        Returns:
            bool: True if the category was removed successfully, False otherwise.
        """
        worlds_collection = db["worlds"]
        try:
            result = worlds_collection.update_one({"_id": ObjectId(self.id)}, {"$pull": {"categories": str(category)}})
            return result.modified_count == 1
        except Exception as e:
            print(e)
            return False

    def add_lore_page(self, lore_page):
        """
        Adds a new lore page to the current world.

        Args:
            lore_page (str): The new lore page to add.

        Returns:
            bool: True if the lore page was successfully added, False otherwise.
        """

        worlds_collection = db["worlds"]
        try:
            result = worlds_collection.update_one({"_id": ObjectId(self.id)}, {"$push": {"lore_pages": str(lore_page)}})
            return result.modified_count == 1
        except Exception as e:
            print(e)
            return False

    @staticmethod
    def get_by_id(id):
        """
        Retrieve a world by its ID.

        Args:
            id (str): The ID of the world to retrieve.

        Returns:
            World: The retrieved world object.

        Raises:
            HTTPException: If the world with the specified ID is not found.
        """
        worlds_collection = db["worlds"]
        result = worlds_collection.find_one({"_id": ObjectId(id)})
        if result:
            return World(
                id=result["_id"],
                creator_id=result["creator_id"],
                title=result["title"],
                custom_url=result["custom_url"],
                image=result["image"],
                description=result["description"],
                private_notes=result["private_notes"],
                categories=result["categories"],
                lore_pages=result["lore_pages"],
            )
        else:
            return jsonify({"error": "World not found"}), 404

    @staticmethod
    def get_all_by_creator(creator_id):
        """
        Retrieves all worlds created by a given creator.

        Args:
            creator_id (str): The ID of the creator whose worlds to retrieve.

        Returns:
            list: A list of World objects representing the retrieved worlds.
        """
        worlds_collection = db["worlds"]
        results = worlds_collection.find({"creator_id": creator_id})
        results_list = list(results)
        worlds = []
        for result in results_list:
            world = World(
                id=result["_id"],
                creator_id=result["creator_id"],
                title=result["title"],
                custom_url=result["custom_url"],
                image=result["image"],
                description=result["description"],
                private_notes=result["private_notes"],
                categories=result["categories"],
                lore_pages=result["lore_pages"],
            )
            worlds.append(world)
        return worlds

    @staticmethod
    def get_world_by_custom_url(custom_url):
        """
        Retrieves a world by its custom URL.

        Args:
            custom_url (str): The custom URL of the world to retrieve.

        Returns:
            World: The retrieved world object.
        """
        worlds_collection = db["worlds"]
        result = worlds_collection.find_one({"custom_url": custom_url})
        if result:
            return World(
                id=result["_id"],
                creator_id=result["creator_id"],
                title=result["title"],
                custom_url=result["custom_url"],
                image=result["image"],
                description=result["description"],
                private_notes=result["private_notes"],
                categories=result["categories"],
                lore_pages=result["lore_pages"],
            )
        else:
            return None

    @staticmethod
    def delete_all_by_creator(creator):
        """
        Deletes all worlds created by the given creator.

        Args:
            creator (str): The ID of the creator whose worlds should be deleted.

        Returns:
            int: The number of worlds deleted.
        """
        worlds_collection = db["worlds"]
        results = worlds_collection.delete_many({"creator_id": creator})
        return results.deleted_count

    def delete(self):
        """
        Deletes the current object from the database.

        Returns:
            bool: True if the object was successfully deleted, False otherwise.
        """
        worlds_collection = db["worlds"]
        result = worlds_collection.delete_one({"_id": ObjectId(self.id)})
        if result.deleted_count == 1:
            return True
        else:
            return False

    def delete_many(self, ids):
        """
        Deletes multiple documents from the 'worlds' collection in the database
        based on the given list of ids.

        Args:
            ids (list): A list of ids of the documents to be deleted.

        Returns:
            int: The number of documents deleted.
        """
        worlds_collection = db["worlds"]
        results = worlds_collection.delete_many({"_id": {"$in": ids}})
        return results.deleted_count

    def update(self):
        """
        Updates the current world instance in the database with the current attribute values.

        Returns:
            bool: True if the update was successful, False otherwise.
        """
        worlds_collection = db["worlds"]
        result = worlds_collection.update_one(
            {"_id": self.id},
            {
                "$set": {
                    "title": self.title,
                    "custom_url": self.custom_url,
                    "image": self.image,
                    "description": self.description,
                    "private_notes": self.private_notes,
                    "categories": self.categories,
                    "lore_pages": self.lore_pages,
                }
            },
        )
        if result.modified_count == 1:
            return True
        else:
            return False


# Define Category model
class Category:
    # Category Schema:
    id: ObjectId
    creator_id: str
    title: str  # name -> title
    custom_url: str
    world_id: ObjectId
    image: str
    description: str
    lore_pages: list
    private_notes: str
    required_fields = ["creator_id", "title"]
    unique_fields = ["id"]

    def __init__(
        self,
        id,
        creator_id,
        title,
        custom_url=None,
        world_id=None,
        image=None,
        description=None,
        lore_pages=[],
        private_notes=None,
    ):
        self.id = id
        self.creator_id = creator_id
        self.title = title
        self.custom_url = custom_url  # Change to be set separately!!!!!!
        self.world_id = world_id
        self.image = image
        self.description = description
        self.lore_pages = lore_pages
        self.private_notes = private_notes

    def serialize(self):
        """
        Serializes the model instance into a dictionary.
        """
        return {
            "id": str(self.id),
            "creator_id": self.creator_id,
            "title": self.title,
            "custom_url": self.custom_url,
            "world": {
                "id": str(self.world_id),
                "title": str(World.get_by_id(ObjectId(self.world_id)).title),
            },
            "image": self.image,
            "description": self.description,
            "lore_pages": [str(page) for page in self.lore_pages],
            "private_notes": self.private_notes,
        }

    def save(self):
        """
        Saves the current instance of the class to the database.

        Returns:
        -------
        str
            The ID of the inserted document.
        """
        categories_collection = db["categories"]
        self.creator_id = session["user_id"]
        result = categories_collection.insert_one(
            {
                "creator_id": str(self.creator_id),
                "title": self.title,
                "custom_url": self.custom_url,
                "image": self.image,
                "description": self.description,
                "lore_pages": [str(page) for page in self.lore_pages],
                "private_notes": self.private_notes,
                "world_id": str(self.world_id),
            }
        )
        addCat = World.get_by_id(ObjectId(self.world_id))
        addCat.add_category(self.id)
        return str(result.inserted_id)

    # Add Uncategorised to database
    @staticmethod
    def add_uncategorised(world_id):
        categories_collection = db["categories"]
        result = categories_collection.insert_one(
            {
                "creator_id": session["user_id"],
                "title": "Uncategorised",
                "custom_url": "Uncategorised",
                "image": "",
                "description": "",
                "lore_pages": [],
                "private_notes": "",
                "world_id": world_id,
            }
        )
        addCat = World.get_by_id(ObjectId(world_id))
        addCat.add_category(result.inserted_id)
        if result.inserted_id:
            return True
        else:
            return False

    def add_private_note(self):
        categories_collection = db["categories"]
        try:
            result = categories_collection.update_one(
                {"_id": ObjectId(self.id)},
                {"$push": {"private_notes": self.private_notes}},
            )
            return result.modified_count == 1
        except Exception as e:
            print(e)
            return False

    def add_lore_page(self, lore_page):
        categories_collection = db["categories"]
        try:
            result = categories_collection.update_one({"_id": ObjectId(self.id)}, {"$push": {"lore_pages": str(lore_page)}})
            return result.modified_count == 1
        except Exception as e:
            print(e)
            return False

    # Remove one lore page from one category
    def remove_lore_page(self, lore_page):
        categories_collection = db["categories"]
        try:
            result = categories_collection.update_one({"_id": ObjectId(self.id)}, {"$pull": {"lore_pages": str(lore_page)}})
            return result.modified_count == 1
        except Exception as e:
            print(e)
            return False

    # Remove one lore page from all categories. Used when deleting a lore page.
    @staticmethod
    def remove_lore_page_from_all(lore_page):
        categories_collection = db["categories"]
        try:
            result = categories_collection.update_many({}, {"$pull": {"lore_pages": str(lore_page)}})
            return result.modified_count == 1
        except Exception as e:
            print(e)
            return False

    # Remove one lore page from all categories. Used when deleting a lore page.
    @staticmethod
    def remove_lore_page_from_all(lore_page):
        categories_collection = db["categories"]
        try:
            result = categories_collection.update_many({}, {"$pull": {"lore_pages": str(lore_page)}})
            return result.modified_count == 1
        except Exception as e:
            print(e)
            return False

    def delete(self):
        categories_collection = db["categories"]
        result = categories_collection.delete_one({"_id": ObjectId(self.id)})
        # TODO: Remove category from world and lore pages
        # Remove deleted category from world:
        removeCat = World.get_by_id(ObjectId(self.world_id))
        removeCat.remove_category(self.id)
        # Remove deleted category from lore pages and add to "Uncategorised":
        for lore_page in self.lore_pages:
            removeLore = LorePage.get_by_id(ObjectId(lore_page))
            removeLore.remove_category(self.id)
            # If LorePage has no categories, add to "Uncategorised"
            if len(removeLore.categories) == 0:
                removeLore.add_category("Uncategorised")
        if result.deleted_count == 1:
            return True
        else:
            return False

    @staticmethod
    def delete_all_by_creator(creator):
        categories_collection = db["categories"]
        result = categories_collection.delete_many({"creator_id": creator})
        return result.deleted_count

    @staticmethod
    def delete_all_by_world(world_id):
        categories_collection = db["categories"]
        result = categories_collection.delete_many({"world_id": world_id})
        return result.deleted_count

    def update(self):
        categories_collection = db["categories"]
        result = categories_collection.update_one(
            {"_id": ObjectId(self.id)},
            {
                "$set": {
                    "creator_id": self.creator_id,
                    "title": self.title,
                    "custom_url": self.custom_url,
                    "image": self.image,
                    "description": self.description,
                    "lore_pages": self.lore_pages,
                    "private_notes": self.private_notes,
                }
            },
        )
        if result.modified_count == 1:
            return True
        else:
            return False

    @staticmethod
    def get_by_id(id):
        categories_collection = db["categories"]
        category = categories_collection.find_one({"_id": ObjectId(id)})
        if category:
            return Category(
                str(category["_id"]),
                category["creator_id"],
                category["title"],
                category["custom_url"],
                category["world_id"],
                category["image"],
                category["description"],
                category["lore_pages"],
                category["private_notes"],
            )
        else:
            return None

    @staticmethod
    def get_all_by_creator(creator_id):
        categories_collection = db["categories"]
        categories = categories_collection.find({"creator_id": creator_id})
        return [
            Category(
                str(category["_id"]),
                category["creator_id"],
                category["title"],
                category["custom_url"],
                category["world_id"],
                category["image"],
                category["description"],
                category["lore_pages"],
                category["private_notes"],
            )
            for category in categories
        ]

    @staticmethod
    def get_all_by_world(world_id):
        categories_collection = db["categories"]
        categories = categories_collection.find({"world_id": world_id})
        return [
            Category(
                str(category["_id"]),
                category["creator_id"],
                category["title"],
                category["custom_url"],
                category["world_id"],
                category["image"],
                category["description"],
                category["lore_pages"],
                category["private_notes"],
            )
            for category in categories
        ]

    @staticmethod
    def get_by_name(title, world_id):
        """
        Retrieve a category by its title and world ID.

        Args:
            title (str): The title of the category to retrieve.
            world_id (str): The ID of the world the category belongs to.

        Returns:
            Category or None: The Category object if found, otherwise None.
        """
        categories_collection = db["categories"]
        category = categories_collection.find_one({"title": title, "world_id": world_id})
        if category:
            return Category(
                str(category["_id"]),
                category["creator_id"],
                category["title"],
                category["custom_url"],
                category["world_id"],
                category["image"],
                category["description"],
                category["lore_pages"],
                category["private_notes"],
            )
        else:
            return None


class LorePage:
    # LorePage Schema:
    id: ObjectId
    world_id: ObjectId
    creator_id: ObjectId
    title: str  # name -> title
    custom_url: str
    world_id: ObjectId
    categories: list
    image: str
    description: str
    summary: str  # short_description -> summary
    connections: list  # ---> connections
    private_notes: str

    def __init__(
        self,
        id,
        creator_id,
        title,
        world_id,
        custom_url=None,
        categories=["Uncategorised"],
        image=None,
        description=None,
        summary=None,
        connections=[],
        private_notes=[],
    ):
        self.id = id
        self.creator_id = creator_id
        self.title = title
        self.world_id = world_id
        self.custom_url = custom_url  # change to be set separately!!!!!!!!!!!
        self.categories = categories
        self.image = image
        self.description = description
        self.summary = summary
        self.connections = connections
        self.private_notes = private_notes

    def serialize(self):
        return {
            "id": str(self.id),
            "creator_id": self.creator_id,
            "world_id": self.world_id,
            "title": self.title,
            "custom_url": self.custom_url,
            "categories": self.categories,
            "image": self.image,
            "description": self.description,
            "summary": self.summary,
            "connections": self.connections,
            "private_notes": self.private_notes,
        }

    def save(self):
        lorepages_collection = db["lorepages"]
        lorepage_data = {
            "creator_id": self.creator_id,
            "world_id": str(self.world_id),
            "title": self.title,
            "custom_url": self.custom_url,
            "categories": self.categories,
            "image": self.image,
            "description": self.description,
            "summary": self.summary,
            "connections": self.connections,
            "private_notes": self.private_notes,
        }

        result = lorepages_collection.insert_one(lorepage_data)
        self.id = str(result.inserted_id)

        # add LorePage to Category
        for category in self.categories:
            categories_collection = db["categories"]
            result = categories_collection.update_one({"_id": ObjectId(category)}, {"$push": {"lore_pages": str(self.id)}})

        # add LorePage to World
        addLore = World.get_by_id(ObjectId(self.world_id))
        addLore.add_lore_page(self.id)

        return self.id

    def add_category(self, category):
        """
        Adds a category to the lorepage.

        Args:
            category (str): The category to add.

        Returns:
            bool: True if the category was added successfully, False otherwise.
        """
        lorepages_collection = db["lorepages"]
        try:
            result = lorepages_collection.update_one(
                {"_id": ObjectId(self.id)},
                {"$push": {"categories": str(Category.get_by_name(category).id)}},
            )
            return result.modified_count == 1
        except Exception as e:
            print(e)
            return False

    def remove_category(self, category):
        """
        Removes a category from the lorepage.

        Args:
            category (str): The category to remove.

        Returns:
            bool: True if the category was removed successfully, False otherwise.
        """
        lorepages_collection = db["lorepages"]
        try:
            result = lorepages_collection.update_one(
                {"_id": ObjectId(self.id)},
                {"$pull": {"categories": str(Category.get_by_name(category).id)}},
            )
            return result.modified_count == 1
        except Exception as e:
            print(e)
            return False

    def add_private_note(self):
        lorepages_collection = db["lorepages"]
        try:
            result = lorepages_collection.update_one(
                {"_id": ObjectId(self.id)},
                {"$push": {"private_notes": self.private_notes}},
            )
            return result.modified_count == 1
        except Exception as e:
            print(e)
            return False

    # Add connection to lorepage, it has two properties: the ID of the lore page it's connected to and the type of connection
    def add_connection(self, type, connection):
        lorepages_collection = db["lorepages"]
        try:
            result = lorepages_collection.update_one(
                {"_id": ObjectId(self.id)},
                {
                    "$push": {
                        "connections": {
                            "type": type,
                            "target_id": self.get_by_id(connection).id,
                        }
                    }
                },
            )
            return result.modified_count == 1
        except Exception as e:
            print(e)
            return False

    """TODO: if lorepage is deleted, delete it from all connections and add its name as a string
    to all lorepages that had a connection with it"""

    def delete(self):
        lorepages_collection = db["lorepages"]
        lorepages_collection.delete_one({"_id": ObjectId(self.id)})

    @staticmethod
    def delete_all_by_creator(creator):
        lorepages_collection = db["lorepages"]
        lorepages_collection.delete_many({"creator_id": creator})

    @staticmethod
    def delete_all_by_world(world):
        lorepages_collection = db["lorepages"]
        lorepages_collection.delete_many({"world": world})

    def update(self):
        lorepages_collection = db["lorepages"]
        lorepage_data = {
            "title": self.title,
            "creator_id": self.creator_id,
            "categories": self.categories,
            "image": self.image,
            "description": self.description,
            "summary": self.summary,
            "connections": self.connections,
            "private_notes": self.private_notes,
        }
        lorepages_collection.update_one({"_id": ObjectId(self.id)}, {"$set": lorepage_data})

    @staticmethod
    def get_by_id(id):
        lorepages_collection = db["lorepages"]
        lorepage = lorepages_collection.find_one({"_id": ObjectId(id)})
        if lorepage:
            print(lorepage)
            return LorePage(
                str(lorepage["_id"]),
                lorepage["creator_id"],
                lorepage["title"],
                lorepage["world_id"],
                lorepage["custom_url"],
                lorepage["categories"],
                lorepage["image"],
                lorepage["description"],
                lorepage["summary"],
                lorepage["connections"],
                lorepage["private_notes"],
            )
        else:
            return None

    @staticmethod
    def get_all_by_creator(creator_id):
        lorepages_collection = db["lorepages"]
        lorepages = lorepages_collection.find({"creator_id": creator_id})
        return [
            LorePage(
                str(lorepage["_id"]),
                lorepage["creator_id"],
                lorepage["title"],
                lorepage["world_id"],
                lorepage["custom_url"],
                lorepage["categories"],
                lorepage["image"],
                lorepage["description"],
                lorepage["summary"],
                lorepage["connections"],
                lorepage["private_notes"],
            )
            for lorepage in lorepages
        ]

    @staticmethod
    def get_all_by_world(world_id):
        lorepages_collection = db["lorepages"]
        lorepages = lorepages_collection.find({"world_id": world_id})
        return [
            LorePage(
                str(lorepage["_id"]),
                lorepage["creator_id"],
                lorepage["title"],
                lorepage["world_id"],
                lorepage["custom_url"],
                lorepage["categories"],
                lorepage["image"],
                lorepage["description"],
                lorepage["summary"],
                lorepage["connections"],
                lorepage["private_notes"],
            )
            for lorepage in lorepages
        ]

    @staticmethod
    def get_all_by_category(category):
        lorepages_collection = db["lorepages"]
        lorepages = lorepages_collection.find({"categories": category})
        return [
            LorePage(
                str(lorepage["_id"]),
                lorepage["creator_id"],
                lorepage["title"],
                lorepage["world_id"],
                lorepage["custom_url"],
                lorepage["categories"],
                lorepage["image"],
                lorepage["description"],
                lorepage["summary"],
                lorepage["connections"],
                lorepage["private_notes"],
            )
            for lorepage in lorepages
        ]

    @staticmethod
    def get_all_lore_page_urls_from_world(world_id):
        """
        Returns a list of all lore page URLs from the 'lorepages' collection in the database.
        """
        lorepages_collection = db["lorepages"]
        results = lorepages_collection.find({"world_id": world_id})
        results_list = list(results)
        lore_page_urls = []
        for result in results_list:
            lore_page_urls.append(result["custom_url"])
        return lore_page_urls

    @staticmethod
    def get_by_connections(connections):
        """
        Returns a list of LorePage objects that are connected to the specified LorePage.

        Args:
            connections (list): A list of connections to filter by.

        Returns:
            list: A list of LorePage objects.
        """
        lorepages_collection = db["lorepages"]
        lorepages = lorepages_collection.find({"connections": {"$elemMatch": {"target_id": {"$in": connections}}}})
        return [
            LorePage(
                str(lorepage["_id"]),
                lorepage["creator_id"],
                lorepage["title"],
                lorepage["world_id"],
                lorepage["custom_url"],
                lorepage["categories"],
                lorepage["image"],
                lorepage["description"],
                lorepage["summary"],
                lorepage["connections"],
                lorepage["private_notes"],
            )
            for lorepage in lorepages
        ]

    @staticmethod
    def remove_from_all_connections(lore_page_id):
        """
        Removes the specified LorePage from all connections.

        Args:
            lore_page_id (str): The ID of the LorePage to remove from all connections.

        Returns:
            bool: True if the LorePage was successfully removed from all connections, False otherwise.
        """
        lorepages_collection = db["lorepages"]
        try:
            result = lorepages_collection.update_many({}, {"$pull": {"connections": {"target_id": lore_page_id}}})
            return result.modified_count == 1
        except Exception as e:
            print(e)
            return False

    @staticmethod
    def remove_from_all_categories(lore_page_id):
        """
        Removes the specified LorePage from all categories.

        Args:
            lore_page_id (str): The ID of the LorePage to remove from all categories.

        Returns:
            bool: True if the LorePage was successfully removed from all categories, False otherwise.
        """
        categories_collection = db["categories"]
        try:
            result = categories_collection.update_many({}, {"$pull": {"lore_pages": lore_page_id}})
            return result.modified_count == 1
        except Exception as e:
            print(e)
            return False