def main(questions_to_transcript_mapping, questions_and_desired_answers):
    output = []
    answered_qs = {}
    for mapping in questions_to_transcript_mapping:
        answered_qs[mapping.script_question] = mapping.transcript_items[1].content
    for i, qa in enumerate(questions_and_desired_answers):
        this_one = {}
        this_one["question"] = qa.question
        this_one["desired_answer"] = qa.desired_answer
        this_one["answer"] = answered_qs.get(qa.question, "")
        output.append(this_one)
    return output