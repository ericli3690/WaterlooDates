from flask import jsonify, request
from pymongo import MongoClient
from bson import ObjectId
import os
from datetime import datetime

# MongoDB connection
client = MongoClient(os.getenv('MONGODB_URI'))
db = client['WaterlooDates']
users_collection = db['users']
rizzume_collection = db['rizzume']

def health():
    try:
        # Test database connection
        client.admin.command('ping')
        db_status = 'connected'
    except Exception as e:
        db_status = f'disconnected: {str(e)}'
    
    return jsonify({
        'status': 'OK', 
        'timestamp': datetime.now().isoformat(),
        'database': db_status,
        'mongodb_uri': os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
    })

def create_or_get_user():
    try:
        print("got request")
        print(request)
        data = request.get_json()
        user_id = data.get('sub')
        data['user_id'] = user_id
        print(data)
        
        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400
        print("starting check for user")
        # First check if user already exists with this user_id
        existing_user = users_collection.find_one({'user_id': user_id})
        print("existing user", existing_user)
        
        if existing_user:
            # User exists, return the existing document
            existing_user['_id'] = str(existing_user['_id'])
            return jsonify(existing_user), 200
        print("got passed checks")
        # User doesn't exist, create new document
        data['rizzume_created'] = False
        data['ribbon_created'] = False
        
        result = users_collection.insert_one(data)
        data['_id'] = str(result.inserted_id)
        
        return jsonify(data), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500