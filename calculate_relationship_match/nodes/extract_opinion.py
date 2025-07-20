from vellum.workflows.nodes.displayable import TemplatingNode
from vellum.workflows.state import BaseState

from .opinion import Opinion


class ExtractOpinion(TemplatingNode[BaseState, str]):
    template = """{{ opinion_json[\"opinion\"] }}"""
    inputs = {
        "opinion_json": Opinion.Outputs.json,
    }
