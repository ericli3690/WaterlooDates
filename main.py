import requests
import os
from dotenv import load_dotenv

load_dotenv()
TOKEN = os.getenv("TOKEN")


def ping():
    url = "https://app.ribbon.ai/be-api/v1/ping"

    headers = {
        "accept": "application/json",
        "authorization": f"Bearer {TOKEN}"
    }

    response = requests.get(url, headers=headers)
    return response.json()["message"]


def create_interview_flow(posting_id: str, questions: list[str]):
    url = "https://app.ribbon.ai/be-api/v1/interview-flows"

    payload = {
        "org_name": "waterloo-dates",
        "title": posting_id,
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
    return response.json()


def create_interview(flow_id: str, interviwee_address: str, interviewee_first_name: str, interviewee_last_name: str):
    url = "https://app.ribbon.ai/be-api/v1/interviews"

    payload = {
        "interview_flow_id": flow_id,
        "interviewee_email_address": interviwee_address,
        "interviewee_first_name": interviewee_first_name,
        "interviewee_last_name": interviewee_last_name
    }
    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "authorization": f"Bearer {TOKEN}"
    }

    response = requests.post(url, json=payload, headers=headers)
    return response.json()["interview_id"], response.json()["interview_link"]


def create_interview_link():
    # flow_id = create_interview_flow(
    #     "SECOND_POSTING_ID",
    #     [
    #         "What's your name?"
    #     ]
    # )
    # print(flow_id)
    interview_id, interview_link = create_interview(
        "bfba5e51",
        "interviewee@example.com",
        "Firstname",
        "Lastname"
    )
    return interview_id, interview_link


def get_interview_results():
    url = "https://app.ribbon.ai/be-api/v1/interviews"

    headers = {
        "accept": "application/json",
        "authorization": f"Bearer {TOKEN}"
    }

    response = requests.get(url, headers=headers)
    return response.json()["interviews"]


def main():
    print(create_interview_link())

if __name__ == "__main__":
    main()
