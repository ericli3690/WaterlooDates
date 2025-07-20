from flask import jsonify, request
from pymongo import MongoClient
from bson import ObjectId
import os
import cloudinary
import cloudinary.uploader

# MongoDB connection
client = MongoClient(os.getenv('MONGODB_URI'))
db = client['WaterlooDates']
users_collection = db['users']
rizzume_collection = db['rizzume']

# # Cloudinary configuration
# cloudinary.config(
#     cloud_name="de4d5bkfk",
#     api_key="262817219736277",
#     api_secret="R-4tCK-FdVu3FeWCCOqe1lBTUGY"
# )

# # Input: File, e.g. file = request.files['file']
# # Output: URL of uploaded file
# def upload_to_cloudinary(file, resource_type: str):
#     if file.filename == '':
#         print("\n\nATTEMPTING TO UPLOAD FILE, BUT NO FILE NAME\n\n")
#         return None
#     if resource_type not in ['image', 'video']:
#         print(f"\n\nATTEMPTING TO UPLOAD FILE, BUT INVALID RESOURCE TYPE: {resource_type}\n\n")
#         return None
#     try:
#         upload_result = cloudinary.uploader.upload(file, resource_type=resource_type)
#         return upload_result['secure_url']
#     except Exception as e:
#         return None

def create_or_upload_rizzume():
    try:
        print("got request")
        print(request)
        data = request.get_json()
        user_id = data.get('user_id')
        print(data)
        
        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400
        print("starting check for rizzume")
        existing_user = users_collection.find_one({'user_id': user_id})
        if not existing_user:
            return jsonify({'error': 'user not found'}), 404

        # First check if rizzume already exists with this user_id
        existing_rizzume = rizzume_collection.find_one({'user_id': user_id})
        print("existing rizzume", existing_rizzume)
        
        if existing_rizzume:        
            print("found existing rizzume!")    
            result = rizzume_collection.replace_one({'user_id': user_id}, data)
            data['_id'] = str(existing_rizzume['_id'])
            return jsonify(data), 200
        else:
            # Rizzume doesn't exist, create new document
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
    
def get_user_rizzume():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400
        existing_user = users_collection.find_one({'user_id': user_id})
        if not existing_user:
            return jsonify({'error': 'user not found'}), 404
        if existing_user['rizzume_created'] == False:
            return jsonify({'error': 'user found, but rizzume not created'}), 404
        rizzume = rizzume_collection.find_one({'user_id': user_id})
        if not rizzume:
            return jsonify({'error': 'rizzume not found'}), 404
        rizzume['_id'] = str(rizzume['_id'])
        return jsonify(rizzume), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# GET
def get_all_rizzumes():
    try:
        # data = request.get_json()
        # filters = data.get('filters')
        rizzumes = list(rizzume_collection.find())
        rizzumes_with_wingman_created = []
        # Convert ObjectId to string for JSON serialization
        for rizzume in rizzumes:
            rizzume['_id'] = str(rizzume['_id'])
            user_id = rizzume.get('user_id')
            if not user_id:
                continue
            has_wingman = users_collection.find_one({'user_id': user_id})['wingman_created']
            if not has_wingman:
                continue
            rizzumes_with_wingman_created.append(rizzume)
            
        return jsonify(rizzumes_with_wingman_created), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
        