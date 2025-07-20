'use client'

import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RizzumeForm, { RizzumeFormRef } from '@/components/RizzumeForm'
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default withPageAuthRequired(function MakeRizzumePage({ user }: { user: any }) {
    const formRef = useRef<RizzumeFormRef>(null)
    const router = useRouter()
    const [initialData, setInitialData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Fetch existing rizzume data on component mount
    useEffect(() => {
        const fetchExistingRizzume = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/get_user_rizzume`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id: user.sub })
                });

                if (response.ok) {
                    const rizzumeData = await response.json();
                    setInitialData(rizzumeData);
                } else {
                    // If no existing rizzume found, initialData remains null
                    console.log('No existing rizzume found or user error');
                }
            } catch (error) {
                console.error('Error fetching existing rizzume:', error);
                // Continue with empty form if fetch fails
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.sub) {
            fetchExistingRizzume();
        } else {
            setIsLoading(false);
        }
    }, [user?.sub]);

    const handleFormSubmit = async (formData: any) => {
        try {
            // Submit the new rizzume to the backend
            formData.user_id = user.sub;
            const res = await fetch(`http://127.0.0.1:5000/api/create_or_upload_rizzume`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (res.ok) {
                router.push('/dashboard');
            } else {
                const errorData = await res.json();
                setErrorMessage(errorData.message || 'Please try again.');
                setShowErrorDialog(true);
                setTimeout(() => setShowErrorDialog(false), 3000);
            }
        } catch (error) {
            console.error('Error submitting rizzumé:', error);
            setErrorMessage('An error occurred while submitting your rizzumé. Please check your connection and try again.');
            setShowErrorDialog(true);
            setTimeout(() => setShowErrorDialog(false), 3000);
        }
    };

    const handleSubmitClick = () => {
        if (formRef.current) {
            formRef.current.submitForm();
        }
    };

    // Show loading state while fetching data
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#664e5b] flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
                    <div className="text-lg font-semibold text-gray-700">Loading your Rizzumé...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#664e5b] flex items-center justify-center p-24">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full">
                <RizzumeForm 
                    ref={formRef} 
                    onSubmit={handleFormSubmit} 
                    initialData={initialData}
                />
                <div className="text-center pt-4 pb-8">
                    <button 
                        onClick={handleSubmitClick}
                        className="bg-[#ff76e8] text-white px-8 py-2 rounded font-semibold hover:cursor-pointer hover:bg-[#ff76e8]/80 transition-colors"
                    >
                        {initialData ? 'Update Application' : 'Submit Application'}
                    </button>
                </div>
            </div>

            {/* Success Dialog */}
            {showSuccessDialog && (
              <div className="fixed top-4 right-4 bg-[#dafaf1] border-2 border-[#26a69a] text-[#008066] px-4 py-3 rounded-lg shadow-lg z-50">
                <p className="font-medium">Rizzumé submitted successfully!</p>
              </div>
            )}

            {/* Error Dialog */}
            {showErrorDialog && (
              <div className="fixed top-4 right-4 bg-[#ffe6e6] border-2 border-[#e03e3e] text-[#a80000] px-4 py-3 rounded-lg shadow-lg z-50">
                <p className="font-medium">Error: {errorMessage}</p>
              </div>
            )}
        </div>
    )
});
