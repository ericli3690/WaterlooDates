'use client';

import React, { useEffect, useRef, useState } from 'react';

interface WingmanPageProps {
  flowId: string;
}

export default function ApplyWingmanPage({ flowId }: WingmanPageProps) {
  const [interviewLink, setInterviewLink] = useState<string | null>(null);
  const [showIframe, setShowIframe] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    (async () => {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    })()
  }, [])

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.addEventListener('load', () => {
        console.log('Iframe navigated (but we don\'t know to what URL)');
      });
    }
  }, [showIframe]);

  const createInterview = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/create_or_update_interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flow_id: "bfba5e51",
          applicant_user_id: "1",
          interviewer_user_id: "2",
          user_email: 'user@example.com', // This should be passed as a prop or retrieved from user context
          first_name: 'John', // This should be passed as a prop or retrieved from user context
          last_name: 'Doe' // This should be passed as a prop or retrieved from user context
        }),
      });
      const data = await response.json();
      
      if (data.success) {
        console.log('Interview ID:', data.interview_id);
        console.log('Interview Link:', data.interview_link);
        setInterviewLink(data.interview_link);
        setShowIframe(true);
        setShowSuccessDialog(true);
        setTimeout(() => setShowSuccessDialog(false), 3000);
      } else {
        setErrorMessage(data.error || 'Failed to create interview');
        setShowErrorDialog(true);
        setTimeout(() => setShowErrorDialog(false), 3000);
        console.error('Failed to create interview:', data.error);
      }
    } catch (error) {
      setErrorMessage('Network error occurred');
      setShowErrorDialog(true);
      setTimeout(() => setShowErrorDialog(false), 3000);
      console.error('Error creating interview:', error);
    }
  }
  
  return (
    <div className="min-                                                                        h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Wingman Application
        </h1>
        
        {!showIframe ? (
          <div className="space-y-4">
            <button 
              onClick={createInterview}
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold hover:cursor-pointer"
            >
              Join Interview
            </button> 
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Interview Link:</h3>
              <button 
                onClick={() => window.open(interviewLink!, '_blank')}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors hover:cursor-pointer"
              >
                Open in New Tab
              </button>
            </div>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <iframe 
                ref={iframeRef}
                src={interviewLink!}
                className="w-full h-96"
                allow="microphone; camera"
                title="Interview"
              />
            </div>
          </div>
        )}
        {/* Success Dialog */}
        {showSuccessDialog && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50">
            <p className="font-medium">Interview created successfully!</p>
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
