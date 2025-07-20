from uuid import UUID

from vellum_ee.workflows.display.editor import NodeDisplayData, NodeDisplayPosition
from vellum_ee.workflows.display.nodes import BaseInlinePromptNodeDisplay
from vellum_ee.workflows.display.nodes.types import NodeOutputDisplay, PortDisplayOverrides

from ...nodes.summarize import Summarize


class SummarizeDisplay(BaseInlinePromptNodeDisplay[Summarize]):
    label = "Summarize"
    node_id = UUID("0fbb5b2a-6169-4970-9636-cec93c54272a")
    output_id = UUID("eaa8db36-027e-4e35-8b05-1de45b897972")
    array_output_id = UUID("f273db6f-7cad-4702-8c2d-68d1cf22d628")
    target_handle_id = UUID("98f32b63-f460-42c0-bfb5-b80294e807ed")
    node_input_ids_by_name = {"prompt_inputs.transcript": UUID("db983c2a-dce3-4431-9147-9838a758977c")}
    attribute_ids_by_name = {"ml_model": UUID("5f0d03a5-84e4-4138-b562-2e533bba0797")}
    output_display = {
        Summarize.Outputs.text: NodeOutputDisplay(id=UUID("eaa8db36-027e-4e35-8b05-1de45b897972"), name="text"),
        Summarize.Outputs.results: NodeOutputDisplay(id=UUID("f273db6f-7cad-4702-8c2d-68d1cf22d628"), name="results"),
        Summarize.Outputs.json: NodeOutputDisplay(id=UUID("d1f1b3d2-121b-4438-b36a-268f9626af4b"), name="json"),
    }
    port_displays = {Summarize.Ports.default: PortDisplayOverrides(id=UUID("fb59d396-8348-47d6-8adf-f8f43606a125"))}
    display_data = NodeDisplayData(position=NodeDisplayPosition(x=1799, y=29.5), width=554, height=452)
