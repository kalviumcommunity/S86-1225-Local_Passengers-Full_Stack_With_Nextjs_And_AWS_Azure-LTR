This documentation has been consolidated into README.md. Please refer to README for setup and testing.

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```

5. Save changes

**Production Note:** Replace `"AllowedOrigins": ["*"]` with your actual domain:
```json
"AllowedOrigins": ["https://yourdomain.com", "http://localhost:5174"]
```

### Create IAM User
1. Go to IAM service in AWS Console
2. Click "Users" → "Create user"
3. **User name**: `local-passengers-uploader`
4. Click "Next"
5. **Permissions**: Select "Attach policies directly"
6. Search and select: `AmazonS3FullAccess`
   
   **Or create a custom policy** (more secure):
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:GetObject",
           "s3:DeleteObject"
         ],
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }
   ```

7. Click "Next" → "Create user"

### Generate Access Keys
1. Click on the created user
2. Go to "Security credentials" tab
3. Scroll to "Access keys"
4. Click "Create access key"
5. Select "Application running outside AWS"
6. Click "Next" → "Create access key"
7. **SAVE THESE CREDENTIALS** - you won't see them again!
   - Access key ID
   - Secret access key

## 2. Application Configuration

### Update .env File
Create or update your `.env` file in the `ltr` directory:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/local_passengers"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# AWS S3 Configuration
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="wJalr..."
AWS_REGION="ap-south-1"
AWS_BUCKET_NAME="your-bucket-name"
```

**IMPORTANT:** 
- Replace the AWS values with your actual credentials
- Never commit `.env` to Git
- Keep your credentials secret

## 3. Database Migration

Run the Prisma migration to add the File model:

```bash
cd ltr
npx prisma migrate dev --name add_file_model
```

Or if database is already set up:

```bash
npx prisma generate
```

## 4. Test the Setup

### Start the Application
```bash
npm run dev
```

### Test with Bruno/Postman

1. **Login** to get authentication token:
   ```
   POST http://localhost:5174/api/auth/login
   Body: { "email": "admin@example.com", "password": "admin123" }
   ```

2. **Generate pre-signed URL**:
   ```
   POST http://localhost:5174/api/upload
   Headers: Authorization: Bearer <token>
   Body: {
     "fileName": "test.jpg",
     "fileType": "image/jpeg",
     "fileSize": 50000
   }
   ```

3. **Upload file to S3**:
   Use the `uploadUrl` from step 2 to PUT your file.

4. **Save metadata**:
   ```
   POST http://localhost:5174/api/files
   Headers: Authorization: Bearer <token>
   Body: {
     "fileName": "test.jpg",
     "fileUrl": "<publicUrl from step 2>",
     "fileType": "image/jpeg",
     "fileSize": 50000,
     "isPublic": true
   }
   ```

## 5. Verify Everything Works

### Check S3 Bucket
1. Go to AWS S3 Console
2. Open your bucket
3. Navigate to `uploads/<userId>/`
4. You should see your uploaded file

### Check Database
```bash
npx prisma studio
```
- Open the `File` model
- You should see your file record

### Access the File
Copy the `publicUrl` from the response and open it in your browser. You should see/download your file.

## Troubleshooting

### Error: AWS_NOT_CONFIGURED
- Check `.env` file has all AWS variables
- Restart the dev server: `Ctrl+C` then `npm run dev`

### Error: 403 Forbidden on S3 Upload
- Check CORS configuration in S3
- Verify IAM user has PutObject permission
- Check bucket policy doesn't block uploads

### Error: Access Denied
- Verify AWS credentials are correct
- Check IAM user has proper permissions
- Ensure bucket name matches .env

### Pre-signed URL Expired
- URLs expire in 60 seconds
- Generate a new one and upload immediately
- Consider increasing expiry in the code if needed

### File Not Found in S3
- Check bucket name is correct
- Look in `uploads/<userId>/` prefix
- Verify upload was successful (check response status)

## Security Best Practices

1. ✅ Never commit `.env` to version control
2. ✅ Use IAM policies with minimal permissions
3. ✅ Enable S3 bucket versioning
4. ✅ Set up CloudTrail for audit logging
5. ✅ Use VPC endpoints for enhanced security (production)
6. ✅ Enable MFA delete on S3 bucket (production)
7. ✅ Regularly rotate AWS access keys
8. ✅ Monitor S3 usage with CloudWatch

## Cost Optimization

1. **Enable Lifecycle Policies**:
   - Go to bucket → Management → Lifecycle rules
   - Create rule to delete old files after X days
   - Example: Delete files older than 30 days

2. **Use Intelligent-Tiering**:
   - Automatically moves files to cheaper storage classes
   - Good for infrequently accessed files

3. **Monitor Usage**:
   - Set up billing alerts in AWS
   - Monitor with CloudWatch
   - Review S3 storage analytics

## Production Checklist

- [ ] Use custom IAM policy with minimal permissions
- [ ] Configure bucket versioning
- [ ] Set up lifecycle policies
- [ ] Enable server-side encryption
- [ ] Configure proper CORS with specific origins
- [ ] Set up CloudWatch monitoring
- [ ] Enable CloudTrail logging
- [ ] Configure bucket policies
- [ ] Set up automatic backups
- [ ] Implement rate limiting on upload endpoints
- [ ] Add virus scanning for uploaded files
- [ ] Set up CDN (CloudFront) for file delivery
- [ ] Rotate AWS access keys regularly
- [ ] Monitor costs and set billing alerts

## Support

For issues or questions:
- Check the [README.md](../README.md) for detailed documentation
- Review [FILE_UPLOAD_TESTING.md](./FILE_UPLOAD_TESTING.md) for testing guide
- Check AWS S3 documentation: https://docs.aws.amazon.com/s3/
- Check Next.js API routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

## Next Steps

Once file upload is working:
1. Implement client-side UI for file selection and upload
2. Add image preview functionality
3. Implement file validation on client-side
4. Add progress indicators for uploads
5. Consider implementing drag-and-drop
6. Add thumbnail generation for images
7. Implement file search and filtering
8. Add bulk upload capability
