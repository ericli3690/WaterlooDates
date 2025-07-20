from uuid import UUID

from vellum_ee.workflows.display.editor import NodeDisplayData, NodeDisplayPosition
from vellum_ee.workflows.display.nodes import BaseInlinePromptNodeDisplay
from vellum_ee.workflows.display.nodes.types import NodeOutputDisplay, PortDisplayOverrides

from ...nodes.opinion import Opinion


class OpinionDisplay(BaseInlinePromptNodeDisplay[Opinion]):
    label = "Opinion"
    node_id = UUID("25d5a0c4-0db3-40d7-bb8a-057e746262e7")
    output_id = UUID("50268794-6574-44f8-a27b-7024409dbfb6")
    array_output_id = UUID("95516445-2484-44c9-898f-40847b90182a")
    target_handle_id = UUID("abbe354f-3a5e-40a5-b69c-b402f4e6e9ab")
    node_input_ids_by_name = {
        "prompt_inputs.questions_and_answers": UUID("5528fad7-7b86-4c7c-9c6f-f7dc32d256a8"),
        "prompt_inputs.risk_json": UUID("4ef0cfdb-f3f8-4cec-ac08-4cd8b6d0eb43"),
        "prompt_inputs.fun_stuff_commonalities": UUID("0744cab8-8510-4c9c-acf1-302d40781673"),
        "prompt_inputs.transcript": UUID("7b471758-4ea4-4af6-bfbd-2eb62e31d2d1"),
    }
    attribute_ids_by_name = {"ml_model": UUID("b4382abe-1dcd-4d4e-83f4-fa21970bafc5")}
    output_display = {
        Opinion.Outputs.text: NodeOutputDisplay(id=UUID("50268794-6574-44f8-a27b-7024409dbfb6"), name="text"),
        Opinion.Outputs.results: NodeOutputDisplay(id=UUID("95516445-2484-44c9-898f-40847b90182a"), name="results"),
        Opinion.Outputs.json: NodeOutputDisplay(id=UUID("6b4e8628-df36-44e0-95b4-d72fdd354dc6"), name="json"),
    }
    port_displays = {Opinion.Ports.default: PortDisplayOverrides(id=UUID("8354e641-4d39-46b2-b270-bad23020e16f"))}
    display_data = NodeDisplayData(
        position=NodeDisplayPosition(x=2616.812516226242, y=594.4918416638739), width=554, height=633
    )
