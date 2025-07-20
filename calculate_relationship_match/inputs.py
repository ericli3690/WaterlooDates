from typing import Any

from vellum.workflows.inputs import BaseInputs


class Inputs(BaseInputs):
    transcript: str
    questions_to_transcript_mapping: Any
    questions_and_desired_answers: Any
    applicant_rizzume: Any
    interviewer_rizzume: Any
