from collections import OrderedDict
import datetime, os  # , jwt
from random import Random
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask import Flask, Response, jsonify, render_template, request, session
import pytz
from api.models import User, World, Category, LorePage
from pprint import pprint
import requests
from faker import Faker
from bson import ObjectId

from dotenv import load_dotenv

load_dotenv()

uri = os.getenv("DOMAIN")

current_dir = os.path.dirname(os.path.abspath(__file__))
static_folder_path = os.path.join(current_dir, '../frontend/build')
template_folder_path = os.path.join(current_dir, '../frontend/build')
app = Flask(__name__, static_folder=static_folder_path, static_url_path="", template_folder=template_folder_path)

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

if os.getenv("LOCAL") == "True":
    client = MongoClient("mongodb://localhost:27017/")
else:
    client = MongoClient("mongodb+srv://" + os.getenv("MONGODB_USER") + ":" + os.getenv("MONGODB_PASSWORD") + "@" + os.getenv("MONGODB_URL") + "/?retryWrites=true&w=majority")
app.json.sort_keys = False  # Stop jsonify from sorting keys alphabetically

# # Create a new client and connect to the server
# client = MongoClient(uri, server_api=ServerApi('1'))

# Connect to MongoDB
db = client["LoreDump"]

# Session Time-To-Alive, until user has to log in again
ttl = 60  # minutes

# Send a ping to confirm a successful connection
try:
    client.admin.command("ping")
    if os.getenv("LOCAL") == "True":
        print("Pinged your local MongoDB instance. You successfully connected to MongoDB!")
    else:
        print("Pinged your deployment. You successfully connected to the real remote MongoDB!")
except Exception as e:
    print(e)

fake = Faker()

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file("index.html")

@app.route('/')
def home():
    return app.send_static_file('index.html')

# @app.route("/", methods=["GET"])
# def index():
#     if request.method == "GET":
#         if session["ttl"] < datetime.datetime.utcnow():
#             # Reset session Time-To-Live
#             session["ttl"] = datetime.datetime.utcnow() + datetime.timedelta(minutes=ttl)
#         else:
#             # Delete session
#             session.clear()
#             return jsonify({"error": "Session expired"}), 401
#         return jsonify({"message": "Welcome to LoreDump!"})


# Get currently logged in user's ID:
@app.route("/api/id", methods=["GET"])
def get_id():
    if not session:
        session.clear()
        return jsonify({"error": "User not logged in"}), 401
    if request.method == "GET":
        return jsonify({"id": session["user_id"], "username": session["username"]}), 200


# Routes for User model
# Get currently logged in user:
@app.route("/api/user", methods=["GET", "PUT", "DELETE"])
def user():
    """
    Returns the username of the logged in user, if any.
    """
    if request.method == "GET":
        try:
            if "user_id" not in session:
                return jsonify({"error": "User not logged in"}), 401
            user = User.get_by_id(session["user_id"])
            return jsonify(user.serialize())
        except Exception as e:
            return jsonify({"error": str(e)}), 401
    if request.method == "PUT":
        try:
            if "user_id" not in session:
                return jsonify({"error": "User not logged in"}), 401
            user = User.get_by_id(session["user_id"])
            # user.username = request.json['username']
            if "password" in request.json:
                user.password = request.json["password"]
            else:
                user.password = user.password
            user.save()
            return jsonify({"success": "User successfully updated"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400
    if request.method == "DELETE":
        try:
            if "user_id" not in session:
                return jsonify({"error": "User not logged in"}), 401
            user = User.get_by_id(session["user_id"])
            user.delete()
            World.delete_all_by_creator(user.id)
            Category.delete_all_by_creator(user.id)
            LorePage.delete_all_by_creator(user.id)
            session.clear()
            return jsonify({"success": "User successfully deleted"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400


@app.route("/register", methods=["POST"])
def register():
    if session:
        session.clear()
        return jsonify({"error": "User already logged in, logging you out"}), 401
    # Register new user:
    if request.method == "POST":
        try:
            # Get username and password from request body
            username = request.json["username"]
            password = request.json["password"]
            user = User(None, username, password)
            user.register()
            return jsonify({"success": "User successfully created"}), 200
        except Exception as e:
            if str(e) == "User already exists":
                return jsonify({"error": "User already exists"}), 409
            if str(e) == "Invalid username or password":
                return jsonify({"error": "Invalid username or password"}), 400
            return jsonify({"error": str(e)}, 400)


@app.route("/login", methods=["GET", "POST"])
def login():
    # Login user:
    if request.method == "POST":
        try:
            # Get username and password from request body
            if session:
                session.clear()
                return jsonify({"error": "User already logged in, logging you out"}), 401
            username = request.json["username"]
            password = request.json["password"]
            user = User(None, username, password)
            user.login()
            """ OLD CODE:
            # Check if user exists
            if not user:
                return jsonify({'error': 'User not found'}), 404
            # Check if password is correct
            if not user.check_password(password):
                return jsonify({'error': 'Invalid password'}), 401
            # session = Session(username)
            # session.save()
            # token = session.token
            # response = jsonify({'success': 'User successfully logged in'})
            # response.headers['Authorization'] = f'Bearer {token}'
            # return response, {'Authorization': f'Bearer {token}'}
            session['user_id'] = user.id
            session['username'] = user.username
            session['ttl'] = datetime.datetime.now(pytz.utc) + datetime.timedelta(minutes=ttl)"""
            return jsonify({"success": "User successfully logged in"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 401

    if request.method == "GET":
        if session:
            # If session exists, log user in automatically:
            return jsonify({"success": "User already logged in"}), 200
        else:
            return jsonify({"error": "Please log in"})


@app.route("/protected")
def protected():
    # Check if user is logged in
    if "user_id" not in session:
        return jsonify({"error": "User not logged in"}), 401
    # Get user ID from session
    user_id = session["user_id"]
    user = User.get_by_id(user_id)
    return jsonify({"id": str(user.id), "username": user.username}), 200


@app.before_request
def before_request():
    """
    This function is executed before each request to the server.
    It checks if the user is logged in and if the session has expired.
    """
    if request.endpoint in ["register", "login", "add_fake_data", "index", "home", "static"]:
        return
    if "user_id" not in session:
        return jsonify({"error": "User not logged in"}), 401
    if session["ttl"] > datetime.datetime.now(pytz.utc):
        # Reset session Time-To-Live
        session["ttl"] = datetime.datetime.now(pytz.utc) + datetime.timedelta(minutes=ttl)
    else:
        # Delete session
        session.clear()
        return jsonify({"error": "Session expired"}), 401


@app.route("/logout", methods=["POST"])
def logout():
    # Clear session:
    if "user_id" not in session:
        return jsonify({"error": "User not logged in"}), 401
    session.clear()
    return jsonify({"success": "User successfully logged out"}), 200


# Routes for World model
@app.route("/api/worlds", methods=["GET", "POST"])
def get_worlds():
    if request.method == "GET":
        worlds = World.get_all_by_creator(session["user_id"])
        if worlds:
            session["world_id"] = ""
            return jsonify([world.serialize() for world in worlds])
        else:
            return jsonify({"error": "User hasn't created any worlds"}), 404

    elif request.method == "POST":
        unavailable_urls = World.get_all_custom_urls_from_worlds()
        if request.json["custom_url"] in unavailable_urls:
            return jsonify({"error": "URL is already in use"}), 409
        try:
            world = World(
                id=None,
                title=request.json["title"],
                custom_url=request.json["custom_url"],
                creator_id=session["user_id"],
                description=request.json["description"],
                image=request.json["image"],
                private_notes=request.json["private_notes"],
            )
            world.id = world.save()
            Category.add_uncategorised(str(world.id))
            return jsonify({"success": "World successfully created", "id": str(world.id)}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400


@app.route("/api/worlds/<world_id>", methods=["GET", "PATCH", "DELETE"])
def get_world(world_id):
    if session["user_id"] != World.get_by_id(world_id).creator_id:
        return jsonify({"error": "Unauthorized"}), 401
    if request.method == "GET":
        world = World.get_by_id(world_id)
        if not world:
            return jsonify({"error": "World not found"}), 404
        else:
            return jsonify(world.serialize())
    elif request.method == "PATCH":
        try:
            world = World.get_by_id(world_id)
            if not world:
                return jsonify({"error": "World not found"}), 404
            for key, value in request.json.items():
                if hasattr(world, key):
                    setattr(world, key, value)
            # Check if URL is in use:
            if "custom_url" in request.json:
                if " " in request.json["custom_url"]:
                    return jsonify({"error": "URL can't contain spaces"}), 400
                unavailable_urls = World.get_all_custom_urls_from_worlds()
                if request.json["custom_url"] in unavailable_urls:
                    return (
                        jsonify({"error": "URL is already in use, it must be unique inside the world"}),
                        409,
                    )

            world.update()
            return jsonify({"success": "World successfully updated"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400
    elif request.method == "DELETE":
        try:
            world = World.get_by_id(world_id)
            if not world:
                return jsonify({"error": "World not found"}), 404
            world.delete()
            Category.delete_all_by_world(str(world.id))
            LorePage.delete_all_by_world(str(world.id))
            return jsonify({"success": "World successfully deleted"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400


# Routes for Category model
@app.route("/api/worlds/<world_id>/categories", methods=["GET", "POST"])
def get_categories(world_id):
    if session["user_id"] != World.get_by_id(world_id).creator_id:
        return jsonify({"error": "Unauthorized"}), 401
    if request.method == "GET":
        categories = Category.get_all_by_world(world_id)
        if categories:
            return jsonify([category.serialize() for category in categories])
        else:
            return jsonify({"error": "World doesn't have any categories"}), 404
    elif request.method == "POST":
        try:
            category = Category(
                id=None,
                title=request.json["title"],
                creator_id=session["user_id"],
                description=request.json["description"],
                image=request.json["image"],
                private_notes=request.json["private_notes"],
                world_id=world_id,
                custom_url=request.json["custom_url"],
                lore_pages=request.json["lore_pages"],
            )
            if " " in category.custom_url:
                return jsonify({"error": "URL can't contain spaces"}), 400
            # Check if URL is in use:
            if category.custom_url in Category.get_all_category_urls_from_world(world_id):
                return (
                    jsonify({"error": "URL is already in use, it must be unique inside the world"}),
                    409,
                )
            # Check if title is unique inside the world:
            if category.title in Category.get_all_names_from_world(world_id):
                return (
                    jsonify({"error": "Category title is already in use, it must be unique inside the world"}),
                    409,
                )
            result = category.save()
            if "lore_pages" in request.json:
                for lore_page_id in request.json["lore_pages"]:
                    lorePage = LorePage.get_by_id(lore_page_id)
                    lorePage.add_category(request.json["title"])
            # World.add_category(world_id, category.id)
            return jsonify({"success": "Category successfully created", "id": result}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400


@app.route("/api/worlds/<world_id>/categories/<category_id>", methods=["GET", "PATCH", "DELETE"])
def get_category(world_id, category_id):
    if session["user_id"] != World.get_by_id(world_id).creator_id:
        return jsonify({"error": "Unauthorized"}), 401
    if request.method == "GET":
        category = Category.get_by_id(category_id)
        if not category:
            return jsonify({"error": "Category not found"}), 404
        else:
            return jsonify(category.serialize())
    elif request.method == "PATCH":
        try:
            category = Category.get_by_id(category_id)
            if not category:
                return jsonify({"error": "Category not found"}), 404
            for key, value in request.json.items():
                if hasattr(category, key):
                    setattr(category, key, value)
            if "title" in request.json and category.title == "Uncategorised":
                return jsonify({"error": "Can't rename uncategorised category"}), 400
            # Check if URL is in use:
            if "custom_url" in request.json:
                if " " in request.json["custom_url"]:
                    return jsonify({"error": "URL can't contain spaces"}), 400
                unavailable_urls = Category.get_all_category_urls_from_world(world_id)
                if category.custom_url in unavailable_urls:
                    unavailable_urls.remove(category.custom_url)
                if request.json["custom_url"] in unavailable_urls:
                    return (
                        jsonify({"error": "URL is already in use, it must be unique inside the world"}),
                        409,
                    )
            # Remove lore page from current category
            if "lore_pages" in request.json and "unlink_lore_page" in request.json:
                for lore_page_id in category.lore_pages:
                    lorePage = LorePage.get_by_id(lore_page_id)
                    lorePage.remove_category(category_id)
                    category.remove_lore_page(lore_page_id)
                    # If edited lore page has no categories, add it to uncategorised category
                    lorePage = LorePage.get_by_id(lore_page_id)
                    if lorePage.categories == []:
                        lorePage.add_category("Uncategorised")
                        # NEED TO ALSO ADD PAGE TO UNCATEGORIZED CATEGORY
                        # Add lore page to new category
                        addCat = Category.get_by_name("Uncategorised", world_id)
                        addCat.add_lore_page(lore_page_id)
                return jsonify({"success": "Category successfully updated"}), 200
            category.update()
            return jsonify({"success": "Category successfully updated"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400
    elif request.method == "DELETE":
        try:
            category = Category.get_by_id(category_id)
            if not category:
                return jsonify({"error": "Category not found"}), 404
            if category.title == "Uncategorised":
                return jsonify({"error": "Can't delete uncategorised category"}), 400
            category.delete()
            return jsonify({"success": "Category successfully deleted"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400


# Routes for LorePage model
@app.route("/api/worlds/<world_id>/lore_pages", methods=["GET", "POST"])
def get_lore_pages(world_id):
    if session["user_id"] != World.get_by_id(world_id).creator_id:
        return jsonify({"error": "Unauthorized"}), 401
    if request.method == "GET":
        lore_pages = LorePage.get_all_by_world(world_id)
        if lore_pages:
            return jsonify([lore_page.serialize() for lore_page in lore_pages])
        else:
            return jsonify({"error": "World doesn't have any lore pages"}), 404
    elif request.method == "POST":
        try:
            # Check if empty strings in categories list and remove all of them
            request.json["categories"] = list(filter(None, request.json["categories"]))
            # If categories list is empty, add uncategorised category
            if not request.json["categories"]:
                request.json["categories"] = [str(Category.get_by_name("Uncategorised", world_id).id)]
            lore_page = LorePage(
                id=None,
                title=request.json["title"],
                creator_id=session["user_id"],
                world_id=world_id,
                custom_url=request.json["custom_url"],
                description=request.json["description"],
                image=request.json["image"],
                private_notes=request.json["private_notes"],
                categories=request.json["categories"],
                summary=request.json["summary"],
                connections=request.json["connections"],
            )
            # # if categories list is empty, add uncategorised category
            # if lore_page.categories == []:
            #     lore_page.categories = [Category.get_by_name("Uncategorised", world_id).id]
            if " " in lore_page.custom_url:
                return jsonify({"error": "URL can't contain spaces"}), 400
            # Check if URL is in use:
            if lore_page.custom_url in LorePage.get_all_lore_page_urls_from_world(world_id):
                return (
                    jsonify({"error": "URL is already in use, it must be unique inside the world"}),
                    409,
                )
            # if str(Category.get_by_name("Uncategorised", world_id).id) in lore_page.categories and len(lore_page.categories) > 0:
            #     lore_page.categories.remove(str(Category.get_by_name("Uncategorised", world_id).id))
            result = lore_page.save()
            return (
                jsonify({"success": "Lore page successfully created", "id": result}),
                200,
            )
        except Exception as e:
            return jsonify({"error": str(e)}), 400


@app.route(
    "/api/worlds/<world_id>/lore_pages/<lore_page_id>",
    methods=["GET", "DELETE", "PATCH"],
)
def get_lore_page(world_id, lore_page_id):
    if session["user_id"] != World.get_by_id(world_id).creator_id:
        return jsonify({"error": "Unauthorized"}), 401
    if request.method == "GET":
        lore_page = LorePage.get_by_id(lore_page_id)
        if not lore_page:
            return jsonify({"error": "Lore page not found"}), 404
        else:
            # pprint(vars(lore_page))
            return jsonify(lore_page.serialize())
    elif request.method == "PATCH":
        try:
            lore_page = LorePage.get_by_id(lore_page_id)
            if not lore_page:
                return jsonify({"error": "Lore page not found"}), 404
            for key, value in request.json.items():
                if hasattr(lore_page, key):
                    setattr(lore_page, key, value)
            # Check if URL is in use:
            if "custom_url" in request.json:
                if " " in request.json["custom_url"]:
                    return jsonify({"error": "URL can't contain spaces"}), 400
                unavailable_urls = LorePage.get_all_lore_page_urls_from_world(world_id)
                if lore_page.custom_url in unavailable_urls:
                    unavailable_urls.remove(lore_page.custom_url)
                if request.json["custom_url"] in unavailable_urls:
                    return (
                        jsonify({"error": "URL is already in use, it must be unique inside the world"}),
                        409,
                    )

            # Remove lore page from current category
            if "categories" in request.json and "unlink_lore_page" in request.json:
                lorePage = LorePage.get_by_id(lore_page_id)
                lorePage.remove_category(request.json["categories"])
                category = Category.get_by_id(request.json["categories"])
                category.remove_lore_page(lore_page_id)
                # If edited lore page has no categories, add it to uncategorised category
                lorePage = LorePage.get_by_id(lore_page_id)
                if lorePage.categories == []:
                    lorePage.add_category("Uncategorised")
                    addCat = Category.get_by_name("Uncategorised", world_id)
                    addCat.add_lore_page(lore_page_id)
                return jsonify({"success": "Category successfully updated"}), 200

            lore_page.update()
            lore_page = LorePage.get_by_id(lore_page_id)
            if lore_page.categories == []:
                lore_page.add_category("Uncategorised")
                addCat = Category.get_by_name("Uncategorised", world_id)
                addCat.add_lore_page(lore_page_id)
            if len(lore_page.categories) > 1 and str(Category.get_by_name("Uncategorised", world_id).id) in lore_page.categories:
                print(f"Tulee tännepäin: {lore_page.categories}")
                lore_page.remove_category(str(Category.get_by_name("Uncategorised", world_id).id))
            return jsonify({"success": "Lore page successfully updated"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400
    elif request.method == "DELETE":
        try:
            lore_page = LorePage.get_by_id(lore_page_id)
            if not lore_page:
                return jsonify({"error": "Lore page not found"}), 404
            # Delete lore page from all categories
            Category.remove_lore_page_from_all(lore_page_id)
            # Delete lore page from all connections
            lore_page.remove_from_all_connections(lore_page_id)
            # Delete lore page from world
            World.remove_lore_page(world_id, lore_page_id)
            # Delete lore page from database
            lore_page.delete()
            return jsonify({"success": "Lore page successfully deleted"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400


# add fake data:
@app.route("/api/fake-data", methods=["POST", "DELETE"])
def add_fake_data():
    if app.debug == False and client != MongoClient("mongodb://localhost:27017/"):
        return jsonify({"error": "Can't add fake data outside of debug mode"}), 400
    if request.method == "POST":
        try:
            num_users = request.json.get("num_users", 5)
            num_worlds_per_user = request.json.get("num_worlds_per_user", 2)
            num_lore_pages_per_world = request.json.get("num_lore_pages_per_world", 2)
            num_categories_per_world = request.json.get("num_categories_per_world", 2)
            categories = ["Uncategorised"]

            for _ in range(num_users):
                username = fake.unique.first_name()
                # Make sure username is at least 4 characters long
                while len(username) < 4:
                    username = fake.unique.first_name()
                password = fake.password()
                last_password = password
                user = User(id=None, username=username, password=password)
                print(f"username: {username}, password: {password}")
                user.register()
                user = User.get_by_username(username)
                session["user_id"] = user.id
                session["username"] = user.username
                session["ttl"] = datetime.datetime.now(pytz.utc) + datetime.timedelta(minutes=ttl)
                # print(f'user.id = {user.id}, session.id = {session["user_id"]}, database id = {User.get_by_username(username).id})')

                for _ in range(num_worlds_per_user):
                    world = World(
                        id=ObjectId(),
                        creator_id=session["user_id"],
                        title=fake.word(),
                        custom_url=fake.word(),
                        image=fake.image_url(),
                        private_notes=fake.text(),
                        description=fake.text(),
                    )
                    world.id = world.save()
                    world = World.get_by_id(world.id)
                    Category.add_uncategorised(str(world.id))

                    for _ in range(num_categories_per_world):
                        category = Category(
                            id=ObjectId(),
                            creator_id=session["user_id"],
                            world_id=world.id,
                            title=fake.word(),
                            custom_url=fake.word(),
                            description=fake.text(),
                            image=fake.image_url(),
                            private_notes=fake.text(),
                        )
                        category.save()
                        categories.append(category.title)

                    for _ in range(num_lore_pages_per_world):
                        random_category = categories[Random().randrange(0, len(categories))]  # adds random category
                        lore_page = LorePage(
                            id=ObjectId(),
                            creator_id=world.creator_id,
                            world_id=world.id,
                            custom_url=fake.word(),
                            title=fake.sentence(),
                            description=fake.text(),
                            image=fake.image_url(),
                            private_notes=fake.text(),
                            categories=[Category.get_by_name(random_category, str(world.id)).id],
                        )
                        lore_page.save()
                    categories = ["Uncategorised"]
                session.clear()
                categories = ["Uncategorised"]
            user.password = last_password
            user.login()
            return (
                jsonify({"success": f"Fake data successfully added, logged in as {user.username}"}),
                200,
            )
        except Exception as e:
            return jsonify({"error": str(e)}), 400
    elif request.method == "DELETE":
        # Drop LoreDump Database
        client.drop_database("LoreDump")
        session.clear()
        return jsonify({"success": "Fake data successfully deleted"}), 200


if __name__ == "__main__":
    if os.getenv("DEBUG") == "True":
        app.run("127.0.0.1", port=3001, debug=True)
    else:
        app.run("127.0.0.1", port=3001, debug=False)
