# Quick Start: Deploy TrafficSense to AWS Amplify

## 🚀 Fastest Method: Amplify Console

### Step 1: Prepare Your Repository
1. Push your code to GitHub/GitLab/Bitbucket
2. Make sure `amplify.yml` is in the root directory

### Step 2: Connect to Amplify Console
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click **"New app"** → **"Host web app"**
3. Connect your Git provider
4. Select repository: `trafficsense`
5. Select branch: `main` (or your default branch)
6. Amplify will detect `amplify.yml` automatically

### Step 3: Configure Environment Variables
In Amplify Console → Your App → **Environment variables**, add:

| Variable Name | Value |
|--------------|-------|
| `GEMINI_API_KEY` | `AIzaSyCg6fsNFEAknLbLXGXbp46xSSecicdhN0s` |
| `VITE_API_URL` | (Leave empty for now, will add after Lambda deployment) |

### Step 4: Deploy Frontend
1. Click **"Save and deploy"**
2. Wait for build to complete (5-10 minutes first time)
3. Get your hosted URL from Amplify Console

### Step 5: Deploy Lambda Function (Backend)

#### Option A: Using Amplify CLI (Recommended)

```powershell
# 1. Install Amplify CLI
npm install -g @aws-amplify/cli

# 2. Configure AWS credentials
aws configure
# Enter:
# Access Key: YOUR_AWS_ACCESS_KEY_ID
# Secret Key: YOUR_AWS_SECRET_ACCESS_KEY
# Region: us-east-1
# Format: json

# 3. Initialize Amplify
amplify init
# Follow prompts (see amplify-cli-commands.md for details)

# 4. Add Lambda function
amplify add function
# Function name: trafficsense-api
# Runtime: Python 3.11
# Add environment variable: GEMINI_API_KEY

# 5. Copy Lambda code
# Copy backend/lambda_function.py to amplify/backend/function/trafficsense-api/src/index.py
# Copy backend/main.py to amplify/backend/function/trafficsense-api/src/
# Copy backend/requirements.txt to amplify/backend/function/trafficsense-api/src/

# 6. Add API Gateway
amplify add api
# Type: REST
# Path: /{proxy+}
# Function: trafficsense-api

# 7. Deploy
amplify push
```

#### Option B: Using AWS Console Directly

1. Go to [AWS Lambda Console](https://console.aws.amazon.com/lambda/)
2. Click **"Create function"**
3. Function name: `trafficsense-api`
4. Runtime: Python 3.11
5. Create function
6. Upload code from `backend/` directory
7. Add environment variable: `GEMINI_API_KEY`
8. Create API Gateway trigger
9. Note the API endpoint URL

### Step 6: Update Frontend Environment Variable

1. In Amplify Console → Environment variables
2. Add/Update: `VITE_API_URL` = Your Lambda API endpoint URL
3. Redeploy frontend

## 🔐 Security Notes

⚠️ **IMPORTANT**: 
- Never commit AWS credentials to Git (they're already in `.gitignore`)
- Use IAM roles for Lambda functions in production (not access keys)
- Store secrets in AWS Secrets Manager for production

## ✅ Verification Checklist

- [ ] Frontend deployed and accessible
- [ ] Lambda function deployed
- [ ] API Gateway endpoint created
- [ ] Environment variables set in Amplify Console
- [ ] `VITE_API_URL` points to your API endpoint
- [ ] Frontend can call backend API
- [ ] Test upload and analysis works

## 📝 Next Steps

1. Set up custom domain (optional)
2. Enable CloudFront CDN
3. Set up monitoring and alerts
4. Configure backup and disaster recovery

## 🆘 Troubleshooting

**Build fails:**
- Check Amplify Console build logs
- Verify all dependencies in `package.json`
- Check `amplify.yml` syntax

**API not working:**
- Verify Lambda function is deployed
- Check CloudWatch logs for errors
- Verify `VITE_API_URL` is set correctly
- Check CORS settings in API Gateway

**Environment variables not working:**
- Make sure variable names are correct
- Redeploy after adding variables
- Check variable values don't have extra spaces

## 📚 Additional Resources

- [AMPLIFY_SETUP.md](./AMPLIFY_SETUP.md) - Detailed setup guide
- [amplify-cli-commands.md](./amplify-cli-commands.md) - CLI command reference
- [AWS Amplify Docs](https://docs.aws.amazon.com/amplify/)

