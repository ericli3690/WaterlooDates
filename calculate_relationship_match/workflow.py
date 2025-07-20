from vellum.workflows import BaseWorkflow
from vellum.workflows.state import BaseState

from .inputs import Inputs
from .nodes.confidence import Confidence
from .nodes.extract_confidence import ExtractConfidence
from .nodes.extract_opinion import ExtractOpinion
from .nodes.final_output import FinalOutput
from .nodes.fun_stuff_commonalities_and_differences import FunStuffCommonalitiesAndDifferences
from .nodes.get_questions_and_answers import GetQuestionsAndAnswers
from .nodes.opinion import Opinion
from .nodes.opinion_1 import Opinion1
from .nodes.red_flag_scan import RedFlagScan
from .nodes.summarize import Summarize


class Workflow(BaseWorkflow[Inputs, BaseState]):
    graph = {
        RedFlagScan
        >> Opinion
        >> {
            ExtractConfidence >> Confidence,
            ExtractOpinion >> Opinion1,
        },
        FunStuffCommonalitiesAndDifferences >> Opinion,
        GetQuestionsAndAnswers >> Opinion,
        Summarize >> FinalOutput,
    }
    print("GRAPH: ", graph)

    class Outputs(BaseWorkflow.Outputs):
        confidence = Confidence.Outputs.value
        opinion = Opinion1.Outputs.value
        final_output = FinalOutput.Outputs.value
