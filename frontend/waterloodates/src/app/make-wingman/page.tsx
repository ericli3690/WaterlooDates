"use client";

import React, { useState } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default withPageAuthRequired(function MakeWingmanPage({ user }: { user: any }) {
  const [questions, setQuestions] = useState<string[]>([""]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const addQuestion = () => {
    setQuestions([...questions, ""]);
  };

  const deleteQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const updateQuestion = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const createWingman = async () => {
    try {
      const validQuestions = questions.filter((q) => q.trim() !== "");

      const response = await fetch("http://127.0.0.1:5000/api/create-interview-flow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          posting_id: "001",
          questions: validQuestions,
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
    <div className="min-h-[calc(100vh-4rem)] bg-[#664e5b] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 border-4 border-[#ffda23]">
        <h1 className="text-3xl font-bold text-[#ff76e8] mb-8 text-center">
          Customize Your Wingman
        </h1>

        <div className="space-y-4 mb-6">
          {questions.map((question, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input
                type="text"
                value={question}
                onChange={(e) => updateQuestion(index, e.target.value)}
                placeholder="Enter your question here..."
                className="flex-1 px-4 py-2 border-2 border-[#ff76e8] rounded-lg focus:outline-none focus:ring-4 focus:ring-[#ff76e8]/50"
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
            className="flex items-center space-x-2 px-5 py-2 bg-[#ffda23] text-black rounded-lg hover:bg-[#f7e84a] transition-colors font-semibold"
          >
            <span className="text-xl font-bold">+</span>
            <span>Add Question</span>
          </button>
        </div>

        <div className="flex justify-center">
          <button
            onClick={createWingman}
            className="px-10 py-3 bg-[#ff76e8] text-black rounded-lg hover:bg-[#f054db] transition-colors font-semibold"
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
