import requests
from dotenv import load_dotenv
import os
from flask import jsonify, request
from pymongo import MongoClient
from endpoints.ribbon import check_and_update_processed_interview

client = MongoClient(os.getenv("MONGODB_URI"))
db = client["WaterlooDates"]

load_dotenv()

TOKEN = os.getenv("RIBBON_TOKEN")

user_collection = db['users']
wingman_collection = db['wingman']
applications_collection = db['applications']
rizzume_collection = db['rizzume']


# POST
def create_or_update_application():
    try:
        data = request.get_json()
        applicant_user_id = data["applicant_user_id"]
        interviewer_user_id = data["interviewer_user_id"]
        if not applicant_user_id or not interviewer_user_id:
            return jsonify({"success": False, "error": "applicant_user_id and interviewer_user_id are required"}), 400
        
        existing_application = applications_collection.find_one({"applicant_user_id": applicant_user_id, "interviewer_user_id": interviewer_user_id})
        if not existing_application:
            new_application = {
                "applicant_user_id": applicant_user_id,
                "interviewer_user_id": interviewer_user_id,
                "interview_id": "",
                "status": "incomplete",
                "audio_url": "",
                "question_to_transcript_mapping": {},
                "transcript": "",
                "gemini_response": {},
                "interviewer_decision": ""
            }
            applications_collection.insert_one(new_application)
            return jsonify({"success": True, "message": "application created"}), 200
        else:
            return jsonify({"success": True, "message": "application already exists"}), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


def get_applications_for_interviewer_and_update_status():
    try:
        data = request.get_json()
        user_id = data["user_id"]
        if not user_id:
            return jsonify({"success": False, "error": "interviewer_user_id is required"}), 400
        
        # Get all applications for the interviewer
        applications = list(applications_collection.find({"interviewer_user_id": user_id}))
        
        # Iterate through each application
        for application in applications:
            interview_id = application.get("interview_id")
            status = application.get("status")
            
            # Check if interview_id is not empty and not null, and status is incomplete
            if interview_id and interview_id != "" and status == "incomplete":
                # Call check and update processed interview
                updated_status = check_and_update_processed_interview(interview_id)
                
                # Update the application status in database
                applications_collection.update_one(
                    {"_id": application["_id"]},
                    {"$set": {"status": updated_status}}
                )
        
        # Query again for applications with status "complete"
        completed_applications = list(applications_collection.find({
            "interviewer_user_id": user_id,
            "status": "complete"
        }))
        
        # Convert ObjectId to string for JSON serialization
        for app in completed_applications:
            app["_id"] = str(app["_id"])
        
        return jsonify({"success": True, "applications": completed_applications}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

def get_applications_for_applicant_and_update_status():
    try:
        data = request.get_json()
        user_id = data["user_id"]
        if not user_id:
            return jsonify({"success": False, "error": "applicant_user_id is required"}), 400
        
        # Get all applications for the applicant
        applications = list(applications_collection.find({"applicant_user_id": user_id}))
        
        # Iterate through each application
        for application in applications:
            interview_id = application.get("interview_id")
            status = application.get("status")
            
            # Check if interview_id is not empty and not null, and status is incomplete
            if interview_id and interview_id != "" and status == "incomplete":
                # Call check and update processed interview
                updated_status = check_and_update_processed_interview(interview_id)
                
                # Update the application status in database
                applications_collection.update_one(
                    {"_id": application["_id"]},
                    {"$set": {"status": updated_status}}
                )
        
        # Query again for applications with status "complete"
        completed_applications = list(applications_collection.find({
            "applicant_user_id": user_id,
            "status": "complete"
        }))
        
        # Convert ObjectId to string for JSON serialization
        for app in completed_applications:
            app["_id"] = str(app["_id"])
        
        return jsonify({"success": True, "applications": completed_applications}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    