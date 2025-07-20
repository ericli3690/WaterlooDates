"use client";

import React, { useState } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

interface QuestionAndAnswer {
  question: string;
  answer: string;
}

export default withPageAuthRequired(function MakeWingmanPage({ user }: { user: any }) {
  const [questionsAndDesiredAnswers, setQuestionsAndDesiredAnswers] = useState<QuestionAndAnswer[]>([{ question: "", answer: "" }]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const addQuestion = () => {
    setQuestionsAndDesiredAnswers([...questionsAndDesiredAnswers, { question: "", answer: "" }]);
  };

  const deleteQuestion = (index: number) => {
    const newQuestionsAndAnswers = questionsAndDesiredAnswers.filter((_, i) => i !== index);
    setQuestionsAndDesiredAnswers(newQuestionsAndAnswers);
  };

  const updateQuestion = (index: number, value: string) => {
    const newQuestionsAndAnswers = [...questionsAndDesiredAnswers];
    newQuestionsAndAnswers[index] = { ...newQuestionsAndAnswers[index], question: value };
    setQuestionsAndDesiredAnswers(newQuestionsAndAnswers);
  };

  const updateDesiredAnswer = (index: number, value: string) => {
    const newQuestionsAndAnswers = [...questionsAndDesiredAnswers];
    newQuestionsAndAnswers[index] = { ...newQuestionsAndAnswers[index], answer: value };
    setQuestionsAndDesiredAnswers(newQuestionsAndAnswers);
  };

  const createWingman = async () => {
    try {
      // Filter out empty questions
      const validQuestionsAndAnswers = questionsAndDesiredAnswers.filter(qa => qa.question.trim() !== "");
      
      console.log('Questions and Desired Answers:', validQuestionsAndAnswers); // TO-DATABASE
      console.log('User ID:', user.sub);

      const response = await fetch("http://127.0.0.1:5000/api/create-interview-flow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.sub,
          questions_and_desired_answers: validQuestionsAndAnswers,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccessDialog(true);
        setTimeout(() => setShowSuccessDialog(false), 3000);
      } else {
        setErrorMessage(data.error || "Failed to create wingman");
        setShowErrorDialog(true);
        setTimeout(() => setShowErrorDialog(false), 3000);
      }
    } catch (error) {
      setErrorMessage("Network error occurred");
      setShowErrorDialog(true);
      setTimeout(() => setShowErrorDialog(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#664e5b] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-8 border-4 border-[#ffda23]">
        <h1 className="text-3xl font-bold text-[#ff76e8] mb-8 text-center">
          Customize Your Wingman
        </h1>

        <div className="space-y-4 mb-6">
          {questionsAndDesiredAnswers.map((qa, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input
                type="text"
                value={qa.question}
                onChange={(e) => updateQuestion(index, e.target.value)}
                placeholder="Enter your question here..."
                className="flex-1 px-4 py-2 border-2 border-[#ff76e8] text-gray-500 rounded-lg focus:outline-none focus:ring-4 focus:ring-[#ff76e8]/50"
              />
              <input
                type="text"
                value={qa.answer}
                onChange={(e) => updateDesiredAnswer(index, e.target.value)}
                placeholder="Looking for a particular answer?"
                className="flex-1 px-4 py-2 border-2 border-[#ff76e8] text-gray-500 rounded-lg focus:outline-none focus:ring-4 focus:ring-[#ff76e8]/50"
              />
              <button
                onClick={() => deleteQuestion(index)}
                className="p-2 text-[#ff76e8] hover:text-[#f054db] hover:bg-[#ffe0f7] rounded-lg transition-colors"
                title="Delete question"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={addQuestion}
            className="flex items-center space-x-2 px-5 py-2 bg-[#ffda23] text-black rounded-lg hover:bg-[#f7e84a] transition-colors font-semibold hover:cursor-pointer"
          >
            <span className="text-xl font-bold">+</span>
            <span>Add Question</span>
          </button>
        </div>

        <div className="flex justify-center">
          <button
            onClick={createWingman}
            className="px-10 py-3 bg-[#ff76e8] text-black rounded-lg hover:bg-[#f054db] transition-colors font-semibold hover:cursor-pointer"
          >
            Create My Wingman
          </button>
        </div>

        {/* Success Dialog */}
        {showSuccessDialog && (
          <div className="fixed top-4 right-4 bg-[#dafaf1] border-2 border-[#26a69a] text-[#008066] px-4 py-3 rounded-lg shadow-lg z-50">
            <p className="font-medium">Wingman created successfully!</p>
          </div>
        )}

        {/* Error Dialog */}
        {showErrorDialog && (
          <div className="fixed top-4 right-4 bg-[#ffe6e6] border-2 border-[#e03e3e] text-[#a80000] px-4 py-3 rounded-lg shadow-lg z-50">
            <p className="font-medium">Error: {errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
});
