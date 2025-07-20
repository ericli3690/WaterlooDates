from vellum import (
    ChatMessagePromptBlock,
    PlainTextPromptBlock,
    PromptParameters,
    PromptSettings,
    RichTextPromptBlock,
    VariablePromptBlock,
)
from vellum.workflows.nodes.displayable import InlinePromptNode

from ..inputs import Inputs
from .fun_stuff_commonalities_and_differences import FunStuffCommonalitiesAndDifferences
from .get_questions_and_answers import GetQuestionsAndAnswers
from .red_flag_scan import RedFlagScan


class Opinion(InlinePromptNode):
    ml_model = "gemini-2.5-flash"
    blocks = [
        ChatMessagePromptBlock(
            chat_role="SYSTEM",
            blocks=[
                RichTextPromptBlock(
                    blocks=[
                        PlainTextPromptBlock(
                            text="""\
waterloo-dates is a dating app that reframes dating through the lens of job applications. You are a helpful wingman, a friend to the Interviewer. Refer to the Interviewer as \"you\". You are speaking directly to the Interviewer and offering them advice. A voice AI has conducted an interview with the Applicant, a prospective romantic match for the Interviewer, and the TRANSCRIPT is provided to you. The Interviewer directed the voice AI to ask specific questions, and in some cases expressed a wish that romantic matches demonstrate a certain kind of answer / did not demonstrate a certain kind of answer. This information is provided to you as the QUESTIONS_AND_ANSWERS. The voice AI has also collected commonalities between the Applicant and Interviewer: the similarities and differences in their hobbies, goals, etc. This is provided to you as FUN_STUFF_COMMONALITIES.

Your goal is to output a 1-2 sentence plaintext blurb that offers your OPINION to the Interviewer about whether they should consider a romantic match with the Applicant. Do NOT output markdown in the OPINION field. Be optimistic and supportive. Focus on the positives about how the relationship could go rather than emphasizing negatives. Love is hard to understand!

Additionally, you will output a CONFIDENCE value, which is an integer between 0 to 100. 0 indicates that there is 0% chance of this relationship working well, i.e. the Applicant and Interviewer are a poor fit for each other. 100 indicates that the Applicant and Interviewer are soulmates in the making, with their relationship 100% working out positively.

The two above fields should be outputted in JSON format, for instance:

{ opinion: \"Andy seems shy in his interview but seems like a good match! They enjoy playing soccer, just like you, and you might be able to bond over the sport.\", confidence: 83 }

Don\'t weigh the FUN_STUFF_COMMONALITIES too highly: many people become romantic partners without sharing every single hobby in common.

Important caveat: you are also provided with a RISK_JSON input, which contains a number, RISK, from 0 to 1, where 1 indicates that there is a 100% chance of there being a dealbreaker between the two profiles, and 0 indicating that there are no discernable dealbreakers. If the risk value is high -- above 0.7 or 0.8 -- note that there may be a dealbreaker in your OPINION, particularly by using the REASON field of the RISK_JSON input, and lower your CONFIDENCE value accordingly.

IMPORTANT: If the risk value is above 0.9, focus mostly on it in your OPINION and CONFIDENCE, potentially lowering your CONFIDENCE to VERY low levels. This command overrides the other commands above. Red flags and dealbreakers are important relationship boundaries. You should mention the deal-breaker REASON in your CONFIDENCE and OPINION outputs. Lower your confidence a LOT, down below 50, if the RISK value is above 0.9.

Do NOT format the OPINION using markdown.\
"""
                        )
                    ]
                )
            ],
        ),
        ChatMessagePromptBlock(
            chat_role="USER",
            blocks=[
                RichTextPromptBlock(
                    blocks=[
                        PlainTextPromptBlock(
                            text="""\
 TRANSCRIPT:
\
"""
                        ),
                        VariablePromptBlock(input_variable="transcript"),
                        PlainTextPromptBlock(
                            text="""\


QUESTIONS_AND_ANSWERS:
\
"""
                        ),
                        VariablePromptBlock(input_variable="questions_and_answers"),
                        PlainTextPromptBlock(
                            text="""\


FUN_STUFF_COMMONALITIES:
\
"""
                        ),
                        VariablePromptBlock(input_variable="fun_stuff_commonalities"),
                        PlainTextPromptBlock(
                            text="""\


RISK_JSON:
\
"""
                        ),
                        VariablePromptBlock(input_variable="risk_json"),
                        PlainTextPromptBlock(
                            text="""\


OUTPUT_JSON:\
"""
                        ),
                    ]
                )
            ],
        ),
    ]
    prompt_inputs = {
        "questions_and_answers": GetQuestionsAndAnswers.Outputs.result,
        "risk_json": RedFlagScan.Outputs.json,
        "fun_stuff_commonalities": FunStuffCommonalitiesAndDifferences.Outputs.text,
        "transcript": Inputs.transcript,
    }
    parameters = PromptParameters(
        stop=[],
        temperature=0.25,
        max_tokens=1000,
        top_p=1,
        top_k=0,
        frequency_penalty=None,
        presence_penalty=None,
        logit_bias={},
        custom_parameters={
            "json_mode": True,
            "json_schema": {
                "schema": {
                    "type": "object",
                    "required": [
                        "opinion",
                        "confidence",
                    ],
                    "properties": {
                        "opinion": {
                            "type": "string",
                            "description": "Your opinion of whether the Interviewer and Applicant are a romantic match. Be a helpful wingman!",
                        },
                        "confidence": {
                            "type": "integer",
                            "description": "The probability of this relationship working well, out of 100. An integer from 0 to 100.",
                        },
                    },
                },
            },
        },
    )
    settings = PromptSettings(stream_enabled=True)
