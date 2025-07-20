'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default withPageAuthRequired(function ApplyWingmanPage({ user }) {
  const searchParams = useSearchParams();
  const applicantUserId = searchParams.get('applicant_user_id');
  const interviewerUserId = searchParams.get('interviewer_user_id');
  
  const [interviewLink, setInterviewLink] = useState<string | null>(null);
  const [showIframe, setShowIframe] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    // Only create interview if we have both user IDs
    if (applicantUserId && interviewerUserId) {
      createInterview();
    } else {
      setIsLoading(false);
      setErrorMessage('Missing user IDs in URL parameters');
      setShowErrorDialog(true);
    }
  }, [applicantUserId, interviewerUserId]);

  const createInterview = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://127.0.0.1:5000/api/create_or_update_interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicant_user_id: applicantUserId,
          interviewer_user_id: interviewerUserId
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
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#664e5b] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Wingman Application
        </h1>

        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Creating interview...</span>
          </div>
        ) : showIframe && interviewLink ? (
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
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">Failed to load interview. Please try refreshing the page.</p>
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
});
