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
                alert('Rizzumé submitted successfully!');
                // Redirect to dashboard
                router.push('/dashboard');
            } else {
                const errorData = await res.json();
                alert(`Failed to submit rizzumé: ${errorData.message || 'Please try again.'}`);
            }
        } catch (error) {
            console.error('Error submitting rizzumé:', error);
            alert('An error occurred while submitting your rizzumé. Please check your connection and try again.');
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
        <div className="min-h-screen bg-[#664e5b] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full">
                <RizzumeForm 
                    ref={formRef} 
                    onSubmit={handleFormSubmit} 
                    initialData={initialData}
                />
                <div className="text-center pt-4 pb-8">
                    <button 
                        onClick={handleSubmitClick}
                        className="bg-blue-600 text-white px-8 py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
                    >
                        {initialData ? 'Update Application' : 'Submit Application'}
                    </button>
                </div>
            </div>
        </div>
    )
});
