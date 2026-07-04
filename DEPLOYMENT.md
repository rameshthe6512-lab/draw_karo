# DrawKaro Deployment Guide

Complete deployment setup for DrawKaro with custom domain, GitHub Pages frontend, and Railway/Vercel backend.

## Architecture Overview

```
drawkaro.io (GitHub Pages Frontend)
    ↓
drawkaro-api.railway.app (WebSocket Backend)
```

## Prerequisites

- GitHub account with repository access
- Railway.app account (or Vercel account as alternative)
- Domain registered (drawkaro.io)
- Node.js 20+

---

## Part 1: GitHub Setup

### 1.1 Initialize GitHub Repository

```bash
# Navigate to project directory
cd drawkaro

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Create repository on GitHub
# Then:
git remote add origin https://github.com/YOUR_USERNAME/drawkaro.git
git branch -M main
git push -u origin main
```

### 1.2 GitHub Pages Configuration

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under "Build and deployment":
   - **Source:** GitHub Actions
   - **Action:** The workflow file will deploy automatically

The `.github/workflows/deploy.yml` file is already configured to:
- Build the frontend on every push to `main`
- Deploy to GitHub Pages
- Automatically create `CNAME` file for custom domain

---

## Part 2: Backend Deployment (Railway Recommended)

### Railway Deployment (Recommended)

#### 2.1 Create Railway Project

1. Sign up at [railway.app](https://railway.app)
2. Create a new project
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account and select the `drawkaro` repository

#### 2.2 Configure Environment Variables

In Railway dashboard, go to your project and add these variables:

```
PORT=3000
GEMINI_API_KEY=your_actual_gemini_api_key
NODE_ENV=production
```

#### 2.3 Deployment

Railway automatically deploys when you push to the `main` branch. It will:
- Use the `Procfile`: `web: node drawkaro-server.js`
- Start the WebSocket server on the provided PORT
- Generate a public URL like: `https://drawkaro-api.railway.app`

#### 2.4 Get Your Backend URL

After deployment, Railway gives you a domain like:
```
https://drawkaro-xyz.up.railway.app
```

Update this in `.env.production`:
```
VITE_API_URL=https://drawkaro-xyz.up.railway.app
```

---

## Part 3: Custom Domain Setup (drawkaro.io)

### 3.1 Domain Registration

1. Register domain at your preferred registrar (Namecheap, GoDaddy, etc.)
2. Once registered, update nameservers or DNS records

### 3.2 Point Domain to GitHub Pages

In your domain registrar's DNS settings, add:

**For apex domain (drawkaro.io):**

```
Type: A
Value: 185.199.108.153
      185.199.109.153
      185.199.110.153
      185.199.111.153
```

**For www subdomain (www.drawkaro.io):**

```
Type: CNAME
Value: your-username.github.io
```

### 3.3 Enable HTTPS (GitHub Pages)

1. Go to GitHub repo → Settings → Pages
2. Under "Custom domain": Enter `drawkaro.io`
3. Check "Enforce HTTPS"
4. GitHub will automatically manage SSL/TLS

---

## Part 4: Connect Backend to Frontend

### 4.1 Update WebSocket Connection

The frontend needs to connect to the backend WebSocket server. Update your frontend code where WebSocket connections are made:

```javascript
// Use environment variable for API URL
const API_URL = import.meta.env.VITE_API_URL || 'ws://localhost:3000';
const ws = new WebSocket(API_URL);
```

### 4.2 CORS/WebSocket Configuration

The backend server is already configured to accept connections. If you need CORS headers for API calls:

Add to `drawkaro-server.js`:
```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://drawkaro.io',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};
```

---

## Part 5: Deployment Checklist

### Before Going Live

- [ ] GitHub repository created and connected
- [ ] GitHub Actions workflow file in place
- [ ] Railway project created and environment variables set
- [ ] Backend deployed and URL obtained
- [ ] `VITE_API_URL` updated in `.env.production`
- [ ] Domain registered and DNS configured
- [ ] SSL/HTTPS enabled on GitHub Pages
- [ ] Local test build: `npm run build:frontend`
- [ ] Test WebSocket connection with deployed backend

### Deployment Steps

```bash
# 1. Commit and push all changes
git add .
git commit -m "Setup deployment configuration"
git push origin main

# 2. GitHub Actions will automatically:
#    - Build the frontend
#    - Deploy to GitHub Pages at https://drawkaro.io

# 3. Monitor deployment:
#    - Go to: Settings → Pages
#    - Check workflow status at: Actions tab

# 4. Verify at: https://drawkaro.io
```

---

## Part 6: Environment Variables

### GitHub Secrets (Optional for API Key)

If you want to keep your API key secure:

1. Go to repo Settings → Secrets and variables → Actions
2. Add `GEMINI_API_KEY` secret
3. Update `.github/workflows/deploy.yml` to use it

```yaml
env:
  GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
```

---

## Part 7: Monitoring & Maintenance

### GitHub Pages Status
- **URL:** https://github.com/YOUR_USERNAME/drawkaro/settings/pages

### Railway Logs
- Go to Railway dashboard → Deployments tab
- View build and runtime logs

### Check Backend Health
```bash
# Test WebSocket connection
# Update URL to your Railway domain
curl https://your-railway-domain.up.railway.app
```

---

## Part 8: Alternative: Vercel Backend Deployment

If you prefer Vercel for the backend:

1. Go to [vercel.com](https://vercel.com)
2. Import the GitHub repository
3. Set environment variables
4. Deploy

The `vercel.json` is already configured for frontend deployment.

---

## Troubleshooting

### GitHub Pages not updating
- Clear browser cache (Ctrl+Shift+Del)
- Wait 5 minutes for DNS propagation
- Check Actions tab for build errors

### WebSocket connection failed
- Verify Railway deployment URL is correct
- Check that backend server is running
- Look at Railway logs for errors
- Ensure firewall allows WebSocket connections

### Domain not resolving
- DNS changes take 24-48 hours to propagate
- Verify DNS records with: `dig drawkaro.io`
- Check domain registrar settings

### Build errors
- Run `npm install` locally
- Check `npm run build:frontend` output
- Verify Node.js version matches

---

## API References

- **Google Gemini API Docs:** https://ai.google.dev/
- **Railway Docs:** https://docs.railway.app/
- **GitHub Pages Docs:** https://docs.github.com/en/pages

---

## Support

For issues:
1. Check GitHub Actions logs for build errors
2. Check Railway dashboard for deployment errors
3. Monitor browser console for WebSocket errors
4. Review `.env` files are properly configured
