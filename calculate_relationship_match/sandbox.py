from vellum.workflows.sandbox import WorkflowSandboxRunner

from .inputs import Inputs
from .workflow import Workflow

if __name__ != "__main__":
    raise Exception("This file is not meant to be imported")


runner = WorkflowSandboxRunner(
    workflow=Workflow(),
    inputs=[
        Inputs(
            transcript="Agent: Hi there! I'm from waterloo-dates calling about your AI-powered interview. How’s your day going?\n\nUser: Hey! It’s been going well, thanks.\n\nAgent: Glad to hear it! Let’s jump in. What’s your name?\n\nUser: I'm Maya.\n\nAgent: Awesome to meet you, Maya! So, tell me—what’s something you're really passionate about that you’d want a potential date to know?\n\nUser: Music. I’m pretty obsessed with it, honestly.\n\nAgent: Love that! Are you more into listening, or do you play an instrument too?\n\nUser: I actually play guitar and a bit of piano. I also write songs sometimes.\n\nAgent: That’s amazing! Do you write mostly for fun, or have you shared your music anywhere?\n\nUser: Mostly for fun, but I’ve posted a few songs on SoundCloud. Nothing serious, just a hobby for now.\n\nAgent: Very cool. What kind of music do you usually write or play?\n\nUser: Kind of a mix—mostly indie folk, some acoustic pop. I’m really into artists like Phoebe Bridgers and Ben Howard.\n\nAgent: Great taste. Do you ever perform live?\n\nUser: Just at open mics here and there. It’s nerve-wracking but kind of thrilling too.\n\nAgent: I bet! Okay, last question—if your ideal date involved music in some way, what would that look like?\n\nUser: Hmm, maybe going to a cozy live show together, or jamming at home with coffee and guitars. Something chill and creative.\n\nAgent: That sounds perfect. Thanks, Maya! This will definitely help match you with someone who vibes with your musical side.\n\nUser: Thanks! This was fun.",
            questions_to_transcript_mapping=[
                {
                    "end_timestamp": 14.617,
                    "script_question": "What's your name?",
                    "start_timestamp": 10.198947265625,
                    "transcript_items": [
                        {
                            "role": "agent",
                            "content": "Awesome to hear that! So, to get started, what's your name?",
                        },
                        {
                            "role": "user",
                            "content": "Maya.",
                        },
                    ],
                    "transcript_item_indices": [
                        2,
                        3,
                    ],
                },
            ],
            questions_and_desired_answers=[
                {
                    "question": "What's your name?",
                    "desired_answer": "",
                },
                {
                    "question": "Where were you born?",
                    "desired_answer": "",
                },
                {
                    "question": "What kind of hobbies do you have?",
                    "desired_answer": "I prefer someone outdoor-sy",
                },
            ],
            applicant_rizzume={
                "job": {
                    "workterm": 2,
                    "currentjob": "Shopify",
                },
                "profile": {
                    "age": 22,
                    "name": {
                        "last": "morales",
                        "first": "maya",
                        "middle": "jade",
                    },
                    "gender": "female",
                    "pfp_url": "https",
                    "sexuality": "bisexual",
                },
                "user_id": "9384756102",
                "fun_stuff": {
                    "blurb": "adventure junkie & ramen addict",
                    "goals": "start a food blog",
                    "hobbies": "rock climbing, journaling",
                    "fun_fact": "once backpacked across southeast asia",
                    "dealbreakers": "smokers and bad listeners",
                },
            },
            interviewer_rizzume={
                "job": {
                    "workterm": 3,
                    "currentjob": "Citadel",
                },
                "profile": {
                    "age": 20,
                    "name": {
                        "last": "zhu",
                        "first": "edric",
                        "middle": "nope",
                    },
                    "gender": "male",
                    "pfp_url": "https",
                    "sexuality": "straight",
                },
                "user_id": "1231235432",
                "fun_stuff": {
                    "blurb": "i love dogs",
                    "goals": "go to spain",
                    "hobbies": "play league",
                    "fun_fact": "have a dog called bobby",
                    "dealbreakers": "",
                },
            },
        ),
    ],
)

runner.run()
