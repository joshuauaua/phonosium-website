# Vercel Deployment Guide

## ✅ Setup Complete

Your Azure Blob Storage backend has been converted to Vercel Serverless Functions!

## 🔐 Configure Environment Variables in Vercel

You need to add these environment variables to your Vercel project:

### 1. Go to Vercel Dashboard
Visit: https://vercel.com/joshuauaua/phonosium-website/settings/environment-variables

### 2. Add the following variables:

| Variable Name | Value | Environments |
|--------------|-------|--------------|
| `AZURE_STORAGE_CONNECTION_STRING` | Get from `api/local.settings.json` | Production, Preview |
| `AZURE_STORAGE_ACCOUNT_NAME` | Get from `api/local.settings.json` | Production, Preview |
| `AZURE_STORAGE_ACCOUNT_KEY` | Get from `api/local.settings.json` | Production, Preview |
| `ALLOWED_ORIGINS` | `https://phonosium-website.vercel.app,http://localhost:5173` | Production, Preview |

**Note:** Copy the actual values from your local `api/local.settings.json` file (not committed to git).

## 🚀 Deploy

Once environment variables are added, Vercel will automatically deploy when you push:

```bash
git add -A
git commit -m "feat: migrate to Vercel serverless functions"
git push origin main
```

Vercel will automatically detect the changes and deploy!

## 📍 Your API Endpoints

After deployment, your endpoints will be:

- **Upload URL:** `https://phonosium-website.vercel.app/api/submissions/upload-url`
- **Submit Form:** `https://phonosium-website.vercel.app/api/submissions/submit`

## 🧪 Testing Locally with Vercel CLI

Install Vercel CLI:
```bash
npm i -g vercel
```

Run locally:
```bash
vercel dev
```

This will start the dev server with serverless functions at `http://localhost:3000`

## 📂 File Structure

```
phonosium-website/
├── api/
│   ├── upload-url.js    # Upload URL endpoint
│   └── submit.js         # Submit form endpoint
├── src/
│   └── utils/
│       └── azureUpload.js  # Frontend API client
├── vercel.json           # Vercel configuration
└── .env                  # Local environment variables
```

## 🔄 How It Works

1. **Frontend** calls `/api/submissions/upload-url`
2. **Vercel** routes to `/api/upload-url.js` serverless function
3. **Function** generates Azure SAS URL and returns it
4. **Frontend** uploads file directly to Azure Blob Storage
5. **Frontend** calls `/api/submissions/submit` with metadata
6. **Vercel** routes to `/api/submit.js` serverless function
7. **Function** saves metadata to Azure Blob Storage

## ✨ Benefits of Vercel over Azure Functions

- ✅ No cold start issues
- ✅ Automatic deployments on git push
- ✅ Better integration with your frontend
- ✅ Simpler configuration
- ✅ Free tier is very generous
- ✅ Faster deployment times

## 🐛 Troubleshooting

### If endpoints return 404:
- Verify `vercel.json` is in the root directory
- Check that API files are in the `/api` directory
- Redeploy the project

### If you get CORS errors:
- Verify `ALLOWED_ORIGINS` includes your domain
- Check browser console for the exact error

### To view logs:
```bash
vercel logs phonosium-website
```

Or visit: https://vercel.com/joshuauaua/phonosium-website/logs
