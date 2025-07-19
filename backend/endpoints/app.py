from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient(os.getenv('MONGODB_URI'))
db = client['WaterlooDates']
users_collection = db['users']

@app.route('/')
def home():
    return jsonify({'message': 'WaterlooDates API is running!'})

@app.route('/api/health')
def health():
    return jsonify({'status': 'OK', 'timestamp': datetime.now().isoformat()})

@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        users = list(users_collection.find())
        for user in users:
            user['_id'] = str(user['_id'])
        return jsonify(users)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/users', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        result = users_collection.insert_one(data)
        return jsonify({'_id': str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/users/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        if not user:
            return jsonify({'error': 'User not found'}), 404
        user['_id'] = str(user['_id'])
        return jsonify(user)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 