import requests
from dotenv import load_dotenv
import os
from flask import jsonify, request
from pymongo import MongoClient

client = MongoClient(os.getenv("MONGODB_URI"))
db = client["WaterlooDates"]

load_dotenv()

TOKEN = os.getenv("RIBBON_TOKEN")

user_collection = db['users']
wingman_collection = db['wingman']
applications_collection = db['applications']

# GET
def ping_ribbon():
    try:
        url = "https://app.ribbon.ai/be-api/v1/ping"

        headers = {
            "accept": "application/json",
            "authorization": f"Bearer {TOKEN}"
        }

        response = requests.get(url, headers=headers)
        return response.json()["message"]
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

# POST
def create_or_update_interview_flow():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        questions = data.get('questions', [])
        
        if not user_id:
            return jsonify({"success": False, "error": "user doesn't exist"}), 400
        existing_user = user_collection.find_one({"user_id": user_id})
        if not existing_user:
            return jsonify({"success": False, "error": "user doesn't exist"}), 400

        ribbon_url = "https://app.ribbon.ai/be-api/v1/interview-flows"

        payload = {
            "org_name": "waterloo-dates",
            "title": user_id,
            "questions": questions,
            "additional_info": "You are a dating interviewer. Your are helping someone who is using a dating app to interview propspective partners like a wingman.",
            "interview_type": "general",
            "is_video_enabled": False,
            "is_phone_call_enabled": True
        }
        headers = {
            "accept": "application/json",
            "authorization": f"Bearer {TOKEN}",
            "content-type": "application/json"
        }

        response = requests.post(ribbon_url, json=payload, headers=headers)
        interview_flow_id = response.json()["interview_flow_id"]
        
        store_data = {
            "user_id": user_id,
            "interview_flow_id": interview_flow_id,
            "questions": questions
        }
        
        # Check if wingman already exists
        existing_wingman = wingman_collection.find_one({"user_id": user_id})
        if existing_wingman:
            wingman_collection.update_one({"user_id": user_id}, {"$set": store_data})
            return jsonify({"success": True, "message": "wingman updated"}), 200
        else:
            wingman_collection.insert_one(store_data)
            user_collection.update_one({"user_id": user_id}, {"$set": {"wingman_created": True}})
            return jsonify({"success": True, "message": "wingman created"}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})
    
# POST
def create_or_update_interview():
    try:
        data = request.get_json()
        applicant_user_id = data.get('applicant_user_id')
        interviewer_user_id = data.get('interviewer_user_id')
        # flow_id = data.get('flow_id')
        # user_email = data.get('user_email')
        # first_name = data.get('first_name')
        # last_name = data.get('last_name')
        
        if not applicant_user_id or not interviewer_user_id:
            return jsonify({"success": False, "error": "applicant_user_id and interviewer_user_id are required"}), 400
        
        existing_applicant_user = user_collection.find_one({"user_id": applicant_user_id})
        if not existing_applicant_user:
            return jsonify({"success": False, "error": "applicant user doesn't exist"}), 400
        
        existing_interviewer_user = user_collection.find_one({"user_id": interviewer_user_id})
        if not existing_interviewer_user:
            return jsonify({"success": False, "error": "interviewer user doesn't exist"}), 400
        
        existing_wingman = wingman_collection.find_one({"user_id": interviewer_user_id})
        if not existing_wingman:
            return jsonify({"success": False, "error": "wingman doesn't exist"}), 400
        
        existing_applicant_rizzume = existing_applicant_user["rizzume"]
        if not existing_applicant_rizzume:
            return jsonify({"success": False, "error": "applicant doesn't have a rizzume account"}), 400
        
        # existing_interviewer_rizzume = existing_interviewer_user["rizzume"]
        # if not existing_interviewer_rizzume:
        #     return jsonify({"success": False, "error": "interviewer doesn't have a rizzume account"}), 400
        
        flow_id = existing_wingman["interview_flow_id"]
        applicant_first_name = existing_applicant_rizzume["name"]["first"]
        # applicant_middle_name = existing_applicant_rizzume["name"]["middle"]
        applicant_last_name = existing_applicant_rizzume["name"]["last"]
        applicant_email = existing_applicant_rizzume["email"]
        
        url = "https://app.ribbon.ai/be-api/v1/interviews"

        payload = {
            "interview_flow_id": flow_id,
            "interviewee_email_address": applicant_email,
            "interviewee_first_name": applicant_first_name,
            "interviewee_last_name": applicant_last_name
        }
        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "authorization": f"Bearer {TOKEN}"
        }

        response = requests.post(url, json=payload, headers=headers)
        interview_id = response.json()["interview_id"]
        # interview_link = response.json()["interview_link"]
        
        existing_application = applications_collection.find_one({"applicant_user_id": applicant_user_id, "interviewer_user_id": interviewer_user_id})

        if existing_application:
            existing_application["interview_id"] = interview_id
            applications_collection.update_one({"applicant_user_id": applicant_user_id, "interviewer_user_id": interviewer_user_id}, {"$set": existing_application})
        else:
            applications_collection.insert_one({"applicant_user_id": applicant_user_id, "interviewer_user_id": interviewer_user_id, "interview_id": interview_id})
        
        return jsonify({"success": True, "message": "interview created"}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})
    
# GET
def get_results():
    try:
        url = "https://app.ribbon.ai/be-api/v1/interviews"

        headers = {
            "accept": "application/json",
            "authorization": f"Bearer {TOKEN}"
        }

        response = requests.get(url, headers=headers)
        return jsonify({"success": True, "results": response.json()["interviews"]})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})