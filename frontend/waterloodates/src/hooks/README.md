# Cloudinary Hook for Template Upload and Fetching

A comprehensive React hook for handling Cloudinary operations including template upload, fetching, optimization, and deletion.

## Features

- 🚀 **Template Upload**: Upload files with drag & drop support
- 📋 **Template Fetching**: Retrieve templates from specific folders
- 🖼️ **Image Optimization**: Generate optimized URLs with transformations
- 🗑️ **Template Deletion**: Remove templates from Cloudinary
- 🔄 **Loading States**: Built-in loading and error states
- 📁 **Folder Organization**: Organize templates by type
- 🏷️ **Tagging System**: Auto-tagging for better organization

## Setup

### 1. Environment Variables

Create a `.env.local` file in your project root and add your Cloudinary credentials:

```env
# Required: Your Cloudinary cloud name (publicly safe)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here

# Optional: For server-side operations (keep these secret)
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_SECRET=your_api_secret_here

# Optional: Upload preset for unsigned uploads (recommended)
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_here
```

### 2. Cloudinary Upload Preset (Recommended)

For client-side uploads, create an unsigned upload preset in your Cloudinary console:

1. Go to Settings > Upload presets
2. Add upload preset
3. Set it to "Unsigned"
4. Configure allowed formats, transformations, etc.
5. Use the preset name in your environment variables

## Basic Usage

```tsx
import { useCloudinary } from '@/hooks/useCloudinary';

function MyComponent() {
  const {
    uploadTemplate,
    uploading,
    uploadError,
    fetchTemplates,
    templates,
    fetching,
    getOptimizedUrl,
  } = useCloudinary();

  const handleFileUpload = async (file: File) => {
    try {
      const result = await uploadTemplate(file, {
        folder: 'templates/resumes',
        tags: ['resume', 'template'],
      });
      console.log('Upload successful:', result);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const loadTemplates = async () => {
    try {
      await fetchTemplates('templates/resumes');
    } catch (error) {
      console.error('Fetch failed:', error);
    }
  };

  return (
    <div>
      {/* Upload UI */}
      <input
        type="file"
        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
      />
      {uploading && <p>Uploading...</p>}
      {uploadError && <p>Error: {uploadError.message}</p>}

      {/* Templates List */}
      <button onClick={loadTemplates}>Load Templates</button>
      {fetching && <p>Loading...</p>}
      {templates.map((template) => (
        <div key={template.public_id}>
          <img
            src={getOptimizedUrl(template.public_id, { width: 200, height: 150 })}
            alt={template.public_id}
          />
        </div>
      ))}
    </div>
  );
}
```

## Advanced Usage

### Upload with Custom Options

```tsx
const uploadOptions = {
  folder: 'templates/cover-letters',
  tags: ['cover-letter', 'template', 'professional'],
  publicId: 'custom-template-name',
  resourceType: 'auto',
  uploadPreset: 'my_preset', // Optional
};

const result = await uploadTemplate(file, uploadOptions);
```

### Image Transformations

```tsx
// Basic optimization
const optimizedUrl = getOptimizedUrl(publicId, {
  width: 400,
  height: 300,
  crop: 'fill',
  quality: 'auto',
});

// Advanced transformations
const advancedUrl = getOptimizedUrl(publicId, {
  width: 800,
  height: 600,
  crop: 'limit',
  quality: 80,
  format: 'webp',
  gravity: 'center',
});
```

### Fetching Templates by Folder

```tsx
// Fetch from specific folder
await fetchTemplates('templates/resumes');

// Using predefined folders
import { templateFolders } from '@/config/cloudinary';
await fetchTemplates(templateFolders.coverLetters);
```

### Error Handling

```tsx
const {
  uploadError,
  fetchError,
  clearUploadError,
  clearFetchError,
} = useCloudinary();

// Clear errors when needed
const handleRetry = () => {
  clearUploadError();
  clearFetchError();
  // Retry operation
};
```

## API Reference

### Hook Return Values

```typescript
interface UseCloudinaryReturn {
  // Upload functionality
  uploadTemplate: (file: File, options?: UploadOptions) => Promise<UploadResult>;
  uploading: boolean;
  uploadError: UploadError | null;
  
  // Fetch functionality
  fetchTemplates: (folder?: string) => Promise<UploadResult[]>;
  templates: UploadResult[];
  fetching: boolean;
  fetchError: string | null;
  
  // Utility functions
  getOptimizedUrl: (publicId: string, options?: TransformOptions) => string;
  deleteTemplate: (publicId: string) => Promise<boolean>;
  
  // Clear functions
  clearUploadError: () => void;
  clearFetchError: () => void;
}
```

### Types

```typescript
interface UploadOptions {
  folder?: string;
  publicId?: string;
  tags?: string[];
  transformation?: any[];
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  uploadPreset?: string;
}

interface TransformOptions {
  width?: number;
  height?: number;
  crop?: string;
  quality?: string | number;
  format?: string;
  gravity?: string;
}

interface UploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  [key: string]: any;
}
```

## Complete Example Component

See `src/components/TemplateUploader.tsx` for a complete implementation example with:
- Drag & drop upload
- Template grid display
- Error handling
- Loading states
- Template deletion

## Security Notes

⚠️ **Important Security Considerations:**

1. **API Credentials**: Never expose `CLOUDINARY_API_KEY` or `CLOUDINARY_SECRET` in client-side code
2. **Upload Presets**: Use unsigned upload presets for client-side uploads
3. **Server-side Operations**: Implement fetching and deletion through your backend API
4. **Validation**: Always validate file types and sizes before upload

## Troubleshooting

### Common Issues

1. **"Cloud name is required"**: Ensure `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set
2. **Upload fails**: Check if upload preset is configured correctly
3. **Fetch fails**: Ensure you're not exposing API credentials on client-side
4. **CORS errors**: Configure allowed origins in Cloudinary settings

### Production Recommendations

1. Implement server-side API routes for sensitive operations
2. Use signed uploads for production environments
3. Implement proper file validation and security checks
4. Set up proper folder structure and access controls
5. Monitor usage and costs through Cloudinary dashboard 