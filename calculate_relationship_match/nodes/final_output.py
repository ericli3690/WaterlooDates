from vellum.workflows.nodes.displayable import FinalOutputNode
from vellum.workflows.state import BaseState

from .summarize import Summarize


class FinalOutput(FinalOutputNode[BaseState, str]):
    class Outputs(FinalOutputNode.Outputs):
        value = Summarize.Outputs.text
