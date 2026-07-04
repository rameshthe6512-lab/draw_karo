# DrawKaro Deployment Visual Guide

## Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         YOUR USERS                                      │
└────────────┬────────────────────────────────────────────────────────────┘
             │
             │ Browser: https://drawkaro.io
             │
┌────────────▼────────────────────────────────────────────────────────────┐
│                      GITHUB PAGES (GitHub)                              │
│                                                                         │
│  ┌──────────────────────────────────────┐                             │
│  │  Frontend Application                │                             │
│  │  ────────────────────────────────    │                             │
│  │  • React + TypeScript                │                             │
│  │  • Tailwind CSS Styling              │                             │
│  │  • Responsive UI                     │                             │
│  │  • Drawing Canvas                    │                             │
│  │  • Chat Interface                    │                             │
│  │  • Player Management                 │                             │
│  │  • Score Tracking                    │                             │
│  └──────────────────────────────────┬───┘                             │
│                                     │                                  │
│     ┌─────────────────────────────────────────────┐                  │
│     │ dist/ folder (compiled & optimized)         │                  │
│     └─────────────────────────────────────────────┘                  │
│                                                                         │
│  ✅ HTTPS Enforced                                                     │
│  ✅ Custom Domain: drawkaro.io                                         │
│  ✅ Auto-rebuild on push                                              │
│  ✅ Zero downtime deployment                                          │
└────────────┬────────────────────────────────────────────────────────────┘
             │
             │ WebSocket Connection
             │ wss://drawkaro-api.railway.app
             │
┌────────────▼────────────────────────────────────────────────────────────┐
│                    RAILWAY.APP (Backend)                                │
│                                                                         │
│  ┌──────────────────────────────────────┐                             │
│  │  Node.js WebSocket Server            │                             │
│  │  ────────────────────────────────    │                             │
│  │  • Express HTTP Server               │                             │
│  │  • WebSocket (ws) Library            │                             │
│  │  • Room Management                   │                             │
│  │  • Player State Sync                 │                             │
│  │  • Drawing Op Broadcasting           │                             │
│  │  • Chat Message Relay                │                             │
│  │  • Real-time Game State              │                             │
│  └──────────────────────────────────┬───┘                             │
│                                     │                                  │
│     • Port: 3000                    │                                  │
│     • Uptime: 99.9%                 │                                  │
│     • Auto-scaling: Enabled         │                                  │
│     • Public URL: drawkaro-xxx.up.railway.app                         │
│                                                                         │
└────────┬────────────────────────────────────────────────────────┬──────┘
         │                                                        │
         │ Environment Variables                                 │
         │ • GEMINI_API_KEY                                      │
         │ • NODE_ENV=production                                 │
         │ • PORT=3000                                           │
         │                                                        │
         │                                   External API Call   │
         │                                   (Gemini AI)         │
         │                                        │              │
         └────────────────────────────────────────┼──────────────┘
                                                  │
                                    ┌─────────────▼─────────────┐
                                    │  Google Gemini API        │
                                    │  AI Services              │
                                    └───────────────────────────┘
```

## Deployment Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│ Step 1: Git Repository Setup                                         │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Your Computer                         GitHub                        │
│  ─────────────                         ──────                        │
│                                                                      │
│  git init                                                            │
│  git add .                                                           │
│  git commit                                                          │
│  git remote add origin [URL]                                         │
│         ↓                                                            │
│  git push origin main  ──────────────────→  drawkaro repo            │
│                                                                      │
│  ✅ Your code is now on GitHub                                       │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

```
┌──────────────────────────────────────────────────────────────────────┐
│ Step 2: Enable GitHub Pages (Frontend Auto-Deploy)                   │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1. Go to Settings → Pages                                          │
│  2. Select "GitHub Actions" as source                               │
│  3. Workflow auto-detects and runs                                  │
│                                                                      │
│     GitHub Actions Workflow (.github/workflows/deploy.yml)          │
│     ────────────────────────────────────────────────                │
│     1. npm install                                                  │
│     2. npm run build:frontend  →  dist/ folder                      │
│     3. Push dist/ to gh-pages branch                                │
│     4. GitHub Pages serves at drawkaro.io                           │
│                                                                      │
│  ✅ Frontend deployed to drawkaro.io                                 │
│  ✅ HTTPS auto-configured                                            │
│  ✅ Auto-rebuild on every push                                       │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

```
┌──────────────────────────────────────────────────────────────────────┐
│ Step 3: Deploy Backend to Railway                                    │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Railway.app Dashboard                                              │
│  ──────────────────────                                             │
│                                                                      │
│  1. New Project → GitHub Repo                                       │
│  2. Railway detects Procfile & package.json                         │
│  3. Builds Docker image (auto)                                      │
│     - npm install                                                   │
│     - Runs: node drawkaro-server.js                                 │
│  4. Starts WebSocket server on PORT 3000                            │
│  5. Assigns public domain                                           │
│                                                                      │
│     https://drawkaro-abc123.up.railway.app  ← Your backend URL      │
│                                                                      │
│  6. Environment Variables:                                          │
│     - GEMINI_API_KEY = [your-key]                                   │
│     - NODE_ENV = production                                         │
│     - PORT = 3000                                                   │
│                                                                      │
│  ✅ Backend deployed and running                                     │
│  ✅ WebSocket server listening                                       │
│  ✅ Auto-starts on push to main                                      │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

```
┌──────────────────────────────────────────────────────────────────────┐
│ Step 4: Connect Frontend to Backend                                  │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  .env.production File                                               │
│  ──────────────────                                                 │
│                                                                      │
│  VITE_API_URL=https://drawkaro-abc123.up.railway.app                │
│                                                                      │
│  During build:                                                      │
│  npm run build:frontend  →  Vite reads .env.production              │
│                         →  Sets API URL in app                      │
│                         →  Compiles to dist/                        │
│                                                                      │
│  At Runtime (Browser):                                              │
│  When user joins game  →  Frontend initiates WebSocket              │
│                       →  Connects to Railway backend                │
│                       →  Real-time sync begins                      │
│                                                                      │
│  ✅ Frontend and backend are connected                               │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

```
┌──────────────────────────────────────────────────────────────────────┐
│ Step 5: Setup Custom Domain (drawkaro.io)                            │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Domain Registrar                       GitHub Pages                │
│  ────────────────                       ──────────────              │
│                                                                      │
│  Update DNS Records:                                                │
│  ─────────────────────                                              │
│                                                                      │
│  A Records (4 of them):                                             │
│  ┌───────────────────────────────────┐                              │
│  │ 185.199.108.153                   │                              │
│  │ 185.199.109.153                   │  ──→  GitHub Pages IPs       │
│  │ 185.199.110.153                   │                              │
│  │ 185.199.111.153                   │                              │
│  └───────────────────────────────────┘                              │
│                                                                      │
│  CNAME Record (for www):                                            │
│  ┌───────────────────────────────────┐                              │
│  │ your-username.github.io           │  ──→  Your GitHub Pages      │
│  └───────────────────────────────────┘                              │
│                                                                      │
│  GitHub Settings:                                                   │
│  ─────────────────                                                  │
│  Settings → Pages → Custom domain → drawkaro.io                     │
│                                                                      │
│  ✅ HTTPS certificate auto-installed                                 │
│  ✅ Domain propagates (24-48 hours)                                  │
│  ✅ drawkaro.io now resolves to your site                            │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

## Game Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DRAWKARO GAME FLOW                               │
└─────────────────────────────────────────────────────────────────────┘

Player 1                      Server                    Player 2
────────                      ──────                    ────────

Visit drawkaro.io
     │
     ├─→ Load React App
     │
     ├─→ Enter Name + Avatar
     │
     ├─ Click "PLAY"
     │
     ├─→ Send: joinRoom ──────→ Create Room
     │   {roomCode, playerData}  {Add Player 1}
     │
     │ ←──────────────────────── roomState
     │ {players, settings, gameState}
     │
Browser                                              Browser
Shows                                               Visit drawkaro.io
Lobby UI                                            Enter Name
     │                                                   │
     │                                                   │
     │                                 ← roomState ──────→ Load Lobby
     │                                                   │
     │                                    ┌──────────────┤
     │                                    │              │
     │ Send: startGame ─────────────→ Set order       [Waiting]
     │ (Only host can do this)      Broadcast:
     │                               gameStarted
     │                              {order: [p1, p2]}
     │
     │ ←─────────────────────────────────────────────── gameStarted
     │
     │ Receive: [p1 turn]
     │
     ├─→ Show Drawing Canvas
     │
     │ Draw something
     │
     ├─→ Send: op ─────────────→ Broadcast: op
     │ {action, coords, color}  {to room players}
     │
     │
Show Drawing                      ←──────── op ──────── p2 receives
in real-time                                           Sees drawing
                                                       in real-time
     │                                                   │
     │  p2 Guesses                                      │ Send: guess
     │  ←──────────────────────────────────────────────  {text}
     │
     │ ←───────────────────────── guess ──────────────
     │   {correct: true, player: p2}
     │
     │ Both see: "P2 guessed correctly!"
     │ Score updates
     │
     │ Timer runs out or everyone guesses
     │ Next round begins with p2 drawing
     │
     └─────→ Game continues...
```

## Deployment Timeline

```
Time                Action                      Status
────────────────────────────────────────────────────────

0 min          ┌─────────────────────────────────┐
               │ 1. Setup Git Repository         │ ⏳ 5 min
               │    - git init                   │
               │    - Push to GitHub             │
               └─────────────────────────────────┘

5 min          ┌─────────────────────────────────┐
               │ 2. Deploy Backend (Railway)     │ ⏳ 10 min
               │    - Create Railway project     │
               │    - Add env variables          │
               │    - Auto-build and deploy      │
               └─────────────────────────────────┘

15 min         ┌─────────────────────────────────┐
               │ 3. Update Frontend Config       │ ⏳ 2 min
               │    - Update .env.production     │
               │    - Commit and push            │
               └─────────────────────────────────┘

17 min         ┌─────────────────────────────────┐
               │ 4. Enable GitHub Pages          │ ⏳ 2 min
               │    - Set source to Actions      │
               │    - Actions auto-deploy        │
               └─────────────────────────────────┘

19 min         ┌─────────────────────────────────┐
               │ 5. Setup Domain DNS             │ ⏳ 15 min
               │    - Update registrar           │
               │    - Add A & CNAME records      │
               │    - Configure GitHub Pages     │
               └─────────────────────────────────┘

34 min         ┌─────────────────────────────────┐
               │ 6. Testing & Verification       │ ⏳ 10 min
               │    - Test drawkaro.io           │
               │    - Join game                  │
               │    - Check WebSocket            │
               └─────────────────────────────────┘

45 min         ┌─────────────────────────────────┐
               │ ✅ DEPLOYMENT COMPLETE!         │ 🎉
               │ 🌐 Site is live!                │
               └─────────────────────────────────┘

45+ min        ┌─────────────────────────────────┐
to             │ ⏱️  DNS Propagation              │ 📡 24-48 hrs
48 hrs         │ (Global DNS servers updating)  │
               └─────────────────────────────────┘
```

## Directory Structure Diagram

```
drawkaro/
│
├── 📂 .github/
│   └── 📂 workflows/
│       └── 📄 deploy.yml ........................ CI/CD Pipeline
│
├── 📂 src/
│   ├── 📄 App.tsx ............................... React root component
│   ├── 📄 main.tsx ............................. Entry point
│   └── 📄 index.css ............................ Global styles
│
├── 📄 drawkaro-server.js ...................... WebSocket backend
├── 📄 drawkaro.html ........................... Game HTML
├── 📄 index.html .............................. Vite entry
│
├── 📄 vite.config.ts .......................... Build config
├── 📄 tsconfig.json ........................... TypeScript config
├── 📄 package.json ............................ Dependencies
├── 📄 package-lock.json ....................... Lock file
│
├── 📄 railway.json ............................ Railway config
├── 📄 vercel.json ............................. Vercel config
├── 📄 Dockerfile .............................. Container
├── 📄 Procfile ................................ Start command
│
├── 📄 .env.example ............................ Env template
├── 📄 .env.production ......................... Prod vars
├── 📄 .gitignore .............................. Git rules
│
├── 📖 README.md ............................... Main doc
├── 📖 QUICK_START.md .......................... 5-min guide
├── 📖 DEPLOYMENT_CHECKLIST.md ................ Step-by-step
├── 📖 DEPLOYMENT.md ........................... Full guide
├── 📖 DOMAIN_SETUP.md ......................... Domain config
├── 📖 ARCHITECTURE.md ......................... Tech details
├── 📖 DEPLOYMENT_SUMMARY.md .................. Overview
└── 📖 VISUAL_GUIDE.md ......................... This file

Build Output:
dist/
├── index.html
├── assets/
│   ├── js/ (compiled React)
│   └── css/ (compiled styles)
└── ...
```

## Technology Stack Visualization

```
┌──────────────────────────────────────────────────────────────────┐
│                      DRAWKARO TECH STACK                        │
└──────────────────────────────────────────────────────────────────┘

FRONTEND LAYER
───────────────
┌─────────────────────────────────────────────────────────────┐
│  React 19                TypeScript 5.8                     │
│  ┌──────────────────┐    ┌──────────────────┐              │
│  │ Component System │ + │ Type Safety      │              │
│  └──────────────────┘    └──────────────────┘              │
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────┐       │
│  │ Tailwind CSS         │  │ Lucide Icons        │       │
│  │ Responsive Styling   │  │ Motion Animations   │       │
│  └──────────────────────┘  └──────────────────────┘       │
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │ WebSocket Client (Native Browser API)           │     │
│  │ Real-time communication with backend            │     │
│  └──────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                           ↓ Vite Build
                    (Frontend compiled to dist/)
                           ↓
                   GitHub Pages Deployment

BACKEND LAYER
──────────────
┌─────────────────────────────────────────────────────────────┐
│  Node.js 20 LTS                                             │
│  ┌──────────────────┐    ┌──────────────────┐              │
│  │ Express Server   │ +  │ WebSocket (ws)   │              │
│  │ HTTP Handler     │    │ Real-time        │              │
│  └──────────────────┘    └──────────────────┘              │
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │ Room & Game State Management                    │     │
│  │ Broadcasting & Message Relay                    │     │
│  │ Player Connection Handling                      │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │ Environment Configuration (dotenv)              │     │
│  │ GEMINI_API_KEY, NODE_ENV, PORT                 │     │
│  └──────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                    ↓ Railway Deployment
              (Backend running on Railway.app)

DEPLOYMENT LAYER
────────────────
┌─────────────────────────────────────────────────────────────┐
│  GitHub Pages                Railway.app                    │
│  ┌────────────────────┐    ┌──────────────────────┐        │
│  │ Frontend Hosting   │    │ Backend Hosting      │        │
│  │ HTTPS Enforced     │    │ WebSocket Support    │        │
│  │ Custom Domain      │    │ Auto-scaling         │        │
│  │ Auto-rebuild       │    │ Environment Variables│        │
│  │ (GitHub Actions)   │    │ Logs & Monitoring    │        │
│  └────────────────────┘    └──────────────────────┘        │
│              ↓                     ↓                        │
│      drawkaro.io            api.railway.app               │
│      (HTTPS)                (WebSocket)                    │
└─────────────────────────────────────────────────────────────┘
```

## Traffic Flow

```
🌍 User Browser (drawkaro.io)
        │
        │ ① HTTP GET
        ▼
📦 GitHub Pages CDN
        │
        │ ② Serve dist/ files
        │ (index.html, CSS, JS)
        ▼
🖥️  User's Browser Loads
   React App
        │
        │ ③ User joins game
        │   Enters name
        ▼
        │
        │ ④ Click "PLAY"
        ▼
⚡ WebSocket Connect
 (wss://drawkaro-api.railway.app)
        │
        ▼
📡 Railway.app Backend
        │
        │ ⑤ WebSocket Established
        ├─ Room Creation
        ├─ Player Management
        ├─ Broadcasting Ops
        └─ Chat Relay
        │
        ▼
🔙 Back to Browser
   ├─ Real-time updates
   ├─ Drawing synchronization
   ├─ Game state updates
   └─ Chat messages
```

---

**Total Setup Time: ~45 minutes of active work**
**DNS Propagation: 24-48 hours (automatic)**
**Result: Fully deployed multiplayer game at drawkaro.io** ✅

