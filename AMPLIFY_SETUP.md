# AWS Amplify Deployment Setup Guide

This guide will help you deploy TrafficSense to AWS Amplify with your AWS credentials.

## Prerequisites

1. AWS Account with access keys
2. Git repository (GitHub, GitLab, or Bitbucket)
3. AWS Amplify Console access

## Step 1: Configure AWS Credentials Locally (For CLI)

If you want to use Amplify CLI, configure your credentials:

```powershell
# Install AWS CLI if not already installed
# Download from: https://aws.amazon.com/cli/

# Configure AWS credentials
aws configure
```

When prompted, enter:
- **AWS Access Key ID**: `YOUR_AWS_ACCESS_KEY_ID` (use your actual key)
- **AWS Secret Access Key**: `YOUR_AWS_SECRET_ACCESS_KEY` (use your actual key)
- **Default region**: `us-east-1` (or your preferred region)
- **Default output format**: `json`

## Step 2: Install Amplify CLI (Optional)

```powershell
npm install -g @aws-amplify/cli
```

## Step 3: Deploy via Amplify Console (Recommended)

### 3.1 Connect Your Repository

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click **"New app"** → **"Host web app"**
3. Connect your Git provider (GitHub/GitLab/Bitbucket)
4. Select your repository and branch (usually `main` or `master`)

### 3.2 Configure Build Settings

Amplify will auto-detect `amplify.yml`. If it doesn't, use this configuration:

```yaml
version: 1
applications:
  - frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: dist
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/
  - backend:
      phases:
        build:
          commands:
            - cd backend
            - pip install -r requirements.txt -t .
```

### 3.3 Set Environment Variables

In Amplify Console → Your App → **Environment variables**, add:

1. **GEMINI_API_KEY**: Your Gemini API key
   - Value: `AIzaSyCg6fsNFEAknLbLXGXbp46xSSecicdhN0s`

2. **AWS_ACCESS_KEY_ID**: (Optional, only if needed for backend)
   - Value: `YOUR_AWS_ACCESS_KEY_ID` (use your actual key)
   - ⚠️ **Note**: For Lambda functions, use IAM roles instead of access keys

3. **AWS_SECRET_ACCESS_KEY**: (Optional, only if needed for backend)
   - Value: `YOUR_AWS_SECRET_ACCESS_KEY` (use your actual key)
   - ⚠️ **Note**: For Lambda functions, use IAM roles instead of access keys

### 3.4 Deploy Lambda Function (Backend)

If you need to deploy the Lambda function:

1. In Amplify Console, go to **Backend environments**
2. Click **Add backend environment**
3. Or use Amplify CLI (see Step 4)

## Step 4: Deploy Lambda Function with Amplify CLI (Alternative)

```powershell
# Initialize Amplify in your project
amplify init

# When prompted:
# - Choose your editor: VS Code (or your preference)
# - Type of app: javascript
# - Framework: react
# - Source directory: /
# - Distribution directory: dist
# - Build command: npm run build
# - Start command: npm run dev
# - AWS profile: default (or create new one)

# Add Lambda function
amplify add function

# When prompted:
# - Function name: trafficsense-api
# - Runtime: Python 3.11 (or latest)
# - Function template: Hello World
# - Advanced settings: Yes
#   - Environment variables: Add GEMINI_API_KEY
#   - Lambda layers: No
#   - CloudWatch: Yes (optional)

# Copy your Lambda function code
# Edit: amplify/backend/function/trafficsense-api/src/index.py
# Replace with content from backend/lambda_function.py

# Add API Gateway
amplify add api

# When prompted:
# - API type: REST
# - Function: trafficsense-api
# - Path: /{proxy+}
# - Method: ANY
# - Authorization: API Key (or AWS IAM)

# Push to AWS
amplify push
```

## Step 5: Update Frontend API URL

After Lambda deployment, you'll get an API endpoint. Update `services/geminiService.ts`:

```typescript
// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || '/api';

export const analyzeTrafficImagesAPI = async (formData: FormData): Promise<TrafficAnalysisResult> => {
  const response = await fetch(`${API_URL}/analyze`, {
    method: 'POST',
    body: formData,
  });
  // ... rest of the code
};
```

Set `VITE_API_URL` in Amplify Console environment variables to your Lambda API endpoint.

## Step 6: IAM Roles Setup (Recommended for Lambda)

Instead of using access keys in Lambda, create an IAM role:

1. Go to **IAM Console** → **Roles** → **Create role**
2. Select **Lambda** as trusted entity
3. Attach policies:
   - `AWSLambdaBasicExecutionRole` (for CloudWatch logs)
4. Name: `trafficsense-lambda-role`
5. Assign this role to your Lambda function in Amplify

## Security Best Practices

1. ✅ **DO**: Use IAM roles for Lambda functions (not access keys)
2. ✅ **DO**: Store sensitive keys in Amplify Console environment variables
3. ✅ **DO**: Use AWS Secrets Manager for production secrets
4. ❌ **DON'T**: Commit credentials to Git
5. ❌ **DON'T**: Hardcode credentials in code
6. ❌ **DON'T**: Share access keys publicly

## Troubleshooting

### Build Fails
- Check Amplify Console build logs
- Verify `amplify.yml` syntax
- Ensure all dependencies are in `package.json`

### Lambda Function Not Working
- Check CloudWatch logs
- Verify environment variables are set
- Test Lambda function directly in AWS Console

### API Gateway CORS Issues
- Add CORS headers in Lambda response
- Configure CORS in API Gateway settings

## Next Steps

After successful deployment:

1. Test the deployed application
2. Set up custom domain (optional)
3. Configure CDN caching
4. Set up monitoring and alerts

## Support

For issues, check:
- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- [Amplify Console](https://console.aws.amazon.com/amplify/)

