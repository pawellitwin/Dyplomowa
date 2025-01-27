from pymongo import MongoClient

uri = "mongodb+srv://test:test@moviedb.xjyes.mongodb.net/?retryWrites=true&w=majority&appName=moviedb"

client = MongoClient(uri)

db = client["moviedb"]

users_collection = db["users"]