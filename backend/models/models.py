from pymongo import MongoClient
from bson import ObjectId
import os

client = MongoClient(os.getenv('MONGODB_URI', 'mongodb+srv://arihansharma:williamzeng@waterloodates.inpqtig.mongodb.net/?retryWrites=true&w=majority&appName=WaterlooDates'))
db = client['waterloo-dates']

class User:
    collection = db['users']
    
    def __init__(self, name, email, age):
        self.name = name
        self.email = email
        self.age = age
    
    def save(self):
        user_data = {
            'name': self.name,
            'email': self.email,
            'age': self.age
        }
        return self.collection.insert_one(user_data)
    
    @classmethod
    def find_all(cls):
        return list(cls.collection.find())
    
    @classmethod
    def find_by_id(cls, user_id):
        return cls.collection.find_one({'_id': ObjectId(user_id)}) 