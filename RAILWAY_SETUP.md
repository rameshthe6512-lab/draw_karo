# 🚂 Railway.app Backend Deployment

**Complete Railway setup guide for DrawKaro backend**

---

## Step 1: Connect GitHub to Railway

1. Go to: https://railway.app/dashboard
2. Click **+ New Project**
3. Select **Deploy from GitHub repo**
4. Click **Authorize GitHub** (if needed)
5. Search for and select **drawkaro** repository
6. Click **Deploy Now**

**Wait 2-3 minutes for build to complete**

---

## Step 2: Configure Environment Variables

Once deployed, Railway auto-detects:
- ✅ `Procfile` (startup command)
- ✅ `package.json` (dependencies)
- ✅ `drawkaro-server.js` (entry point)

Add these variables:

1. Click your project
2. Go to **Variables** tab
3. Add:

```
PORT = 3000
NODE_ENV = production
```

That's it! No API keys needed. ✨

---

## Step 3: Get Your Backend URL

1. Go to **Deployments** tab
2. Look for "Public URL"
3. Copy it (looks like: `https://drawkaro-abc123.up.railway.app`)

---

## Step 4: Update Frontend Config

Replace in `.env.production`:

```bash
VITE_API_URL=https://drawkaro-YOUR-URL.up.railway.app
```

Commit and push:

```bash
git add .env.production
git commit -m "Update Railway URL"
git push origin main
```

---

## That's It! 🚀

Your backend is now live on Railway.

**Next:** Setup GitHub Pages (frontend)

