# Quick Start: DrawKaro Deployment

## 5-Minute Setup

### Step 1: Initialize Git & GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/drawkaro.git
git push -u origin main
```

### Step 2: Deploy Backend to Railway

1. Visit [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `drawkaro` repository
5. In Railway dashboard, set environment variables:
   - `PORT` = 3000
   - `NODE_ENV` = production
6. Copy your Railway URL (e.g., `https://drawkaro-abc123.up.railway.app`)

### Step 3: Update Frontend Config

Update `.env.production`:
```
VITE_API_URL=https://drawkaro-abc123.up.railway.app
```

### Step 4: Configure GitHub Pages

1. Go to your repo → Settings → Pages
2. Select source as "GitHub Actions"
3. The workflow will auto-deploy

### Step 5: Setup Custom Domain

1. Register domain at your registrar
2. Update DNS to point to GitHub Pages:
   ```
   A: 185.199.108.153
      185.199.109.153
      185.199.110.153
      185.199.111.153
   ```
3. In GitHub Pages settings, add custom domain: `drawkaro.io`

## Status Check

- **Frontend:** https://drawkaro.io
- **Backend:** Check Railway dashboard
- **Actions:** GitHub repo → Actions tab

## That's It! 🎉

Your app is now live and deployed!

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Pages not loading | Wait 5 min, clear cache, check Actions tab |
| WebSocket fails | Verify Railway URL in .env.production |
| Domain not resolving | DNS can take 24-48 hours |
| Build error | Run `npm install` and `npm run build:frontend` locally |

## Next Steps

- Monitor Railway logs for errors
- Test game at https://drawkaro.io
- Configure analytics
- Setup error monitoring
