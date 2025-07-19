'use client'

import { useRef } from 'react'
import RizzumeForm, { RizzumeFormRef } from '@/components/RizzumeForm'

export default function JobApplicationForm() {
  const formRef = useRef<RizzumeFormRef>(null)

  const handleFormSubmit = async (formData: any) => {
    try {
      // Submit the new rizzume to the backend
      const res = await fetch(`http://127.0.0.1:5000/api/create_or_upload_rizzume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        alert('Rizzume submitted successfully!');
        // Optionally redirect or clear form
        window.location.reload(); // This will clear the form
      } else {
        const errorData = await res.json();
        alert(`Failed to submit rizzume: ${errorData.message || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Error submitting rizzume:', error);
      alert('An error occurred while submitting your rizzume. Please check your connection and try again.');
    }
  };

  const handleSubmitClick = () => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  };

  return (
    <div>
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
  )
}
