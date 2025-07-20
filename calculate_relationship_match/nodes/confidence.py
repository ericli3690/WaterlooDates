from typing import Union

from vellum.workflows.nodes.displayable import FinalOutputNode
from vellum.workflows.state import BaseState

from .extract_confidence import ExtractConfidence


class Confidence(FinalOutputNode[BaseState, Union[float, int]]):
    class Outputs(FinalOutputNode.Outputs):
        value = ExtractConfidence.Outputs.result
