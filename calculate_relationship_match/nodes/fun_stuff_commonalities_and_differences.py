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


class FunStuffCommonalitiesAndDifferences(InlinePromptNode):
    ml_model = "gemini-1.5-flash"
    blocks = [
        ChatMessagePromptBlock(
            chat_role="SYSTEM",
            blocks=[
                RichTextPromptBlock(
                    blocks=[
                        PlainTextPromptBlock(
                            text="""\
waterloo-dates is a dating app that reimagines dating in the context of job applications. Here, an Applicant has viewed the Interviewer\'s profile. This profile information is stored in \"rizz-ume\" (resume) documents. Inspect the APPLICANT_RIZZUME and the INTERVIEWER_RIZZUME\'s \"fun stuff\" fields and assess if they may be compatible romantic partners. ONLY analyze the \"fun stuff\" fields. Only generate text in the following format. Do not generate any other thoughts or JSON, etc., just generate plaintext. Generate the following text based on the \"fun stuff\":

COMMONALITIES_AND_DIFFERENCES:
Commonalities:
- ...
- ...
- ...

Differences:
- ...
- ...
- ...\
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
 

COMMONALITIES_AND_DIFFERENCES:\
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
    }
    parameters = PromptParameters(
        stop=[],
        temperature=0.2,
        max_tokens=1000,
        top_p=1,
        top_k=0,
        frequency_penalty=None,
        presence_penalty=None,
        logit_bias={},
        custom_parameters=None,
    )
    settings = PromptSettings(stream_enabled=True)
