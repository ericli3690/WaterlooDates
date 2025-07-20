from uuid import UUID

from vellum_ee.workflows.display.editor import NodeDisplayData, NodeDisplayPosition
from vellum_ee.workflows.display.nodes import BaseFinalOutputNodeDisplay
from vellum_ee.workflows.display.nodes.types import NodeOutputDisplay

from ...nodes.opinion_1 import Opinion1


class Opinion1Display(BaseFinalOutputNodeDisplay[Opinion1]):
    label = "opinion"
    node_id = UUID("c0b31fd7-6be6-468c-965f-16a7608efc2f")
    target_handle_id = UUID("4e75c30e-89e9-4721-9bae-5874aa311a48")
    output_name = "opinion"
    output_display = {
        Opinion1.Outputs.value: NodeOutputDisplay(id=UUID("84ee453d-4ba7-429c-baf7-f70905239dec"), name="value")
    }
    display_data = NodeDisplayData(
        position=NodeDisplayPosition(x=4108.007724879105, y=452.36018277333153), width=522, height=438
    )
