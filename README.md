# Phonosium Website

Community-driven platform for phonetic and acoustic research.

## Development

```bash
npm install
npm run dev
```

## Environment Variables

Required environment variables:

- `AZURE_STORAGE_CONNECTION_STRING` - Azure Blob Storage connection string
- `AZURE_STORAGE_ACCOUNT_NAME` - Azure Storage account name (for SAS token generation)
- `AZURE_STORAGE_ACCOUNT_KEY` - Azure Storage account key (for SAS token generation)
- `ALLOWED_ORIGINS` - Comma-separated list of allowed CORS origins (e.g., `http://localhost:5173,https://phonosium.com`)
- `VITE_AZURE_FUNCTIONS_URL` - Base URL for Azure Functions API (default: `/api`)

## Monitoring

### Error Tracking

The application uses structured error logging to track upload failures in production. Client-side errors are automatically logged to the `/api/log` endpoint, which streams to Vercel logs.

### Setting Up Log Drains

To enable centralized monitoring:

1. **Choose a log drain service** (all have free tiers):
   - **Axiom** (recommended): 500MB/month free, built-in dashboards
   - **Better Stack** (Logtail): 1GB/month free, simple UI
   - **Datadog**: More features but complex setup

2. **Configure in Vercel Dashboard**:
   - Go to Project Settings → Integrations → Log Drains
   - Add your chosen service
   - Filter for logs containing: `upload_url_request_failed`, `upload_xhr_error`, `AZURE_STORAGE_CONNECTION_STRING not configured`

3. **Create monitoring dashboard**:
   - Track upload failure rate over time
   - Error breakdown by category
   - Top error messages
   - Set alerts for:
     - Upload failure rate > 10% over 1 hour
     - Missing environment variables
     - Repeated CORS errors

### Error Categories

- `upload_url_request_failed` - Failed to get upload URL from server
- `upload_xhr_error` - Network error during file upload
- `upload_xhr_aborted` - Upload was aborted
- `upload_xhr_failed` - Upload failed with non-2xx status
- `submission_failed` - Final form submission failed

### Accessing Logs

- **Vercel Dashboard**: Project → Logs
- **Log Drain Service**: Access your configured dashboard (Axiom, Better Stack, etc.)

### Privacy

Error logs do NOT include user-identifiable information (email, IP addresses). Only submission IDs and technical metadata are logged.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) and [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for deployment instructions.
