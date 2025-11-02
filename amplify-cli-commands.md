# Amplify CLI Commands for TrafficSense

## Quick Setup Commands

### 1. Initialize Amplify

```powershell
amplify init
```

**When prompted:**
- Enter a name for the project: `trafficsense`
- Initialize the project with the above settings? `Yes`
- Select the authentication method: `AWS access keys`
- AWS Access Key ID: `YOUR_AWS_ACCESS_KEY_ID` (use your actual key)
- AWS Secret Access Key: `YOUR_AWS_SECRET_ACCESS_KEY` (use your actual key)
- Please choose the type of app: `javascript`
- What javascript framework: `react`
- Source Directory Path: `.`
- Distribution Directory Path: `dist`
- Build Command: `npm run build`
- Start Command: `npm run dev`
- Do you want to use an AWS profile? `Yes` (or `No` if using access keys directly)

### 2. Add Lambda Function

```powershell
amplify add function
```

**When prompted:**
- Select capability: `Lambda function (serverless function)`
- Provide function name: `trafficsense-api`
- Choose runtime: `Python 3.11` or `Python 3.12`
- Choose the function template: `Hello World`
- Do you want to configure advanced settings? `Yes`
- Do you want to enable Lambda layers? `No`
- Do you want to configure environment variables? `Yes`
  - Enter environment variable name: `GEMINI_API_KEY`
  - Enter environment variable value: `AIzaSyCg6fsNFEAknLbLXGXbp46xSSecicdhN0s`
  - Do you want to add another? `No`
- Do you want to configure a Lambda trigger? `No`

### 3. Update Lambda Function Code

After creating the function, you need to replace the default code:

```powershell
# Navigate to the function directory
cd amplify/backend/function/trafficsense-api/src

# Replace index.py with your Lambda function
# Copy contents from backend/lambda_function.py
# Also copy backend/main.py and backend/requirements.txt
```

Or manually:
1. Copy `backend/lambda_function.py` to `amplify/backend/function/trafficsense-api/src/index.py`
2. Copy `backend/main.py` to `amplify/backend/function/trafficsense-api/src/main.py`
3. Copy `backend/requirements.txt` to `amplify/backend/function/trafficsense-api/src/requirements.txt`

### 4. Add API Gateway

```powershell
amplify add api
```

**When prompted:**
- Select from options: `REST`
- Would you like to add a new path? `Yes`
- Provide a path: `/{proxy+}`
- Choose a Lambda source: Select `trafficsense-api`
- Restrict API access: `Yes` (recommended)
- Who should have access? `Authenticated users only` or `Authenticated and Guest users`
- What kind of access: `create, read, update, delete`

### 5. Deploy to AWS

```powershell
amplify push
```

**When prompted:**
- Are you sure you want to continue? `Yes`
- Do you want to update code for your updated Lambda function? `Yes`
- Do you want to update the API? `Yes`

### 6. Get API Endpoint

After deployment, Amplify will display the API endpoint. You can also get it with:

```powershell
amplify status
```

Or check the Amplify Console.

### 7. Update Frontend Environment Variable

In Amplify Console:
1. Go to your app
2. Navigate to **Environment variables**
3. Add: `VITE_API_URL` = `https://your-api-id.execute-api.region.amazonaws.com/staging`

## Alternative: Direct Deployment Script

Create a PowerShell script `deploy-amplify.ps1`:

```powershell
# Configure AWS credentials
$env:AWS_ACCESS_KEY_ID = "YOUR_AWS_ACCESS_KEY_ID"
$env:AWS_SECRET_ACCESS_KEY = "YOUR_AWS_SECRET_ACCESS_KEY"
$env:AWS_DEFAULT_REGION = "us-east-1"

# Initialize Amplify (if not already done)
# amplify init

# Add function
# amplify add function

# Deploy
amplify push --yes
```

Run with: `.\deploy-amplify.ps1`

## Troubleshooting

### Function Not Found
```powershell
amplify function list
```

### View Function Details
```powershell
amplify function inspect trafficsense-api
```

### Remove and Re-add
```powershell
amplify remove function
amplify add function
amplify push
```

### Check Logs
```powershell
amplify console
# Then navigate to CloudWatch logs
```

