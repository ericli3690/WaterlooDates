'use client'

import { useEffect } from 'react'
import { useCloudinary } from '@/hooks/useCloudinary'

export default function TestCloudinary() {
  const { images, message, loading, loadImages, handleUpload, handleDelete } = useCloudinary()

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  useEffect(() => {
    loadImages()
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Cloudinary CRUD Test</h1>
      
      {/* Upload */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-lg font-semibold mb-2">Upload</h2>
        <input 
          type="file" 
          onChange={onFileChange}
          accept="image/*"
          className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {/* Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <div className="flex items-center gap-2">
          {loading && <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>}
          <span>{message || 'Ready'}</span>
        </div>
      </div>

      {/* List & Delete */}
      <div className="p-4 border rounded">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Images ({images.length})</h2>
          <button 
            onClick={loadImages}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh
          </button>
        </div>
        
        {images.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No images found</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img) => (
              <div key={img.public_id} className="border rounded p-2">
                <img 
                  src={img.secure_url} 
                  alt={img.public_id}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <p className="text-xs text-gray-600 mb-2 truncate">{img.public_id}</p>
                <button
                  onClick={() => handleDelete(img.public_id)}
                  className="w-full px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 