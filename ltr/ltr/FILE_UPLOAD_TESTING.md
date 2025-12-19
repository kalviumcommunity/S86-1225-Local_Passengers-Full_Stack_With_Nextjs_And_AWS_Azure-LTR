# File Upload Testing Guide

## Overview
This guide explains how to test the file upload feature with AWS S3 pre-signed URLs.

## Prerequisites
1. AWS S3 bucket configured with proper CORS settings
2. AWS credentials set in `.env` file
3. User authentication token (login first)

## Testing Flow

### Step 1: Login to Get Token
Use the `auth-login-user.bru` or `auth-login-admin.bru` to get an authentication token.

```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

Save the token from the response.

### Step 2: Generate Pre-signed URL
Use `file-upload-generate-url.bru`:

```json
POST /api/upload
Headers: Authorization: Bearer <your-token>
{
  "fileName": "profile-picture.jpg",
  "fileType": "image/jpeg",
  "fileSize": 102400
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Pre-signed URL generated successfully",
  "data": {
    "uploadUrl": "https://your-bucket.s3.amazonaws.com/...",
    "fileKey": "uploads/1/1734567890-profile-picture.jpg",
    "publicUrl": "https://your-bucket.s3.ap-south-1.amazonaws.com/...",
    "expiresIn": 60
  }
}
```

**Important:** The uploadUrl expires in 60 seconds, so proceed quickly to the next step!

### Step 3: Upload File to S3
You cannot do this directly in Bruno, so use one of these methods:

#### Option A: Using cURL (Windows PowerShell)
```powershell
$uploadUrl = "paste-url-from-step-2"
$filePath = "C:\path\to\your\file.jpg"

Invoke-RestMethod -Uri $uploadUrl -Method PUT -InFile $filePath -ContentType "image/jpeg"
```

#### Option B: Using Postman
1. Create a new request
2. Method: PUT
3. URL: Paste the `uploadUrl` from Step 2
4. Headers: `Content-Type: image/jpeg`
5. Body: Select "Binary" and choose your file
6. Click Send

#### Option C: Using JavaScript/Browser
```javascript
const file = document.querySelector('input[type="file"]').files[0];
const uploadUrl = "paste-url-from-step-2";

await fetch(uploadUrl, {
  method: 'PUT',
  headers: {
    'Content-Type': file.type
  },
  body: file
});
```

### Step 4: Save File Metadata
Use `files-save-metadata.bru`:

```json
POST /api/files
Headers: Authorization: Bearer <your-token>
{
  "fileName": "profile-picture.jpg",
  "fileUrl": "https://your-bucket.s3.ap-south-1.amazonaws.com/uploads/1/1734567890-profile-picture.jpg",
  "fileType": "image/jpeg",
  "fileSize": 102400,
  "isPublic": true
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "File metadata saved successfully",
  "data": {
    "id": 1,
    "fileName": "profile-picture.jpg",
    "fileUrl": "https://...",
    "fileType": "image/jpeg",
    "fileSize": 102400,
    "uploadedBy": 1,
    "isPublic": true,
    "createdAt": "2024-12-19T...",
    "uploader": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### Step 5: Verify Upload
Open the `publicUrl` from Step 4 in your browser to see the uploaded file.

### Step 6: List Files
Use `files-get-all.bru`:

```
GET /api/files?limit=50&offset=0
Headers: Authorization: Bearer <your-token>
```

### Step 7: Get Single File
Use `files-get-single.bru`:

```
GET /api/files/1
Headers: Authorization: Bearer <your-token>
```

### Step 8: Delete File (Optional)
Use `files-delete.bru`:

```
DELETE /api/files/1
Headers: Authorization: Bearer <your-token>
```

## Error Testing

### Test Invalid File Type
```json
POST /api/upload
{
  "fileName": "malware.exe",
  "fileType": "application/x-msdownload",
  "fileSize": 1000
}
```
**Expected:** 400 Bad Request - File type not supported

### Test File Too Large
```json
POST /api/upload
{
  "fileName": "large-file.jpg",
  "fileType": "image/jpeg",
  "fileSize": 20971520
}
```
**Expected:** 400 Bad Request - File size exceeds maximum limit

### Test Missing Authentication
Remove the Authorization header and try any request.
**Expected:** 401 Unauthorized

### Test Expired Pre-signed URL
1. Generate a pre-signed URL
2. Wait 61+ seconds
3. Try to upload
**Expected:** 403 Forbidden from S3

### Test Access Other User's File
1. Upload a file as User A
2. Try to GET/DELETE it as User B (non-admin)
**Expected:** 403 Forbidden

## Troubleshooting

### AWS_NOT_CONFIGURED Error
- Check `.env` file has AWS credentials
- Verify bucket name and region are correct
- Restart the dev server after updating .env

### 403 Forbidden from S3
- Check S3 bucket CORS configuration
- Verify IAM user has s3:PutObject permission
- Check if bucket policy blocks public access

### URL Expired
- Pre-signed URLs expire in 60 seconds
- Generate a new URL and upload immediately

### File Not Appearing in S3
- Check the bucket name in the URL
- Verify the file was actually uploaded (check network tab)
- Look in the correct prefix: `uploads/<userId>/`

## Best Practices

1. **Always validate file size on client** before requesting pre-signed URL
2. **Check file type** before upload
3. **Handle upload errors** gracefully
4. **Store metadata immediately** after successful S3 upload
5. **Use appropriate Content-Type** headers during upload
6. **Set isPublic carefully** - consider security implications
7. **Implement lifecycle policies** in S3 to auto-delete old files

## Sample Complete Flow (JavaScript)

```javascript
async function uploadFileComplete(file) {
  try {
    // 1. Get pre-signed URL
    const urlResponse = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      })
    });
    
    const { data } = await urlResponse.json();
    
    // 2. Upload to S3
    await fetch(data.uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type
      },
      body: file
    });
    
    // 3. Save metadata
    const metaResponse = await fetch('/api/files', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        fileName: file.name,
        fileUrl: data.publicUrl,
        fileType: file.type,
        fileSize: file.size,
        isPublic: true
      })
    });
    
    const result = await metaResponse.json();
    console.log('Upload complete!', result);
    
  } catch (error) {
    console.error('Upload failed:', error);
  }
}
```

## Security Notes

1. **Never expose AWS credentials** in client-side code
2. **Validate file types** on both client and server
3. **Enforce file size limits** to prevent abuse
4. **Use short expiry times** for pre-signed URLs (60 seconds)
5. **Implement rate limiting** to prevent abuse
6. **Consider implementing virus scanning** for uploaded files
7. **Use private buckets** and generate signed URLs for file access
8. **Monitor S3 usage** to detect unusual activity

## Cost Optimization

1. Enable S3 lifecycle policies to delete old files
2. Use S3 Intelligent-Tiering for infrequently accessed files
3. Monitor storage usage with CloudWatch
4. Consider using CloudFront CDN for frequently accessed files
5. Implement cleanup jobs to remove orphaned files
