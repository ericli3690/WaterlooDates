'use client';

import React, { useState } from 'react';

interface WingmanPageProps {
  userId: string;
}

export default function MakeWingmanPage({ userId }: WingmanPageProps) {
  const [questions, setQuestions] = useState<string[]>(['']);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const addQuestion = () => {
    setQuestions([...questions, '']);
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
      // Filter out empty questions
      const validQuestions = questions.filter(q => q.trim() !== '');
      
      console.log('Questions:', validQuestions);
      console.log('User ID:', userId);

      const response = await fetch('http://127.0.0.1:5000/api/create-interview-flow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          posting_id: "001",
          questions: validQuestions
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('Flow ID:', data.message);
        setShowSuccessDialog(true);
        setTimeout(() => setShowSuccessDialog(false), 3000);
      } else {
        setErrorMessage(data.error || 'Failed to create wingman');
        setShowErrorDialog(true);
        setTimeout(() => setShowErrorDialog(false), 3000);
      }
    } catch (error) {
      setErrorMessage('Network error occurred');
      setShowErrorDialog(true);
      setTimeout(() => setShowErrorDialog(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
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
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => deleteQuestion(index)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
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
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <span>+</span>
            <span>Add Question</span>
          </button>
        </div>

        <div className="flex justify-center">
          <button
            onClick={createWingman}
            className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
          >
            Create My Wingman
          </button>
        </div>

        {/* Success Dialog */}
        {showSuccessDialog && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50">
            <p className="font-medium">Wingman created successfully!</p>
          </div>
        )}

        {/* Error Dialog */}
        {showErrorDialog && (
          <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50">
            <p className="font-medium">Error: {errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
