import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})

const handleDelete = (publicId: string) => cloudinary.uploader.destroy(publicId)

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('publicId')
    
    if (!publicId) return NextResponse.json({ error: 'Public ID required' }, { status: 400 })
    
    const result = await handleDelete(publicId)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
} 