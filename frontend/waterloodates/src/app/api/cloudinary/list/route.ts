import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})

const loadImages = () => cloudinary.search
  .expression('resource_type:image')
  .sort_by('created_at', 'desc')
  .max_results(50)
  .execute()

export async function GET() {
  try {
    const result = await loadImages()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 })
  }
} 