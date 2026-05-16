# Azure Functions Deployment Guide

## ✅ What's Already Done

1. ✅ Azure Function App created: `phonosium-api`
2. ✅ Environment variables configured in Azure
3. ✅ GitHub Actions workflow created
4. ✅ Publish profile generated

## 🔐 Step 1: Add GitHub Secret

You need to add the Azure publish profile as a GitHub secret:

### Option A: Using GitHub CLI (Recommended)

```bash
# Install GitHub CLI if you don't have it
brew install gh

# Login to GitHub
gh auth login

# Add the secret
gh secret set AZURE_FUNCTIONAPP_PUBLISH_PROFILE < /tmp/phonosium-api-publish-profile.xml
```

### Option B: Using GitHub Web Interface

1. Go to your GitHub repository: https://github.com/joshuauaua/phonosium-website
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `AZURE_FUNCTIONAPP_PUBLISH_PROFILE`
5. Value: Copy the entire contents from `/tmp/phonosium-api-publish-profile.xml`
6. Click **Add secret**

To view the file contents:
```bash
cat /tmp/phonosium-api-publish-profile.xml
```

## 🚀 Step 2: Deploy via GitHub Actions

Once the secret is added:

```bash
# Commit and push the workflow file
git add .github/workflows/azure-functions-deploy.yml
git add DEPLOYMENT.md
git commit -m "feat: add Azure Functions deployment workflow"
git push origin main
```

The deployment will automatically start! Monitor it at:
https://github.com/joshuauaua/phonosium-website/actions

## 🌐 Step 3: Update Frontend Environment Variable

After successful deployment, update your Vercel environment variable:

1. Go to: https://vercel.com/your-projects/phonosium-website/settings/environment-variables
2. Add or update: `VITE_AZURE_FUNCTIONS_URL`
3. Value: `https://phonosium-api.azurewebsites.net/api`
4. Redeploy your Vercel app

## 📍 Your Azure Function URLs

- **Function App:** https://phonosium-api.azurewebsites.net
- **Upload URL Endpoint:** https://phonosium-api.azurewebsites.net/api/submissions/upload-url
- **Submit Form Endpoint:** https://phonosium-api.azurewebsites.net/api/submissions/submit

## 🧪 Testing the Deployment

After deployment completes, test the endpoints:

```bash
# Test upload URL endpoint
curl -X POST https://phonosium-api.azurewebsites.net/api/submissions/upload-url \
  -H "Content-Type: application/json" \
  -H "Origin: https://phonosium-website.vercel.app" \
  -d '{
    "fileName": "test.wav",
    "fileType": "audio/wav",
    "fileSize": 1000,
    "category": "audio",
    "submissionId": "test-123"
  }'
```

## 🔄 Future Deployments

Any changes pushed to the `api/` folder on the `main` branch will automatically trigger a new deployment.

You can also manually trigger deployment:
1. Go to: https://github.com/joshuauaua/phonosium-website/actions
2. Click "Deploy Azure Functions"
3. Click "Run workflow"

## 🐛 Troubleshooting

### If deployment fails:
- Check the GitHub Actions logs
- Verify the secret is added correctly
- Ensure the Azure Function App is running: `az functionapp show --name phonosium-api --resource-group DefaultResourceGroup-SEC --query state`

### If the function returns errors:
- Check Azure logs: `az functionapp log tail --name phonosium-api --resource-group DefaultResourceGroup-SEC`
- Verify environment variables in Azure Portal

## 📦 Azure Storage Containers

Your backend automatically creates these containers:
- `submissions-audio` - Audio files (WAV/MP3)
- `submissions-images` - Image files (JPEG/PNG/WebP)
- `submissions-metadata` - JSON metadata for submissions
