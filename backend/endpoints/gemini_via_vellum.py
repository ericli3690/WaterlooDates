import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))
import calculate_relationship_match.workflow as workflow
from calculate_relationship_match.inputs import Inputs

def test(questions_to_transcript_mapping, questions_and_desired_answers):
    output = []
    answered_qs = {}
    for mapping in questions_to_transcript_mapping:
        answered_qs[mapping["script_question"]] = mapping["transcript_items"][1]["content"]
    for i, qa in enumerate(questions_and_desired_answers):
        this_one = {}
        this_one["question"] = qa["question"]
        this_one["desired_answer"] = qa["desired_answer"]
        this_one["answer"] = answered_qs.get(qa["question"], "")
        output.append(this_one)
    return output



def test_workflow(transcript, questions_to_transcript_mapping, questions_and_desired_answers, applicant_rizzume):
    print(workflow.Workflow().run(
    inputs=Inputs(
            transcript=transcript,
            questions_to_transcript_mapping=questions_to_transcript_mapping,
            questions_and_desired_answers=questions_and_desired_answers,
            applicant_rizzume=applicant_rizzume,
            # transcript="Agent: Hi there! I'm from waterloo-dates calling about your AI-powered interview. How s your day going?\n\nUser: Hey! It s been going well, thanks.\n\nAgent: Glad to hear it! Let s jump in. What s your name?\n\nUser: I'm Maya.\n\nAgent: Awesome to meet you, Maya! So, tell me what s something you're really passionate about that you d want a potential date to know?\n\nUser: Music. I m pretty obsessed with it, honestly.\n\nAgent: Love that! Are you more into listening, or do you play an instrument too?\n\nUser: I actually play guitar and a bit of piano. I also write songs sometimes.\n\nAgent: That s amazing! Do you write mostly for fun, or have you shared your music anywhere?\n\nUser: Mostly for fun, but I ve posted a few songs on SoundCloud. Nothing serious, just a hobby for now.\n\nAgent: Very cool. What kind of music do you usually write or play?\n\nUser: Kind of a mix mostly indie folk, some acoustic pop. I m really into artists like Phoebe Bridgers and Ben Howard.\n\nAgent: Great taste. Do you ever perform live?\n\nUser: Just at open mics here and there. It s nerve-wracking but kind of thrilling too.\n\nAgent: I bet! Okay, last question if your ideal date involved music in some way, what would that look like?\n\nUser: Hmm, maybe going to a cozy live show together, or jamming at home with coffee and guitars. Something chill and creative.\n\nAgent: That sounds perfect. Thanks, Maya! This will definitely help match you with someone who vibes with your musical side.\n\nUser: Thanks! This was fun.",
    #         questions_to_transcript_mapping=[
    # {
    #     "end_timestamp": 14.617,
    #     "script_question": "What's your name?",
    #     "start_timestamp": 10.198947265625,
    #     "transcript_item_indices": [
    #     2,
    #     3
    #     ],
    #     "transcript_items": [
    #     {
    #         "content": "Awesome to hear that! So, to get started, what's your name?",
    #         "role": "agent"
    #     },
    #     {
    #         "content": "Maya.",
    #         "role": "user"
    #     }
    #     ]
    # }
    # ],
    # questions_and_desired_answers=[
    # {
    #     "question": "What's your name?",
    #     "desired_answer": ""
    # },
    # {
    #     "question": "Where were you born?",
    #     "desired_answer": ""
    # },
    # {
    #     "question": "What kind of hobbies do you have?",
    #     "desired_answer": "I prefer someone outdoor-sy"
    # }
    # ],
    # applicant_rizzume={
    # "user_id": "9384756102",
    # "profile": {
    #     "pfp_url": "https",
    #     "name": {
    #     "first": "maya",
    #     "middle": "jade",
    #     "last": "morales"
    #     },
    #     "age": 22,
    #     "sexuality": "bisexual",
    #     "gender": "female"
    # },
    # "job": {
    #     "workterm": 2,
    #     "currentjob": "Shopify"
    # },
    # "fun_stuff": {
    #     "blurb": "adventure junkie & ramen addict",
    #     "hobbies": "rock climbing, journaling",
    #     "fun_fact": "once backpacked across southeast asia",
    #     "goals": "start a food blog",
    #     "dealbreakers": "smokers and bad listeners"
    # }
    # },
            interviewer_rizzume={
    "user_id": "1231235432",
    "profile": {
        "pfp_url": "https",
        "name": {
        "first": "edric",
        "middle": "nope",
        "last": "zhu"
        },
        "age": 20,
        "sexuality": "straight",
        "gender": "male"
    },
    "job": {
        "workterm": 3,
        "currentjob": "Citadel"
    },
    "fun_stuff": {
        "blurb": "i love dogs",
        "hobbies": "play league",
        "fun_fact": "have a dog called bobby",
        "goals": "go to spain",
        "dealbreakers": ""
    }
    }
        )
    ))
    
    
# Returns (final_output, opinion, confidence)
# 
# Parameters:
# - transcript: from Ribbon
# - questions_to_transcript_mapping: from Ribbon
# - questions_and_desired_answers: list of {question: "...", desired_answer: "..."}
# - applicant_rizzume: Rizzume
# - interviewer_rizzume: Rizzume
def get_wingman_opinion(
    transcript: str,
    questions_to_transcript_mapping: list[dict],
    questions_and_desired_answers: list[dict],
    applicant_rizzume: dict,
    interviewer_rizzume: dict
) -> tuple[str, str, float]:
    test_workflow(transcript, questions_to_transcript_mapping, questions_and_desired_answers, applicant_rizzume)
    print("TEST: ", test(questions_to_transcript_mapping, questions_and_desired_answers))
    # print("TRANSCRIPT: ", transcript)
    print("type of transcript: ", type(transcript))
    print("type of transcript[0]: ", type(transcript[0]))
    print("type of questions_to_transcript_mapping: ", type(questions_to_transcript_mapping))
    print("type of questions_to_transcript_mapping[0]: ", type(questions_to_transcript_mapping[0]))
    print("QUESTIONS TO TRANSCRIPT MAPPING: ", questions_to_transcript_mapping)
    print("test 1", questions_to_transcript_mapping[0]["script_question"])
    print("test 2", questions_to_transcript_mapping[0]["transcript_items"][1]["content"])
    print("QUESTIONS AND DESIRED ANSWERS: ", questions_and_desired_answers)
    print("type of questions_and_desired_answers: ", type(questions_and_desired_answers))
    print("type of questions_and_desired_answers[0]: ", type(questions_and_desired_answers[0]))
    print("APPLICANT RIZZUME: ", applicant_rizzume)
    print("type of applicant_rizzume: ", type(applicant_rizzume))
    # print("INTERVIEWER RIZZUME: ", interviewer_rizzume)
    print("type of interviewer_rizzume: ", type(interviewer_rizzume))
    output = workflow.Workflow().run(
        inputs=Inputs(
            transcript=transcript,
            questions_to_transcript_mapping=questions_to_transcript_mapping,
            questions_and_desired_answers=questions_and_desired_answers,
            applicant_rizzume=applicant_rizzume,
            interviewer_rizzume=interviewer_rizzume
        )
    ).outputs
    summary = output.final_output
    print("SUMMARY: ", summary)
    return summary, output.opinion, output.confidence


if __name__ == "__main__":
    test_workflow()