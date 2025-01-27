from flask import Flask, jsonify, request
import pickle
from mongodb import users_collection
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
import requests
from bson.objectid import ObjectId

rest_port = 8060
app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
app.config["JWT_SECRET_KEY"] = "supersecretkey"
jwt = JWTManager(app)

movie_list = pickle.load(open('movies_list.pkl', 'rb'))
similarity = pickle.load(open('similarity.pkl', 'rb'))
titles = movie_list['title'].values


def fetch_poster(movie_id):
    url = "https://api.themoviedb.org/3/movie/{}?api_key=c7ec19ffdd3279641fb606d19ceb9bb1&language=en-US".format(
        movie_id)
    data = requests.get(url)
    data = data.json()
    poster_path = data['poster_path']
    full_path = "https://image.tmdb.org/t/p/w500/" + poster_path
    return full_path


@app.before_request
def handle_options():
    if request.method == 'OPTIONS':
        response = app.make_response('')
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'
        return response, 200


@app.route('/movies', methods=['GET'])
def get_movies():
    return jsonify(titles.tolist())


@app.route('/recommendations', methods=['GET'])
def recommend():
    movie = request.args.get('movie')
    index = movie_list[movie_list['title'] == movie].index[0]
    distance = sorted(list(enumerate(similarity[index])), reverse=True, key=lambda vector: vector[1])
    response = []
    for i in distance[1:6]:
        movie_id = movie_list.iloc[i[0]].id
        title = movie_list.iloc[i[0]].title
        poster = fetch_poster(movie_id)
        response.append({
            "title": title,
            "poster": poster,
            "id": int(movie_id)
        })

    return response


@app.route('/register', methods=['POST'])
def add_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    if users_collection.find_one({"username": username}):
        return jsonify({"error": "User already exists"}), 400

    hashed_password = generate_password_hash(password)

    user = {"username": username, "password": hashed_password}
    users_collection.insert_one(user)

    return jsonify({"message": "User created successfully"}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    user = users_collection.find_one({"username": username})

    if not user or not check_password_hash(user['password'], password):
        return jsonify({"error": "Invalid username or password"}), 401

    access_token = create_access_token(identity=str(user['_id']))
    return jsonify({"access_token": access_token}), 200


@app.route('/favorites', methods=['POST'])
@jwt_required()
def add_favorite():
    try:
        user_id = get_jwt_identity()
        if not user_id:
            return jsonify({"error": "Invalid token"}), 401

        movie_id = request.args.get('movie_id')
        if not movie_id:
            return jsonify({"error": "Movie ID is required"}), 400

        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404

        if movie_id in user.get("favorite_movies", []):
            return jsonify({"message": "This movie is already in your favorites"}), 409

        users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$push": {"favorite_movies": movie_id}}
        )

        favorite_movies = users_collection.find_one({"_id": ObjectId(user_id)})["favorite_movies"]
        return jsonify({"favorite_movies": favorite_movies}), 200
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    user_id = get_jwt_identity()

    try:
        user_id = ObjectId(user_id)
    except Exception as e:
        return jsonify({"error": "Invalid user ID format"}), 400

    user = users_collection.find_one({"_id": user_id})

    if not user:
        return jsonify({"error": "User not found"}), 404

    favorite_movies = user.get("favorite_movies", [])

    return jsonify({"favorite_movies": favorite_movies}), 200


@app.route('/favorite_movies', methods=['GET'])
@jwt_required()
def get_favorite_movies():
    user_id = get_jwt_identity()

    try:
        user_id = ObjectId(user_id)
    except Exception as e:
        return jsonify({"error": "Invalid user ID format"}), 400

    user = users_collection.find_one({"_id": user_id})

    if not user:
        return jsonify({"error": "User not found"}), 404

    favorite_movie_ids = user.get("favorite_movies")
    print(favorite_movie_ids)

    if not favorite_movie_ids:
        print("brak")
        return jsonify({"favorite_movies": []}), 200

    response = []

    for movie_id in favorite_movie_ids:

        movie_data = movie_list[movie_list['id'] == int(movie_id)]

        if not movie_data.empty:
            title = movie_data.iloc[0]['title']
            poster = fetch_poster(int(movie_id))
            response.append({
                "title": title,
                "poster": poster,
                "id": int(movie_id)
            })

    return jsonify({"favorite_movies": response}), 200


if __name__ == '__main__':
    app.run(debug=True, port=rest_port)