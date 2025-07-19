import requests
from dotenv import load_dotenv
import os
from flask import jsonify, request

load_dotenv()

TOKEN = os.getenv("RIBBON_TOKEN")

# @app.route('/api/ping-ribbon', methods=['GET'])
# def ping_ribbon():
#     try:
#         result = ribbon.ping_ribbon()
#         return jsonify({"success": True, "message": result})
#     except Exception as e:
#         return jsonify({"success": False, "error": str(e)})

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

# @app.route('/api/create-interview-flow', methods=['POST'])
# def create_interview_flow():
#     try:
#         data = request.get_json()
#         posting_id = data.get('posting_id')
#         questions = data.get('questions', [])
        
#         if not posting_id:
#             return jsonify({"success": False, "error": "posting_id is required"}), 400
        
#         result = ribbon.create_interview_flow(posting_id, questions)
#         return jsonify({"success": True, "message": result})
#     except Exception as e:
#         return jsonify({"success": False, "error": str(e)})

# POST
def create_interview_flow():
    try:
        data = request.get_json()
        posting_user_id = data.get('posting_id')
        questions = data.get('questions', [])
        
        if not posting_user_id:
            return jsonify({"success": False, "error": "posting_id is required"}), 400

        url = "https://app.ribbon.ai/be-api/v1/interview-flows"

        payload = {
            "org_name": "waterloo-dates",
            "title": posting_user_id,
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

        response = requests.post(url, json=payload, headers=headers)
        return jsonify({"success": True, "message": response.json()["interview_flow_id"]})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})
    
# POST
def create_interview():
    try:
        data = request.get_json()
        flow_id = data.get('flow_id')
        user_email = data.get('user_email')
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        
        if not flow_id or not user_email or not first_name or not last_name:
            return jsonify({"success": False, "error": "flow_id, user_email, first_name, and last_name are required"}), 400
        
        url = "https://app.ribbon.ai/be-api/v1/interviews"

        payload = {
            "interview_flow_id": flow_id,
            "interviewee_email_address": user_email,
            "interviewee_first_name": first_name,
            "interviewee_last_name": last_name
        }
        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "authorization": f"Bearer {TOKEN}"
        }

        response = requests.post(url, json=payload, headers=headers)
        interview_id = response.json()["interview_id"]
        interview_link = response.json()["interview_link"]
        
        return jsonify({
            "success": True, 
            "interview_id": interview_id, 
            "interview_link": interview_link
        })
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