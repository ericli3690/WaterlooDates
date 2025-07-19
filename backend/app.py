from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv
from datetime import datetime
import cloudinary
import cloudinary.uploader

# Import endpoint functions
from endpoints.user import health, create_or_get_user
from endpoints.rizzume import create_or_upload_rizzume, upload_to_cloudinary

load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB connection
mongodb_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
print(f"Connecting to MongoDB: {mongodb_uri}")
client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=5000)

# Test database connection
try:
    client.admin.command('ping')
    print("✅ MongoDB connection successful!")
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
    print("Make sure MongoDB is running or check your connection string")

# Register routes
app.route('/api/health')(health)
app.route('/api/create_or_get_user', methods=['POST'])(create_or_get_user)
app.route('/api/create_or_upload_rizzume', methods=['POST'])(create_or_upload_rizzume)

@app.route('/')
def home():
    return jsonify({'message': 'WaterlooDates API is running!'})

@app.route('/api/get_rizzume', methods=['POST'])
def get_rizzume():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400
        
        # Import collections from endpoints
        from endpoints.user import users_collection
        from endpoints.rizzume import rizzume_collection
        
        existing_user = users_collection.find_one({'user_id': user_id})
        if not existing_user:
            return jsonify({'error': 'user not found'}), 404
        if existing_user['rizzume_created'] == False:
            return jsonify({'error': 'user exists, but rizzume_created is false'}), 404
        rizzume = rizzume_collection.find_one({'user_id': user_id})
        if not rizzume:
            return jsonify({'error': 'rizzume not found'}), 404
        rizzume['_id'] = str(rizzume['_id'])
        return jsonify(rizzume), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 