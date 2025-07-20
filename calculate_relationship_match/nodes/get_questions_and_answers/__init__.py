from typing import Any

from vellum.workflows.nodes.displayable import CodeExecutionNode
from vellum.workflows.state import BaseState

from ...inputs import Inputs


class GetQuestionsAndAnswers(CodeExecutionNode[BaseState, Any]):
    filepath = "./script.py"
    code_inputs = {
        "questions_to_transcript_mapping": Inputs.questions_to_transcript_mapping,
        "questions_and_desired_answers": Inputs.questions_and_desired_answers,
    }
    runtime = "PYTHON_3_11_6"
    packages = []
