from uuid import UUID

from vellum_ee.workflows.display.editor import NodeDisplayData, NodeDisplayPosition
from vellum_ee.workflows.display.nodes import BaseInlinePromptNodeDisplay
from vellum_ee.workflows.display.nodes.types import NodeOutputDisplay, PortDisplayOverrides

from ...nodes.fun_stuff_commonalities_and_differences import FunStuffCommonalitiesAndDifferences


class FunStuffCommonalitiesAndDifferencesDisplay(BaseInlinePromptNodeDisplay[FunStuffCommonalitiesAndDifferences]):
    label = "Fun stuff commonalities and differences"
    node_id = UUID("451cb46c-d2ce-4286-8530-5a0fb01a21f9")
    output_id = UUID("a0d69475-e25e-4783-a43f-74203b1cf932")
    array_output_id = UUID("c99b6443-114e-418b-b2fd-00525d277be9")
    target_handle_id = UUID("df54dc1f-c272-48e6-b68b-81363870ee3b")
    node_input_ids_by_name = {
        "prompt_inputs.applicant_rizzume": UUID("e9400672-3629-46bb-8e9c-ca03d497c094"),
        "prompt_inputs.interviewer_rizzume": UUID("f9180a06-a47e-4d15-8a8c-30b80f98f37c"),
    }
    attribute_ids_by_name = {"ml_model": UUID("6766d89d-3951-4b91-9267-7a2d164dfc53")}
    output_display = {
        FunStuffCommonalitiesAndDifferences.Outputs.text: NodeOutputDisplay(
            id=UUID("a0d69475-e25e-4783-a43f-74203b1cf932"), name="text"
        ),
        FunStuffCommonalitiesAndDifferences.Outputs.results: NodeOutputDisplay(
            id=UUID("c99b6443-114e-418b-b2fd-00525d277be9"), name="results"
        ),
        FunStuffCommonalitiesAndDifferences.Outputs.json: NodeOutputDisplay(
            id=UUID("e556066b-e82e-42fb-9d97-3568c0057355"), name="json"
        ),
    }
    port_displays = {
        FunStuffCommonalitiesAndDifferences.Ports.default: PortDisplayOverrides(
            id=UUID("fbb9ab3e-546a-4324-97be-68d46c9fcf60")
        )
    }
    display_data = NodeDisplayData(
        position=NodeDisplayPosition(x=1792.0073938514129, y=1104.8379575577305), width=554, height=667
    )
