from vellum.workflows.nodes.displayable import FinalOutputNode
from vellum.workflows.state import BaseState

from .extract_opinion import ExtractOpinion


class Opinion1(FinalOutputNode[BaseState, str]):
    class Outputs(FinalOutputNode.Outputs):
        value = ExtractOpinion.Outputs.result
