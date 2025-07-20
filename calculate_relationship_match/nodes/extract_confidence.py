from typing import Union

from vellum.workflows.nodes.displayable import TemplatingNode
from vellum.workflows.state import BaseState

from .opinion import Opinion


class ExtractConfidence(TemplatingNode[BaseState, Union[float, int]]):
    template = """{{ opinion_json[\"confidence\"] | float }}"""
    inputs = {
        "opinion_json": Opinion.Outputs.json,
    }
