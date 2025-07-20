from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv
from datetime import datetime

# Import endpoint functions
from endpoints.user import health, create_or_get_user
from endpoints.rizzume import create_or_upload_rizzume, get_user_rizzume, get_all_rizzumes
from endpoints.ribbon import ping_ribbon, create_or_update_interview_flow, create_or_update_interview, get_all_interviews
from endpoints.application import create_application, update_application, get_applications_for_interviewer_and_update_status, get_applications_for_applicant_and_update_status, update_interviewer_decision

load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB connection
mongodb_uri = os.getenv('MONGODB_URI')
print(f"Connecting to MongoDB: {mongodb_uri}")
client = MongoClient(mongodb_uri)

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
app.route('/api/get_user_rizzume', methods=['POST'])(get_user_rizzume)
app.route('/api/get_all_rizzumes', methods=['GET'])(get_all_rizzumes)
app.route('/api/ping_ribbon', methods=['GET'])(ping_ribbon) 
app.route('/api/create_or_update_interview_flow', methods=['POST'])(create_or_update_interview_flow)
app.route('/api/create_or_update_interview', methods=['POST'])(create_or_update_interview)
app.route('/api/create_application', methods=['POST'])(create_application)
app.route('/api/update_application', methods=['POST'])(update_application)
app.route('/api/get_applications_for_interviewer_and_update_status', methods=['POST'])(get_applications_for_interviewer_and_update_status)
app.route('/api/get_applications_for_applicant_and_update_status', methods=['POST'])(get_applications_for_applicant_and_update_status)
app.route('/api/get_all_interviews', methods=['GET'])(get_all_interviews)
app.route('/api/update_interviewer_decision', methods=['POST'])(update_interviewer_decision)

@app.route('/')
def home():
    return jsonify({'message': 'WaterlooDates API is running!'})

if __name__ == '__main__':
    app.run(debug=True) 