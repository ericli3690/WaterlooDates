from uuid import UUID

from vellum_ee.workflows.display.editor import NodeDisplayData, NodeDisplayPosition
from vellum_ee.workflows.display.nodes import BaseFinalOutputNodeDisplay
from vellum_ee.workflows.display.nodes.types import NodeOutputDisplay

from ...nodes.confidence import Confidence


class ConfidenceDisplay(BaseFinalOutputNodeDisplay[Confidence]):
    label = "confidence"
    node_id = UUID("09c1a946-1068-4e47-9690-02b73daadbb3")
    target_handle_id = UUID("ed33672e-4852-4da9-8e37-7133061f3659")
    output_name = "confidence"
    output_display = {
        Confidence.Outputs.value: NodeOutputDisplay(id=UUID("fd34db3a-6e89-4129-ab10-3ab48ca1dde7"), name="value")
    }
    display_data = NodeDisplayData(
        position=NodeDisplayPosition(x=4089.7947301537356, y=917.0307763334176), width=522, height=407
    )
