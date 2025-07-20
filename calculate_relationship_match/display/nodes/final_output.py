from uuid import UUID

from vellum_ee.workflows.display.editor import NodeDisplayData, NodeDisplayPosition
from vellum_ee.workflows.display.nodes import BaseFinalOutputNodeDisplay
from vellum_ee.workflows.display.nodes.types import NodeOutputDisplay

from ...nodes.final_output import FinalOutput


class FinalOutputDisplay(BaseFinalOutputNodeDisplay[FinalOutput]):
    label = "Final Output"
    node_id = UUID("2613a398-38e3-4a86-8012-5cb2d1afb4a7")
    target_handle_id = UUID("70c90d1e-babe-49ec-a2d2-c7a88910b533")
    output_name = "final-output"
    output_display = {
        FinalOutput.Outputs.value: NodeOutputDisplay(id=UUID("7013b83e-10ef-4f70-adfc-0ce439080258"), name="value")
    }
    display_data = NodeDisplayData(position=NodeDisplayPosition(x=2483, y=0), width=522, height=438)
