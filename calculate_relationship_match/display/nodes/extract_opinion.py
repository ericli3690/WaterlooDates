from uuid import UUID

from vellum_ee.workflows.display.editor import NodeDisplayData, NodeDisplayPosition
from vellum_ee.workflows.display.nodes import BaseTemplatingNodeDisplay
from vellum_ee.workflows.display.nodes.types import NodeOutputDisplay, PortDisplayOverrides

from ...nodes.extract_opinion import ExtractOpinion


class ExtractOpinionDisplay(BaseTemplatingNodeDisplay[ExtractOpinion]):
    label = "Extract - Opinion"
    node_id = UUID("207e5378-c81b-4e2f-b578-67d9b67e901e")
    target_handle_id = UUID("c695807a-68f6-4428-973e-f87ea8f8f4e0")
    node_input_ids_by_name = {
        "inputs.opinion_json": UUID("afeafe08-e7d8-406c-b466-ec577446866b"),
        "template": UUID("063c4277-30c9-4c14-ba9e-4ac1f248cffc"),
    }
    output_display = {
        ExtractOpinion.Outputs.result: NodeOutputDisplay(id=UUID("4261d32c-fc28-47d4-80d2-6172e4e7738e"), name="result")
    }
    port_displays = {
        ExtractOpinion.Ports.default: PortDisplayOverrides(id=UUID("63004c33-2e5b-4633-b506-972640bd7a80"))
    }
    display_data = NodeDisplayData(
        position=NodeDisplayPosition(x=3402.030131473405, y=456.5954166925434), width=554, height=432
    )
