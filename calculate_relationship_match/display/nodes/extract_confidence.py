from uuid import UUID

from vellum_ee.workflows.display.editor import NodeDisplayData, NodeDisplayPosition
from vellum_ee.workflows.display.nodes import BaseTemplatingNodeDisplay
from vellum_ee.workflows.display.nodes.types import NodeOutputDisplay, PortDisplayOverrides

from ...nodes.extract_confidence import ExtractConfidence


class ExtractConfidenceDisplay(BaseTemplatingNodeDisplay[ExtractConfidence]):
    label = "Extract - Confidence"
    node_id = UUID("5bfe9fbb-9cc2-4c9e-867f-9748f78a2d40")
    target_handle_id = UUID("80bb5f26-d17b-46cd-bb1f-fa8eeb9608a9")
    node_input_ids_by_name = {
        "inputs.opinion_json": UUID("4542fcb4-620a-4bb3-ba77-8822e7a5e7be"),
        "template": UUID("1cbd562c-fdb1-41e6-af24-fa7afa0ef5a2"),
    }
    output_display = {
        ExtractConfidence.Outputs.result: NodeOutputDisplay(
            id=UUID("849122f5-3117-48e4-9f4c-560563b2938f"), name="result"
        )
    }
    port_displays = {
        ExtractConfidence.Ports.default: PortDisplayOverrides(id=UUID("a15f9f7a-6511-4474-a2fb-66a8a1c7fd5d"))
    }
    display_data = NodeDisplayData(
        position=NodeDisplayPosition(x=3402.030131473405, y=924.595439580727), width=554, height=402
    )
