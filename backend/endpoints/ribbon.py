import requests
from dotenv import load_dotenv
import os
from flask import jsonify, request
from pymongo import MongoClient
from endpoints.gemini_via_vellum import get_wingman_opinion

client = MongoClient(os.getenv("MONGODB_URI"))
db = client["WaterlooDates"]

load_dotenv()

TOKEN = os.getenv("RIBBON_TOKEN")

# Add token validation
if not TOKEN:
    print("❌ ERROR: RIBBON_TOKEN environment variable not set!")
    
user_collection = db['users']
wingman_collection = db['wingman']
applications_collection = db['applications']
rizzume_collection = db['rizzume']

# GET
def ping_ribbon():
    try:
        if not TOKEN:
            return jsonify({"success": False, "error": "RIBBON_TOKEN not configured"}), 500
            
        url = "https://app.ribbon.ai/be-api/v1/ping"

        headers = {
            "accept": "application/json",
            "authorization": f"Bearer {TOKEN}"
        }

        response = requests.get(url, headers=headers)
        
        # Add response status check
        if not response.ok:
            print(f"❌ Ribbon API Error: {response.status_code} - {response.text}")
            return jsonify({"success": False, "error": f"API Error: {response.status_code}"}), response.status_code
            
        return response.json()["message"]
    except Exception as e:
        print(f"❌ Ribbon ping error: {str(e)}")
        return jsonify({"success": False, "error": str(e)})

# POST
def create_or_update_interview_flow():
    try:
        if not TOKEN:
            return jsonify({"success": False, "error": "RIBBON_TOKEN not configured"}), 500
            
        data = request.get_json()
        user_id = data.get('user_id')
        questions_and_desired_answers = data.get('questions_and_desired_answers')
        
        if not user_id:
            return jsonify({"success": False, "error": "user doesn't exist"}), 400
        existing_user = user_collection.find_one({"user_id": user_id})
        if not existing_user:
            return jsonify({"success": False, "error": "user doesn't exist"}), 400

        ribbon_url = "https://app.ribbon.ai/be-api/v1/interview-flows"

        questions = []
        for item in questions_and_desired_answers:
            questions.append(item["question"])
        
        payload = {
            "org_name": "waterloo-dates",
            "title": user_id,
            "questions": questions,
            "additional_info": "You are a dating interviewer. Your are helping someone who is using a dating app to interview propspective romantic partners like a wingman.",
            "interview_type": "general",
            "is_video_enabled": False,
            "is_phone_call_enabled": True,
            "redirect_url": "http://localhost:3000/redirect"
        }
        headers = {
            "accept": "application/json",
            "authorization": f"Bearer {TOKEN}",
            "content-type": "application/json"
        }

        response = requests.post(ribbon_url, json=payload, headers=headers)
        print("-------------TLALALALALAL-------------------")
        print(response.json())
        print("-------------TLALALALALAL-------------------")
        
        # Add response status check
        if not response.ok:
            print(f"❌ Ribbon API Error: {response.status_code} - {response.text}")
            return jsonify({"success": False, "error": f"API Error: {response.status_code} - {response.text}"}), response.status_code
            
        response_data = response.json()
        if "interview_flow_id" not in response_data:
            print(f"❌ Missing interview_flow_id in response: {response_data}")
            return jsonify({"success": False, "error": "Invalid API response - missing interview_flow_id"}), 500
            
        interview_flow_id = response_data["interview_flow_id"]
        
        store_data = {
            "user_id": user_id,
            "interview_flow_id": interview_flow_id,
            "questions_and_desired_answers": questions_and_desired_answers
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
# Pass in application info
def create_or_update_interview():
    try:
        if not TOKEN:
            return jsonify({"success": False, "interview_link": "", "error": "RIBBON_TOKEN not configured"}), 500
            
        data = request.get_json()
        applicant_user_id = data.get('applicant_user_id')
        interviewer_user_id = data.get('interviewer_user_id')
        # flow_id = data.get('flow_id')
        # user_email = data.get('user_email')
        # first_name = data.get('first_name')
        # last_name = data.get('last_name')
        
        if not applicant_user_id or not interviewer_user_id:
            return jsonify({"success": False, "interview_link": "", "error": "applicant_user_id and interviewer_user_id are required"}), 400
        # print("CHECK 1")
        existing_applicant_user = user_collection.find_one({"user_id": applicant_user_id})
        existing_interviewer_user = user_collection.find_one({"user_id": interviewer_user_id})
        existing_wingman = wingman_collection.find_one({"user_id": interviewer_user_id})
        existing_applicant_rizzume = rizzume_collection.find_one({"user_id": applicant_user_id})
        existing_interviewer_rizzume = rizzume_collection.find_one({"user_id": interviewer_user_id})
        existing_application = applications_collection.find_one({"applicant_user_id": applicant_user_id, "interviewer_user_id": interviewer_user_id})
        # print("CHECK 2")
        if not existing_application or not existing_applicant_user or not existing_interviewer_user or not existing_wingman or not existing_applicant_rizzume or not existing_interviewer_rizzume:
            return jsonify({"success": False, "interview_link": "", "error": "create or update interview smth is cooked"}), 400
        # print("CHECK 3")
        flow_id = existing_wingman["interview_flow_id"]
        applicant_first_name = existing_applicant_rizzume["profile"]["name"]["first"]
        applicant_last_name = existing_applicant_rizzume["profile"]["name"]["last"]
        applicant_email = existing_applicant_user["email"]  # Fixed: was using interviewer's email
        # print("CHECK 4")
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
        # print("CHECK 5")
        # {
        # "hint": null,
        # "interview_id": "9e555688-a2e4-49bf-a55e-4f24614f7e15",
        # "interview_link": "https://app.ribbon.ai/interview/api/bfba5e51/9e555688-a2e4-49bf-a55e-4f24614f7e15"
        # }
        response = requests.post(url, json=payload, headers=headers)
        
        # Add response status check
        if not response.ok:
            print(f"❌ Ribbon API Error: {response.status_code} - {response.text}")
            return jsonify({"success": False, "interview_link": "", "error": f"API Error: {response.status_code} - {response.text}"}), response.status_code
        
        response_data = response.json()
        if "interview_id" not in response_data or "interview_link" not in response_data:
            print(f"❌ Missing required fields in response: {response_data}")
            return jsonify({"success": False, "interview_link": "", "error": "Invalid API response - missing required fields"}), 500
        
        # print("CHECK 6")
        interview_id = response_data["interview_id"]
        interview_link = response_data["interview_link"]
        # print("CHECK 7")
        existing_application["interview_id"] = interview_id
        existing_application["interview_link"] = interview_link
        existing_application["status"] = 1
        existing_application["audio_url"] = ""
        existing_application["transcript"] = ""
        existing_application["question_to_transcript_mapping"] = {}
        existing_application["gemini_response"] = {}
        existing_application["interviewer_decision"] = 0
        applications_collection.update_one({"applicant_user_id": applicant_user_id, "interviewer_user_id": interviewer_user_id}, {"$set": existing_application})
        return jsonify({"success": True, "interview_link": interview_link}), 200
    except Exception as e:
        return jsonify({"success": False, "interview_link": "", "error": str(e)})

# DON'T INCLUDE THIS AS ROUTE, THIS IS HELPER FUNCTION
def check_and_update_processed_interview(interview_id):
    try:
        # data = request.get_json()
        
        # interview_id = data["interview_id"]
        print("start polling")
        if not interview_id:
            return jsonify({"success": False, "error": "interview_id is required"}), 400
        
        existing_application = applications_collection.find_one({"interview_id": interview_id})
        if not existing_application:
            return jsonify({"success": False, "error": "interview doesn't exist"}), 400
        
        applicant_user_id = existing_application["applicant_user_id"]
        interviewer_user_id = existing_application["interviewer_user_id"]
        
        wingman = wingman_collection.find_one({"user_id": interviewer_user_id})
        if not wingman:
            return jsonify({"success": False, "error": "wingman doesn't exist"}), 400
        
        questions_and_desired_answers = wingman["questions_and_desired_answers"]
        if not questions_and_desired_answers:
            return jsonify({"success": False, "error": "questions_and_desired_answers doesn't exist"}), 400
        
        status = existing_application["status"]
        if not status:
            return jsonify({"success": False, "error": "status is required"}), 400
        
        if(status == 2):
            return jsonify({"success": True, "message": "interview already processed"}), 200
        
        url = "https://app.ribbon.ai/be-api/v1/interviews/" + interview_id
        
        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "authorization": f"Bearer {TOKEN}"
        }
        
        print("url: ", url)
        response = requests.get(url, headers=headers)
        
        # Add response status check
        if not response.ok:
            print(f"❌ Ribbon API Error: {response.status_code} - {response.text}")
            return jsonify({"success": False, "error": f"API Error: {response.status_code} - {response.text}"}), response.status_code
        
        print("response: ", response.json())
        response_data = response.json()
        
        if "status" not in response_data:
            print(f"❌ Missing status in response: {response_data}")
            return jsonify({"success": False, "error": "Invalid API response - missing status"}), 500
            
        ribbon_status = response_data["status"]
        print("ribbon_status: ", ribbon_status)
        if not ribbon_status:
            return jsonify({"success": False, "error": "ribbon status is required"}), 400
        print("HELOLOLOLOLOLOL")
        if ribbon_status == "incomplete":
            return jsonify({"success": True, "message": "interview is incomplete"}), 200
        elif ribbon_status == "completed":
            print("START COMPLETE")
            interview_data = response_data["interview_data"]
            audio_url = interview_data["audio_url"]
            transcript = interview_data["transcript"]
            question_to_transcript_mapping = interview_data["questions_to_transcript_mapping"]
            applicant_rizzume = rizzume_collection.find_one({"user_id": applicant_user_id})
            interviewer_rizzume = rizzume_collection.find_one({"user_id": interviewer_user_id})
            print("INTERVIEW PROCESS COMPLEDED WAHOO")
            if not applicant_rizzume or not interviewer_rizzume or not audio_url or not transcript or not question_to_transcript_mapping:
                return jsonify({"success": False, "error": "audio_url, transcript, and question_to_transcript_mapping are required"}), 400
            print("GREEN FN")
            
            applicant_rizzume["_id"] = str(applicant_rizzume["_id"])
            interviewer_rizzume["_id"] = str(interviewer_rizzume["_id"])
            
            # applicant_rizzume_modified = applicant_rizzume.remove("_id")
            # interviewer_rizzume_modified = interviewer_rizzume.remove("_id")
            existing_application["audio_url"] = audio_url
            existing_application["transcript"] = transcript
            existing_application["question_to_transcript_mapping"] = question_to_transcript_mapping
            existing_application["status"] = 2
            print("ANDREW JIANG")
            # PASS TRANSCRIPT AND QUESTION TO TRANSCRIPT MAPPING TO GEMINI
            summary, opinion, confidence = get_wingman_opinion(transcript, question_to_transcript_mapping, questions_and_desired_answers, applicant_rizzume, interviewer_rizzume)
            # gemini_response = {}
            print("GEMINI RESPONSE: ", summary, opinion, confidence)
            existing_application["gemini_response"] = {
                "summary": summary,
                "opinion": opinion,
                "confidence": confidence
            }
            print("UPDATE APPLICATION GEMINI")
            applications_collection.update_one({"interview_id": interview_id}, {"$set": existing_application})
            print("EXTRA GREEN FN")
            return jsonify({"success": True, "message": "interview has been processed"}), 200
        else:
            return jsonify({"success": False, "message": "status is fucked"}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})
    
def get_all_interviews():
    try:
        if not TOKEN:
            return jsonify({"success": False, "error": "RIBBON_TOKEN not configured"}), 500
            
        url = "https://app.ribbon.ai/be-api/v1/interviews"
        
        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "authorization": f"Bearer {TOKEN}"
        }
        
        response = requests.get(url, headers=headers)
        
        # Add response status check
        if not response.ok:
            print(f"❌ Ribbon API Error: {response.status_code} - {response.text}")
            return jsonify({"success": False, "error": f"API Error: {response.status_code}"}), response.status_code
            
        return response.json()
    except Exception as e:
        print(f"❌ Get all interviews error: {str(e)}")
        return jsonify({"success": False, "error": str(e)})
