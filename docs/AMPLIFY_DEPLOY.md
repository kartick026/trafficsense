 # Deploying trafficsense to AWS Amplify

 This document guides you through deploying the frontend and a minimal backend to AWS Amplify.

 Two main approaches:

 - Amplify Console (connect your Git repo) — easiest for frontend hosting and CI/CD.
 - Amplify CLI (locally) — lets you add backend functions (Lambda) and push them to AWS.

 1) Frontend — Amplify Console (recommended)

 - In the Amplify Console, choose "Host web app" and connect your Git provider (GitHub, Bitbucket, GitLab).
 - Select the repository and branch. Amplify detects the `amplify.yml` file and will use it to build.
 - After the build completes, Amplify will provide a hosted URL and automatic HTTPS.

 Notes:
 - The `amplify.yml` in the repo runs `npm ci` and `npm run build`, then uses the `dist` folder (Vite default) as artifacts.

 2) Backend — adding a Lambda function with Amplify CLI

 If you want a simple API alongside your site, use Amplify CLI to add a function and an API gateway route.

 Local steps (PowerShell):

 ```powershell
 # Install Amplify CLI if not installed
 npm install -g @aws-amplify/cli

 # Configure Amplify and pick an AWS profile (run once)
 amplify configure

 # Initialize Amplify in the repo root
 amplify init

 # Add a Lambda function (choose "Hello World" -> Python)
 amplify add function

 # Optionally add an API and connect the function
 amplify add api
 # - choose REST
 # - use existing function or create a new one

 # Push backend resources to AWS
 amplify push
 ```

 After `amplify push` completes, Amplify will create the Lambda, API Gateway, and link them. You can then update the frontend to call the provided API URL. If you prefer the minimal pre-built Lambda handler in `backend/lambda_function.py`, you can copy its code into the function created by Amplify.

 3) Local testing

 - Frontend: `npm run dev` (already confirmed working) and `npm run build` for production bundle.
 - Backend (local):
   - FastAPI local server: `python -m venv .venv; .\.venv\Scripts\Activate.ps1; pip install -r backend\requirements.txt; python backend\main.py`
   - Lambda handler testing: use AWS SAM or a simple curl test once deployed.

 4) Security and CI

 - Never commit AWS credentials. Use Amplify Console's connection to your Git provider or configure CI with GitHub Actions and store secrets in the provider.
 - Use least-privilege IAM roles for the Amplify service and functions.

 5) Next steps I can do for you

 - Copy `backend/lambda_function.py` contents into an Amplify-created Lambda function and provide the `amplify` CLI commands to wire everything.
 - Add an example `fetch` call in the frontend that points to an environment-configured API URL (e.g., `VITE_API_URL`) and show how to set that in Amplify Console.
