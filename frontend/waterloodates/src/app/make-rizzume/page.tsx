'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import RizzumeForm, { RizzumeFormRef } from '@/components/RizzumeForm'
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default withPageAuthRequired(function MakeRizzumePage({ user }: { user: any }) {
    const formRef = useRef<RizzumeFormRef>(null)
    const router = useRouter()

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

    return (
        <div className="min-h-screen bg-[#664e5b] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full">
                <RizzumeForm ref={formRef} onSubmit={handleFormSubmit} />
                <div className="text-center pt-4 pb-8">
                    <button 
                        onClick={handleSubmitClick}
                        className="bg-blue-600 text-white px-8 py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Submit Application
                    </button>
                </div>
            </div>
        </div>
    )
});
