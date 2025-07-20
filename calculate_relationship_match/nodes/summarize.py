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


class Summarize(InlinePromptNode):
    ml_model = "gemini-1.5-flash"
    blocks = [
        ChatMessagePromptBlock(
            chat_role="SYSTEM",
            blocks=[
                RichTextPromptBlock(
                    blocks=[
                        PlainTextPromptBlock(
                            text="""\
The following is a conversation between a voice AI interviewer and a prospective dating applicant on a dating app. The AI interviewer is vetting applicants to a user\'s dating profile by asking them questions. Summarize who the applicant is and what they say during this conversation in one to two sentences. Only return the summary plaintext: do not add any other comments, markdown formatting, JSON formatting, etc.

Example:

INPUT:
Agent: Hi, I�m from waterloo-dates calling about your AI-powered interview. How are you doing?\\nUser: Uh-huh. I\'m doing great.\\nAgent: Awesome to hear that! So, to get started, what\'s your name?\\nUser: Aaron.\\nAgent: Nice to meet you, Aaron! What�s something you�re really passionate about that you�d want a potential date to know?\\nUser: I\'m really good at knitting.\\nAgent: Knitting, huh? That�s pretty cool and unique!\\n

OUTPUT:
Aaron introduces himself. He\'s really good at knitting.\
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
INPUT:
\
"""
                        ),
                        VariablePromptBlock(input_variable="transcript"),
                        PlainTextPromptBlock(
                            text="""\


OUTPUT:\
"""
                        ),
                    ]
                )
            ],
        ),
    ]
    prompt_inputs = {
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
            "json_mode": False,
            "json_schema": None,
        },
    )
    settings = PromptSettings(stream_enabled=True)
