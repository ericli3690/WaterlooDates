from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv
from datetime import datetime
import cloudinary
import cloudinary.uploader

load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient(os.getenv('MONGODB_URI'))
db = client['WaterlooDates']
users_collection = db['users']
rizzume_collection = db['rizzume']

# cloudinary.config(
#     cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
#     api_key=os.getenv('CLOUDINARY_API_KEY'),
#     api_secret=os.getenv('CLOUDINARY_API_SECRET')
# )

# Input: File, e.g. file = request.files['file']
# Output: URL of uploaded file
def upload_to_cloudinary(file, resource_type: str):
    if file.filename == '':
        print("\n\nATTEMPTING TO UPLOAD FILE, BUT NO FILE NAME\n\n")
        return None
    if resource_type not in ['image', 'video']:
        print(f"\n\nATTEMPTING TO UPLOAD FILE, BUT INVALID RESOURCE TYPE: {resource_type}\n\n")
        return None
    try:
        upload_result = cloudinary.uploader.upload(file, resource_type=resource_type)
        return upload_result['secure_url']
    except Exception as e:
        return None

@app.route('/')
def home():
    return jsonify({'message': 'WaterlooDates API is running!'})

@app.route('/api/health')
def health():
    return jsonify({'status': 'OK', 'timestamp': datetime.now().isoformat()})

# {
#     "user_id": "123",
#     "name": "John Doe",
#     "email": "john.doe@example.com",
#     "email_verified": true,
#     "nickname": "john_doe",
#     "picture": "https://example.com/picture.jpg"
#     "rizzume_created": false,
#     "ribbon_created": false
# }
@app.route('/api/create_or_get_user', methods=['POST'])
def create_or_get_user():
    try:
        print("got request")
        print(request)
        data = request.get_json()
        user_id = data.get('user_id')
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

# {
#   "user_id": "",
#   "profile": {
#     "pfp_url": "",
#     "name": {
#       "first": "",
#       "middle": "",
#       "last": ""
#     },
#     "age": null,
#     "sexuality": "",
#     "gender": ""
#   },
#   "job": {
#     "workterm": null,
#     "currentjob": ""
#   },
#   "fun_stuff": {
#     "blurb": "",
#     "hobbies": "",
#     "fun_fact": ""
#   }
# } 
@app.route('/api/create_or_upload_rizzume', methods=['POST'])
def create_or_upload_rizzume():
    try:
        print("got request")
        print(request)
        data = request.get_json()
        user_id = data.get('user_id')
        print(data)
        
        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400
        print("starting check for user")
        # First check if user already exists with this user_id
        existing_user = users_collection.find_one({'user_id': user_id})
        print("existing user", existing_user)
        
        if not existing_user:
            return jsonify({'error': 'user not found'}), 404
        
        existing_rizzume = rizzume_collection.find_one({'user_id': user_id})
        if existing_rizzume:        
            print("found existing rizzume!")    
            result = rizzume_collection.replace_one({'user_id': user_id}, data)
            data['_id'] = str(existing_rizzume['_id'])
            return jsonify(data), 200
        else:
            # User doesn't exist, create new document
            result = rizzume_collection.insert_one(data)
            
            # Set rizzume_created to true in users_collection
            users_collection.update_one(
                {'user_id': user_id},
                {'$set': {'rizzume_created': True}}
            )
            
            data['_id'] = str(result.inserted_id)
            return jsonify(data), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 