from uuid import UUID

from vellum_ee.workflows.display.editor import NodeDisplayData, NodeDisplayPosition
from vellum_ee.workflows.display.nodes import BaseInlinePromptNodeDisplay
from vellum_ee.workflows.display.nodes.types import NodeOutputDisplay, PortDisplayOverrides

from ...nodes.red_flag_scan import RedFlagScan


class RedFlagScanDisplay(BaseInlinePromptNodeDisplay[RedFlagScan]):
    label = "Red flag scan"
    node_id = UUID("ebf82fab-4d73-480e-a858-fe079787a5d4")
    output_id = UUID("cca835f5-5aef-49a7-8b14-97b6b242868b")
    array_output_id = UUID("26c73133-d86e-42df-a96b-78a1bdf5f436")
    target_handle_id = UUID("07461b73-c554-410e-8cc9-3a182d7eeba4")
    node_input_ids_by_name = {
        "prompt_inputs.applicant_rizzume": UUID("7f08662c-02e0-45bc-a098-df59f6817e7e"),
        "prompt_inputs.interviewer_rizzume": UUID("ac1fa668-553d-4508-b361-a2e8f8800aef"),
        "prompt_inputs.transcript": UUID("8a1f86ab-2cf8-4e34-8498-d2f1d9849a80"),
    }
    attribute_ids_by_name = {"ml_model": UUID("41f81eb0-e284-4dd2-bdda-708d853cf122")}
    output_display = {
        RedFlagScan.Outputs.text: NodeOutputDisplay(id=UUID("cca835f5-5aef-49a7-8b14-97b6b242868b"), name="text"),
        RedFlagScan.Outputs.results: NodeOutputDisplay(id=UUID("26c73133-d86e-42df-a96b-78a1bdf5f436"), name="results"),
        RedFlagScan.Outputs.json: NodeOutputDisplay(id=UUID("20fc7d5a-0fd1-4608-b16a-ccc56225472b"), name="json"),
    }
    port_displays = {RedFlagScan.Ports.default: PortDisplayOverrides(id=UUID("7a968fb2-ba21-49c0-afc6-5ae62c950932"))}
    display_data = NodeDisplayData(
        position=NodeDisplayPosition(x=1797.0626999464891, y=1801.179956205145), width=554, height=529
    )
