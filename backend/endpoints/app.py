from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv
from datetime import datetime
from backend.endpoints import ribbon

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

@app.route('/api/ping-ribbon', methods=['GET'])
def ping():
    try:
        result = ribbon.ping_ribbon()
        return jsonify({"success": True, "message": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})
    
@app.route('/api/create-interview-flow', methods=['POST'])
def create_interview_flow():
    try:
        data = request.get_json()
        posting_id = data.get('posting_id')
        questions = data.get('questions', [])
        
        if not posting_id:
            return jsonify({"success": False, "error": "posting_id is required"}), 400
        
        result = ribbon.create_interview_flow(posting_id, questions)
        return jsonify({"success": True, "message": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

@app.route('/api/create-interview', methods=['POST'])
def create_interview():
    try:
        data = request.get_json()
        flow_id = data.get('flow_id')
        user_email = data.get('user_email')
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        
        if not flow_id or not user_email or not first_name or not last_name:
            return jsonify({"success": False, "error": "flow_id, user_email, first_name, and last_name are required"}), 400
        
        interview_id, interview_link = ribbon.create_interview(flow_id, user_email, first_name, last_name)
        return jsonify({
            "success": True, 
            "interview_id": interview_id, 
            "interview_link": interview_link
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

@app.route('/api/interview-results', methods=['GET'])
def get_results():
    try:
        results = ribbon.get_interview_results()
        return jsonify({"success": True, "results": results})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

if __name__ == '__main__':
    app.run(debug=True) 