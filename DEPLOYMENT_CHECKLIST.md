# Complete Deployment Checklist

Follow these steps in order to deploy DrawKaro to drawkaro.io.

## Pre-Deployment (5 minutes)

- [ ] Node.js 20+ installed (`node -v`)
- [ ] Git installed (`git -v`)
- [ ] GitHub account created
- [ ] Railway account created (https://railway.app)
- [ ] Domain registered (drawkaro.io)

---

## Phase 1: GitHub Repository Setup (5 minutes)

### Step 1.1: Initialize Git
```bash
cd drawkaro
git config user.name "Your Name"
git config user.email "your.email@gmail.com"
git init
```

- [ ] Git initialized

### Step 1.2: Add & Commit Files
```bash
git add .
git commit -m "Initial DrawKaro project with deployment config"
```

- [ ] Files committed

### Step 1.3: Create GitHub Repository
1. Go to https://github.com/new
2. **Repository name:** `drawkaro`
3. **Description:** "Multiplayer drawing & guessing game"
4. **Visibility:** Public
5. **Initialize repository:** No (we already have files)
6. Click **Create repository**

- [ ] Repository created on GitHub
- [ ] Copy the HTTPS URL: `https://github.com/YOUR_USERNAME/drawkaro.git`

### Step 1.4: Connect Local Repository
```bash
git remote add origin https://github.com/YOUR_USERNAME/drawkaro.git
git branch -M main
git push -u origin main
```

- [ ] Repository pushed to GitHub
- [ ] Verify at https://github.com/YOUR_USERNAME/drawkaro

---

## Phase 2: Railway Backend Setup (10 minutes)

### Step 2.1: Create Railway Project
1. Go to https://railway.app
2. Click **Dashboard** (login if needed)
3. Click **+ New Project**
4. Select **Deploy from GitHub repo**
5. **Authorize GitHub** if needed
6. Select your **drawkaro** repository
7. Click **Deploy Now**

- [ ] Railway project created
- [ ] Deployment started

### Step 2.2: Configure Environment Variables
1. In Railway dashboard, click your project
2. Click **Variables** tab
3. Add these variables:

| Key | Value |
|-----|-------|
| `PORT` | `3000` |
| `NODE_ENV` | `production` |

```bash
# Or use Railway CLI
railway variable add PORT 3000
railway variable add NODE_ENV production
```

- [ ] Environment variables set

### Step 2.3: Wait for Deployment
1. Go to **Deployments** tab
2. Watch the build process (takes 2-3 minutes)
3. Status should show "✓ Success"
4. Look for the generated domain URL

Example URL: `https://drawkaro-abc123.up.railway.app`

- [ ] Deployment successful
- [ ] Copy your Railway domain URL

### Step 2.4: Get Backend URL
1. Click **Settings** tab
2. Copy the **Public URL** (or from the Deployments tab)
3. Save it for the next step

- [ ] Backend URL copied: `https://drawkaro-xxxx.up.railway.app`

---

## Phase 3: Frontend Configuration (5 minutes)

### Step 3.1: Update Environment Variables

Edit `.env.production`:

```bash
# Replace with your Railway URL
VITE_API_URL=https://drawkaro-abc123.up.railway.app
GEMINI_API_KEY=your_actual_gemini_api_key
```

- [ ] `.env.production` updated with correct Railway URL

### Step 3.2: Test Local Build
```bash
npm install
npm run build:frontend
```

- [ ] Build successful
- [ ] `dist/` folder created with compiled files

### Step 3.3: Commit Changes
```bash
git add .env.production
git commit -m "Add production environment configuration"
git push origin main
```

- [ ] Changes pushed to GitHub
- [ ] Verify at https://github.com/YOUR_USERNAME/drawkaro/blob/main/.env.production

---

## Phase 4: Enable GitHub Pages (5 minutes)

### Step 4.1: Configure GitHub Pages
1. Go to GitHub repo → **Settings** → **Pages**
2. Under **Build and deployment**:
   - **Source:** Select **GitHub Actions**
   - This uses the `.github/workflows/deploy.yml` workflow

- [ ] Source set to GitHub Actions

### Step 4.2: Monitor First Deployment
1. Go to your repo → **Actions** tab
2. Watch for the **"Deploy DrawKaro"** workflow
3. It should automatically trigger after push
4. Wait for build to complete (2-3 minutes)

- [ ] Workflow completed successfully
- [ ] Check for any errors in logs

### Step 4.3: Verify Deployment
1. Go to **Settings** → **Pages**
2. Look for the green checkmark: "Your site is published at..."
3. Click the provided URL to test

- [ ] GitHub Pages site is live
- [ ] Can access temporary GitHub Pages URL

---

## Phase 5: Custom Domain Setup (15 minutes)

### Step 5.1: Update DNS at Registrar

1. Log into your domain registrar (Namecheap, GoDaddy, etc.)
2. Find **DNS Management** or **Name Servers** section
3. Add these **A Records** (delete any existing A records for the root):

```
Type: A
Name: @
Value: 185.199.108.153

Type: A
Name: @
Value: 185.199.109.153

Type: A
Name: @
Value: 185.199.110.153

Type: A
Name: @
Value: 185.199.111.153
```

4. Add CNAME record for www:

```
Type: CNAME
Name: www
Value: YOUR_USERNAME.github.io
```

- [ ] A records added (all 4 IPs)
- [ ] CNAME record added for www

### Step 5.2: Configure GitHub Pages Custom Domain

1. Go to GitHub repo → **Settings** → **Pages**
2. Under **Custom domain**:
   - Enter: `drawkaro.io`
   - Click **Save**
3. GitHub will verify the domain
4. Check **Enforce HTTPS** (should auto-enable)

- [ ] Custom domain configured in GitHub Pages
- [ ] HTTPS enforcement enabled

### Step 5.3: Verify DNS Propagation

Wait 5-10 minutes, then test:

```bash
# In terminal/PowerShell
nslookup drawkaro.io

# Should show GitHub's IP addresses
```

Or use online tool: https://www.whatsmydns.net/?domain=drawkaro.io

- [ ] DNS records propagated
- [ ] Domain resolves to GitHub IPs

### Step 5.4: Test Custom Domain

1. Visit https://drawkaro.io in browser
2. Should load your site (HTTPS with padlock)
3. If not, wait another 5-10 minutes

- [ ] drawkaro.io loads successfully
- [ ] HTTPS certificate valid
- [ ] No SSL warnings

---

## Phase 6: WebSocket Connection Test (5 minutes)

### Step 6.1: Test Backend Connection

Open browser console at https://drawkaro.io and run:

```javascript
// Check if environment variable is set
console.log(import.meta.env.VITE_API_URL)

// Should output your Railway URL:
// https://drawkaro-abc123.up.railway.app
```

- [ ] API URL correctly set

### Step 6.2: Play a Test Game

1. Go to https://drawkaro.io
2. Enter your name
3. Click **Play**
4. Create or join a room
5. Check that:
   - WebSocket connects (watch browser network tab)
   - No red error messages
   - UI updates in real-time

- [ ] WebSocket connection successful
- [ ] Game lobby loads
- [ ] Can create/join rooms

---

## Phase 7: Verification (10 minutes)

### Step 7.1: Frontend Checklist
- [ ] https://drawkaro.io loads
- [ ] HTTPS working (padlock icon)
- [ ] Page title shows "DrawKaro — draw, guess, laugh"
- [ ] Can enter name and see avatar
- [ ] No console errors
- [ ] Logo animations visible

### Step 7.2: Backend Checklist
- [ ] Railway deployment shows "Success"
- [ ] Environment variables configured
- [ ] Logs show "DrawKaro server listening on..."
- [ ] WebSocket port listening (3000)

### Step 7.3: Functional Testing
- [ ] Can create room
- [ ] Can join room with multiple players
- [ ] Drawing canvas renders
- [ ] Chat works
- [ ] Player list updates
- [ ] Game settings configurable
- [ ] No crashes or error screens

### Step 7.4: GitHub Actions
- [ ] Deployment workflow exists at `.github/workflows/deploy.yml`
- [ ] Latest workflow shows "Success"
- [ ] Latest deployment has CNAME file
- [ ] GitHub Pages settings show custom domain

- [ ] All checks passed

---

## Post-Deployment (Ongoing)

### Monitor Performance
- Check Railway dashboard daily for errors
- Review GitHub Actions for failed builds
- Monitor browser console for runtime errors

### Setup Alerts (Optional)
- Railway: Enable email notifications
- GitHub: Watch repository for issues

### Future Updates
```bash
# To make updates and redeploy:
git add .
git commit -m "Description of changes"
git push origin main
# GitHub Actions automatically rebuilds and deploys
# Railway automatically redeploys
```

---

## Troubleshooting

### GitHub Pages Not Updating
- [ ] Clear browser cache: Ctrl+Shift+Del
- [ ] Check Actions tab for failed builds
- [ ] Wait 5 minutes for DNS cache expiration
- [ ] Check `.github/workflows/deploy.yml` exists

### WebSocket Connection Fails
- [ ] Verify Railway URL in `.env.production`
- [ ] Check Railway deployment status (green checkmark)
- [ ] Look at Railway logs for errors
- [ ] Test with: `curl https://your-railway-url`

### Domain Not Working
- [ ] Verify DNS records at registrar (not propagated yet?)
- [ ] Check with https://www.whatsmydns.net
- [ ] Allow 24-48 hours for full propagation
- [ ] Verify CNAME file in GitHub (should be auto-created)

### Build Errors
- [ ] Run locally: `npm install && npm run build:frontend`
- [ ] Check Node.js version: `node -v` (need 20+)
- [ ] View GitHub Actions logs for details
- [ ] Check for syntax errors in modified files

### HTTPS Certificate Not Working
- [ ] Go to GitHub Pages settings
- [ ] Re-save the custom domain
- [ ] Wait 10-30 minutes for cert generation
- [ ] GitHub sends email when ready

---

## Success Indicators

✅ **You're done when:**
1. https://drawkaro.io loads with HTTPS
2. Game UI displays correctly
3. Can create/join game rooms
4. WebSocket connects without errors
5. All player features work
6. Both GitHub Actions and Railway show successful deployments

---

## Support Resources

- **GitHub Pages Issues:** https://docs.github.com/en/pages
- **Railway Help:** https://docs.railway.app/
- **Domain Issues:** Contact your registrar
- **Project GitHub:** https://github.com/YOUR_USERNAME/drawkaro

---

## Quick Reference

| Component | URL | Status |
|-----------|-----|--------|
| Frontend | https://drawkaro.io | ✅ |
| Backend | https://drawkaro-xxx.up.railway.app | ✅ |
| GitHub Repo | https://github.com/YOUR_USERNAME/drawkaro | ✅ |
| GitHub Actions | Above repo → Actions tab | ✅ |
| Railway Dashboard | https://railway.app/dashboard | ✅ |

---

**Estimated Total Time: 45-60 minutes**
(Plus 24-48 hours for DNS propagation)

Enjoy your deployed DrawKaro game! 🎉
