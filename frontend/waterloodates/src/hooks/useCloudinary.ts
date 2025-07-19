import { useState } from 'react'

export function useCloudinary() {
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<any[]>([])
  const [message, setMessage] = useState('')

  const api = async (url: string, options?: RequestInit) => {
    setLoading(true)
    try {
      const res = await fetch(url, options)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      return data
    } finally {
      setLoading(false)
    }
  }

  const loadImages = async () => {
    try {
      const result = await api('/api/cloudinary/list')
      const imageList = result.resources || []
      setImages(imageList)
      setMessage(`Loaded ${imageList.length} images`)
    } catch (error) {
      setMessage('Failed to load images')
    }
  }

  const handleUpload = async (file: File) => {
    try {
      const form = new FormData()
      form.append('file', file)
      const result = await api('/api/cloudinary/upload', { method: 'POST', body: form })
      setMessage(`✅ Uploaded: ${result.public_id}`)
      loadImages()
    } catch (error) {
      setMessage(`❌ Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleDelete = async (publicId: string) => {
    try {
      await api(`/api/cloudinary/delete?publicId=${publicId}`, { method: 'DELETE' })
      setMessage(`✅ Deleted: ${publicId}`)
      loadImages()
    } catch (error) {
      setMessage('❌ Delete failed')
    }
  }

  return {
    images,
    message,
    loading,
    loadImages,
    handleUpload,
    handleDelete
  }
} 