import calculate_relationship_match.workflow as workflow
from calculate_relationship_match.inputs import Inputs

# Returns (final_output, opinion, confidence)
# 
# Parameters:
# - transcript: from Ribbon
# - questions_to_transcript_mapping: from Ribbon
# - questions_and_desired_answers: list of {question: "...", desired_answer: "..."}
# - applicant_rizzume: Rizzume
# - interviewer_rizzume: Rizzume
def get_wingman_opinion(
    transcript: str,
    questions_to_transcript_mapping: list[dict],
    questions_and_desired_answers: list[dict],
    applicant_rizzume: dict,
    interviewer_rizzume: dict
) -> tuple[str, str, float]:
    output = workflow.Workflow().run(
        inputs=Inputs(
            transcript=transcript,
            questions_to_transcript_mapping=questions_to_transcript_mapping,
            questions_and_desired_answers=questions_and_desired_answers,
            applicant_rizzume=applicant_rizzume,
            interviewer_rizzume=interviewer_rizzume
        )
    ).outputs
    summary = output.final_output
    return summary, output.opinion, output.confidence