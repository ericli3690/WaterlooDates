from uuid import UUID

from vellum_ee.workflows.display.editor import NodeDisplayData, NodeDisplayPosition
from vellum_ee.workflows.display.nodes import BaseCodeExecutionNodeDisplay
from vellum_ee.workflows.display.nodes.types import NodeOutputDisplay, PortDisplayOverrides

from ...nodes.get_questions_and_answers import GetQuestionsAndAnswers


class GetQuestionsAndAnswersDisplay(BaseCodeExecutionNodeDisplay[GetQuestionsAndAnswers]):
    label = "Get questions and answers"
    node_id = UUID("b7dee4c1-5fb5-4de4-8f74-ee5ee47087f8")
    target_handle_id = UUID("b843c545-9b76-4f64-8224-b8bc2491c17d")
    output_id = UUID("742abd29-ffc9-4b47-93e1-98160d85cff6")
    log_output_id = UUID("f9eb959d-003f-4214-8842-8c31322a8f48")
    node_input_ids_by_name = {
        "code_inputs.questions_to_transcript_mapping": UUID("e93a5964-f2fe-42b7-92f8-cc9bcb2fed80"),
        "code": UUID("e098365d-d3b0-4cd6-b9dc-f565fd9787a3"),
        "runtime": UUID("dd0508d1-a85e-4fee-b1db-abff9e17487e"),
        "code_inputs.questions_and_desired_answers": UUID("7d534d39-162c-4a97-b325-4ae37634f322"),
    }
    output_display = {
        GetQuestionsAndAnswers.Outputs.result: NodeOutputDisplay(
            id=UUID("742abd29-ffc9-4b47-93e1-98160d85cff6"), name="result"
        ),
        GetQuestionsAndAnswers.Outputs.log: NodeOutputDisplay(
            id=UUID("f9eb959d-003f-4214-8842-8c31322a8f48"), name="log"
        ),
    }
    port_displays = {
        GetQuestionsAndAnswers.Ports.default: PortDisplayOverrides(id=UUID("377ecfac-6af1-442b-8b81-dac7f5574a37"))
    }
    display_data = NodeDisplayData(position=NodeDisplayPosition(x=1800, y=537.7518849585681), width=554, height=547)
