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


class RedFlagScan(InlinePromptNode):
    ml_model = "gemini-1.5-flash"
    blocks = [
        ChatMessagePromptBlock(
            chat_role="SYSTEM",
            blocks=[
                RichTextPromptBlock(
                    blocks=[
                        PlainTextPromptBlock(
                            text="""\
You are provided with dating-style resumes, called \"rizz-umes\". The rizzumes have a field called \"dealbreakers\". Assess whether these two people, the Applicant and the Interviewer, are romantically incompatible due to one having a dealbreaker of the other. Also analyze the TRANSCRIPT you are provided with to see a conversation the Applicant had with a voice AI interviewer to see if you can catch any other dealbreakers.

Output a value between 0 and 1 to one decimal point in JSON format. This is the RISK. A value of 1 indicates a 100% dealbreaker is present and this relationship will 100% not work. A value of 0 indicates no detectable dealbreakers: perhaps this relationship will be successful. Only look for dealbreakers, no need to worry about any other compatibility points. Do not be paranoid when looking for dealbreakers: many successful relationships are unexpected. As such, prefer outputting lower RISK values rather than higher RISK values where possible.

Also output a short REASON, explaining why you outputted the value you did. For instance:

{ risk: 0.8, reason: \"The Interviewer mentions doing drugs in the interview, but the Applicant mentions not wanting to be with someone who abuses substances in their dealbreakers.\" }\
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
 APPLICANT_RIZZUME:
\
"""
                        ),
                        VariablePromptBlock(input_variable="applicant_rizzume"),
                        PlainTextPromptBlock(
                            text="""\


INTERVIEWER_RIZZUME:
\
"""
                        ),
                        VariablePromptBlock(input_variable="interviewer_rizzume"),
                        PlainTextPromptBlock(
                            text="""\


TRANSCRIPT:
\
"""
                        ),
                        VariablePromptBlock(input_variable="transcript"),
                        PlainTextPromptBlock(
                            text="""\
 

RISK:\
"""
                        ),
                    ]
                )
            ],
        ),
    ]
    prompt_inputs = {
        "applicant_rizzume": Inputs.applicant_rizzume,
        "interviewer_rizzume": Inputs.interviewer_rizzume,
        "transcript": Inputs.transcript,
    }
    parameters = PromptParameters(
        stop=[],
        temperature=0,
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
                        "risk",
                        "reason",
                    ],
                    "properties": {
                        "risk": {
                            "type": "number",
                            "description": "The likelihood that there is a fundamental deal-breaking romantic incompatibility between these two profiles.",
                        },
                        "reason": {
                            "type": "string",
                            "description": "Why you outputted the risk value. A short sentence.",
                        },
                    },
                },
            },
        },
    )
    settings = PromptSettings(stream_enabled=True)
