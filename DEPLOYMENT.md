# Deployment Guide

This guide covers deploying Novarix Studio to various platforms with JSON file storage.

## 🚀 Quick Deploy

### Render (Recommended)
1. Fork this repository to your GitHub account
2. Connect your GitHub repository to Render
3. Create a new Web Service
4. Set environment variable: `SESSION_SECRET=your-random-secret-key`
5. Deploy automatically with `render.yaml` configuration

### Railway
1. Connect GitHub repository to Railway
2. Set `SESSION_SECRET` environment variable
3. Deploy using `railway.json` configuration

### Fly.io
```bash
# Install fly CLI
curl -L https://fly.io/install.sh | sh

# Login and deploy
fly auth login
fly launch --copy-config
fly deploy
```

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🔧 Environment Variables

All platforms require:
- `SESSION_SECRET`: Random string for session security
- `NODE_ENV`: Set to "production" (usually automatic)

## 📦 Data Persistence

The application uses JSON file storage in the `data/` directory:
- Data persists across deployments on platforms with file system persistence
- For platforms without persistent storage, data resets on deployment
- Consider using external storage (AWS S3, Google Cloud) for production persistence

## 🔒 Security Checklist

Before production deployment:
- [ ] Generate strong `SESSION_SECRET`
- [ ] Enable HTTPS on your platform
- [ ] Review CORS settings
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy for JSON data

## 📊 Monitoring

Health check endpoint: `GET /api/health`
- Returns service status and timestamp
- Use for uptime monitoring and load balancer health checks

## 🔄 Updates

The application supports rolling updates:
1. Push changes to main branch
2. Automatic deployment via GitHub Actions
3. Health checks ensure successful deployment