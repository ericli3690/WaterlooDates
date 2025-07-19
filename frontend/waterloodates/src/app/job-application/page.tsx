'use client'

import { useState } from 'react'
import { useCloudinary } from '@/hooks/useCloudinary'

export default function JobApplicationForm() {
  const [formData, setFormData] = useState<any>(null)
  const [uploadedImageId, setUploadedImageId] = useState<string>('')
  const [imageUrl, setImageUrl] = useState<string>('')
  const { handleUpload, loading } = useCloudinary()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    try {
      const result = await handleUpload(file)
      setUploadedImageId(result.public_id)
      setImageUrl(result.secure_url)
    } catch (error) {
      console.error('Image upload failed:', error)
    }
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const data = new FormData(e.target)
    const rawData = Object.fromEntries(data.entries())
    
    // Structure data according to MongoDB schema
    const structuredData = {
        user_id: rawData.user_id || '',
        profile: {
            name: {
                first: rawData.firstName || '',
                middle: rawData.middleName || '',
                last: rawData.lastName || ''
            },
            age: rawData.age ? parseInt(rawData.age as string) : null,
            sexuality: rawData.sexuality || '',
            gender: rawData.gender || '',
            image_id: uploadedImageId || ''
        },
        job: {
            workterm: rawData.workterm ? parseInt(rawData.workterm as string) : null,
            currentjob: rawData.currentjob || ''
        },
        fun_stuff: {
            blurb: rawData.blurb || '',
            hobbies: rawData.hobbies || '',
            fun_fact: rawData.fun_fact || '',
        }
    }
    setFormData(structuredData)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold tracking-wider">RIZZUME FORM</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Section */}
        <div className="border border-black">
          <div className="bg-blue-100 border-b border-black px-4 py-1">
            <h2 className="font-bold text-center tracking-wide">PROFILE</h2>
          </div>
          <div className="p-4 space-y-3">
            {/* Full Name Row */}
            <div className="flex items-center gap-8">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <label className="font-semibold pt-2 min-w-fit">FULL NAME:</label>
                  <div className="flex gap-4 flex-1">
                    <div className="flex-1">
                      <input name="firstName" className="w-full border-b border-black bg-transparent outline-none pb-1" />
                      <div className="text-xs text-center">First</div>
                    </div>
                    <div className="flex-1">
                      <input name="middleName" className="w-full border-b border-black bg-transparent outline-none pb-1" />
                      <div className="text-xs text-center">Middle</div>
                    </div>
                    <div className="flex-1">
                      <input name="lastName" className="w-full border-b border-black bg-transparent outline-none pb-1" />
                      <div className="text-xs text-center">Last</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Age, Gender, Sexuality Row */}
            <div className="flex gap-8 items-end w-full">
              {/* Age */}
              <div className="flex-1 min-w-0 gap-4 mt-1">
                <div className="flex items-center gap-2">
                  <label className="font-semibold">AGE:</label>
                  <input
                    name="age"
                    type="number"
                    min="0"
                    className="flex-1 border-b border-black bg-transparent outline-none pb-1 ml-2"
                  />
                </div>
              </div>
              {/* Gender */}
              <div className="flex-1 min-w-0 gap-4 mt-1">
                <div className="flex items-center gap-2">
                  <label className="font-semibold">GENDER:</label>
                  <select
                    name="gender"
                    className="flex-1 border-b border-black bg-transparent outline-none pb-1 ml-2"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="nonbinary">Non-binary</option>
                    <option value="other">Other</option>
                    <option value="preferNotToSay">Prefer not to say</option>
                  </select>
                </div>
              </div>
              {/* Sexuality */}
              <div className="flex-1 min-w-0 gap-4 mt-1">
                <div className="flex items-center gap-2">
                  <label className="font-semibold">SEXUALITY:</label>
                  <select
                    name="sexuality"
                    className="flex-1 border-b border-black bg-transparent outline-none pb-1 ml-2"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="straight">Straight</option>
                    <option value="gay">Gay</option>
                    <option value="lesbian">Lesbian</option>
                    <option value="bisexual">Bisexual</option>
                    <option value="pansexual">Pansexual</option>
                    <option value="queer">Queer</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Profile Image Upload */}
            <div className="flex items-start gap-4">
              <label className="font-semibold min-w-fit pt-2">PROFILE IMAGE:</label>
              <div className="flex-1">
                <input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="w-full text-sm file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-2"
                />
                {loading && <span className="text-sm text-blue-600">Uploading...</span>}
                {uploadedImageId && <span className="text-sm text-green-600">✅ Uploaded!</span>}
                
                {imageUrl && (
                  <div className="mt-2">
                    <img 
                      src={imageUrl} 
                      alt="Profile preview" 
                      className="w-24 h-24 object-cover border border-black rounded"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Job Section */}
        <div className="border border-black">
          <div className="bg-blue-100 border-b border-black px-4 py-1">
            <h2 className="font-bold text-center tracking-wide">JOB</h2>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-4">
              <label className="font-semibold min-w-fit">WORK TERM:</label>
              <select
                name="workterm"
                className="flex-1 border-b border-black bg-transparent outline-none pb-1"
                defaultValue=""
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <label className="font-semibold min-w-fit">CURRENT JOB:</label>
              <input name="currentjob" className="flex-1 border-b border-black bg-transparent outline-none pb-1" placeholder="e.g., Software Engineer at Google" />
            </div>
          </div>
        </div>

        {/* Fun Stuff Section */}
        <div className="border border-black">
          <div className="bg-blue-100 border-b border-black px-4 py-1">
            <h2 className="font-bold text-center tracking-wide">FUN STUFF</h2>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-start gap-4">
              <label className="font-semibold min-w-fit pt-2">BLURB:</label>
              <textarea 
                name="blurb" 
                className="flex-1 border border-black bg-transparent outline-none p-2 resize-none" 
                rows={3}
                placeholder="Tell us about yourself in a few sentences..."
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="font-semibold min-w-fit">HOBBIES:</label>
              <input name="hobbies" className="flex-1 border-b border-black bg-transparent outline-none pb-1" placeholder="e.g., Reading, Gaming, Hiking" />
            </div>

            <div className="flex items-center gap-4">
              <label className="font-semibold min-w-fit">FUN FACT:</label>
              <input name="fun_fact" className="flex-1 border-b border-black bg-transparent outline-none pb-1" placeholder="Share something interesting about yourself!" />
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded font-semibold hover:bg-blue-700 transition-colors">
            Submit Application
          </button>
        </div>
      </form>

      {formData && (
        <div className="mt-8 p-6 bg-gray-50 rounded">
          <h2 className="text-xl font-semibold mb-4">Form Output (MongoDB Structure)</h2>
          <pre className="bg-white p-4 rounded border overflow-auto text-sm">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
