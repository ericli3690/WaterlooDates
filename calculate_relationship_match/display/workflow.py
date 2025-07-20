from uuid import UUID

from vellum_ee.workflows.display.base import (
    EdgeDisplay,
    EntrypointDisplay,
    WorkflowDisplayData,
    WorkflowDisplayDataViewport,
    WorkflowInputsDisplay,
    WorkflowMetaDisplay,
    WorkflowOutputDisplay,
)
from vellum_ee.workflows.display.editor import NodeDisplayData, NodeDisplayPosition
from vellum_ee.workflows.display.workflows import BaseWorkflowDisplay

from ..inputs import Inputs
from ..nodes.confidence import Confidence
from ..nodes.extract_confidence import ExtractConfidence
from ..nodes.extract_opinion import ExtractOpinion
from ..nodes.final_output import FinalOutput
from ..nodes.fun_stuff_commonalities_and_differences import FunStuffCommonalitiesAndDifferences
from ..nodes.get_questions_and_answers import GetQuestionsAndAnswers
from ..nodes.opinion import Opinion
from ..nodes.opinion_1 import Opinion1
from ..nodes.red_flag_scan import RedFlagScan
from ..nodes.summarize import Summarize
from ..workflow import Workflow


class WorkflowDisplay(BaseWorkflowDisplay[Workflow]):
    workflow_display = WorkflowMetaDisplay(
        entrypoint_node_id=UUID("1e22c9af-66ce-4c5f-bb99-0fe2317edf3a"),
        entrypoint_node_source_handle_id=UUID("0f4e5171-2c25-4dfb-a316-a61d5054a604"),
        entrypoint_node_display=NodeDisplayData(position=NodeDisplayPosition(x=1545, y=106), width=124, height=48),
        display_data=WorkflowDisplayData(
            viewport=WorkflowDisplayDataViewport(x=-1110.9539877728994, y=61.4979340439379, zoom=0.8131832298028279)
        ),
    )
    inputs_display = {
        Inputs.transcript: WorkflowInputsDisplay(
            id=UUID("34ca0f6c-c3fc-423d-9c0a-6a657ba9f28d"), name="transcript", color="corn"
        ),
        Inputs.questions_to_transcript_mapping: WorkflowInputsDisplay(
            id=UUID("2cfe7678-e8cf-4839-b435-0254a428c61d"), name="questions_to_transcript_mapping", color="gold"
        ),
        Inputs.questions_and_desired_answers: WorkflowInputsDisplay(
            id=UUID("7fcf97c3-6cdd-4e3c-a122-b0290e350b21"), name="questions_and_desired_answers", color="purple"
        ),
        Inputs.applicant_rizzume: WorkflowInputsDisplay(
            id=UUID("7f591623-342d-4f3c-812e-087f0526828a"), name="applicant_rizzume", color="lipstick"
        ),
        Inputs.interviewer_rizzume: WorkflowInputsDisplay(
            id=UUID("cc70acef-cde3-4c14-9263-688f07019e07"), name="interviewer_rizzume", color="lime"
        ),
    }
    entrypoint_displays = {
        RedFlagScan: EntrypointDisplay(
            id=UUID("1e22c9af-66ce-4c5f-bb99-0fe2317edf3a"),
            edge_display=EdgeDisplay(id=UUID("416015cb-c27a-4e7f-87cb-2c5481baaee9")),
        ),
        FunStuffCommonalitiesAndDifferences: EntrypointDisplay(
            id=UUID("1e22c9af-66ce-4c5f-bb99-0fe2317edf3a"),
            edge_display=EdgeDisplay(id=UUID("084181ef-af03-433f-bbb4-90cc526e9da7")),
        ),
        GetQuestionsAndAnswers: EntrypointDisplay(
            id=UUID("1e22c9af-66ce-4c5f-bb99-0fe2317edf3a"),
            edge_display=EdgeDisplay(id=UUID("c4e54317-9d28-44b7-80fb-78fc41c72e9a")),
        ),
        Summarize: EntrypointDisplay(
            id=UUID("1e22c9af-66ce-4c5f-bb99-0fe2317edf3a"),
            edge_display=EdgeDisplay(id=UUID("6c5253d5-2c82-4936-aa2e-f0130d66fad7")),
        ),
    }
    edge_displays = {
        (ExtractConfidence.Ports.default, Confidence): EdgeDisplay(id=UUID("f41ac687-fc63-46d1-886e-79928057375a")),
        (ExtractOpinion.Ports.default, Opinion1): EdgeDisplay(id=UUID("4b29cb13-6d09-47a9-934b-9ab6d1f85425")),
        (Opinion.Ports.default, ExtractConfidence): EdgeDisplay(id=UUID("62ba9e26-2651-4144-b328-9135bc17bb0c")),
        (Opinion.Ports.default, ExtractOpinion): EdgeDisplay(id=UUID("c27dede5-dd4b-4b72-b3f9-7bc99078ccb8")),
        (GetQuestionsAndAnswers.Ports.default, Opinion): EdgeDisplay(id=UUID("c76942f0-fd1e-4e25-8f1e-748fd4dc7ec0")),
        (Summarize.Ports.default, FinalOutput): EdgeDisplay(id=UUID("a799c03f-5e49-4c5c-bdde-a3521d7e064d")),
        (FunStuffCommonalitiesAndDifferences.Ports.default, Opinion): EdgeDisplay(
            id=UUID("c11124a2-9112-4a47-bdd8-47db22506bcf")
        ),
        (RedFlagScan.Ports.default, Opinion): EdgeDisplay(id=UUID("73305168-33fc-4a60-a870-dbb6ba5e2d0e")),
    }
    output_displays = {
        Workflow.Outputs.confidence: WorkflowOutputDisplay(
            id=UUID("fd34db3a-6e89-4129-ab10-3ab48ca1dde7"), name="confidence"
        ),
        Workflow.Outputs.opinion: WorkflowOutputDisplay(
            id=UUID("84ee453d-4ba7-429c-baf7-f70905239dec"), name="opinion"
        ),
        Workflow.Outputs.final_output: WorkflowOutputDisplay(
            id=UUID("7013b83e-10ef-4f70-adfc-0ce439080258"), name="final-output"
        ),
    }
