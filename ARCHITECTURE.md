# DrawKaro Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         drawkaro.io                             │
│                    (GitHub Pages Frontend)                      │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────┐  │
│  │   React App      │  │  Tailwind CSS    │  │  WebSocket  │  │
│  │   TypeScript     │  │  Lucide Icons    │  │  Client     │  │
│  │   Vite Build     │  │  Motion Animate  │  │  Library    │  │
│  └──────────────────┘  └──────────────────┘  └─────────────┘  │
└────────────────┬───────────────────────────────────────────────┘
                 │
                 │ WebSocket Connection
                 │ (Auto-reconnect enabled)
                 │
┌────────────────▼───────────────────────────────────────────────┐
│           Railway.app Backend                                   │
│        (drawkaro-api.railway.app)                              │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────┐  │
│  │  Node.js Server  │  │  WebSocket       │  │  Room       │  │
│  │  (Express)       │  │  Server (ws)     │  │  Manager    │  │
│  │  Port 3000       │  │  Multiplayer     │  │  (State)    │  │
│  └──────────────────┘  └──────────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                 ↑
                 │ (External API)
                 │ GEMINI_API_KEY
                 │
        ┌────────▼─────────┐
        │  Google Gemini   │
        │  AI API          │
        └──────────────────┘
```

## Deployment Architecture

```
GitHub Repository
    ↓
    ├─→ GitHub Actions Workflow
    │   ├─→ Build Frontend (npm run build:frontend)
    │   ├─→ Generate CNAME file
    │   └─→ Deploy to GitHub Pages
    │
    └─→ Railway Connection (via GitHub integration)
        └─→ Detect changes in main branch
            ├─→ Build Docker image (or Nixpacks)
            ├─→ Start Node.js server
            └─→ WebSocket server running
```

## Directory Structure

```
drawkaro/
├── src/
│   ├── main.tsx           # React entry point
│   ├── App.tsx            # Main React component
│   └── index.css          # Tailwind styles
│
├── .github/
│   └── workflows/
│       └── deploy.yml     # CI/CD pipeline
│
├── drawkaro-server.js     # WebSocket backend server
├── drawkaro.html          # Standalone HTML version
├── index.html             # Vite entry point
│
├── package.json           # Dependencies & scripts
├── vite.config.ts         # Vite build config
├── tsconfig.json          # TypeScript config
│
├── railway.json           # Railway deployment config
├── vercel.json           # Vercel deployment config
├── Dockerfile             # Container config
├── Procfile              # Railway startup command
│
├── .env.example          # Environment template
├── .env.production       # Production environment
│
├── DEPLOYMENT.md         # Detailed deployment guide
├── QUICK_START.md        # 5-minute quickstart
├── DOMAIN_SETUP.md       # Domain configuration
└── ARCHITECTURE.md       # This file
```

## Component Architecture

### Frontend (React)

```
App.tsx (Root)
├── Lobby Screen
│   ├── Player Avatar Selector
│   ├── Name Input
│   ├── Game Settings
│   │   ├── Player Count
│   │   ├── Draw Time
│   │   ├── Rounds
│   │   └── Language/Words
│   └── Room Join/Create
│
├── Game Screen
│   ├── Canvas (Drawing Area)
│   ├── Chat Panel
│   ├── Player List
│   ├── Score Board
│   ├── Timer Display
│   └── Word Selection (for Drawer)
│
└── WebSocket Manager
    ├── Connection Handler
    ├── Message Router
    ├── Room State Sync
    └── Auto-reconnect Logic
```

### Backend (Node.js)

```
drawkaro-server.js
├── HTTP Server (Express-style)
│   ├── Serve static assets (fallback)
│   └── Health check endpoint
│
├── WebSocket Server
│   ├── Connection Manager
│   ├── Message Handler
│   │   ├── joinRoom
│   │   ├── startGame
│   │   ├── op (drawing operations)
│   │   ├── chat
│   │   ├── guess
│   │   └── rtc (WebRTC signaling)
│   │
│   ├── Room Manager
│   │   ├── Create room
│   │   ├── Join player
│   │   ├── Remove player
│   │   ├── Host migration
│   │   └── Auto-cleanup
│   │
│   └── Broadcast System
│       ├── Broadcast to room
│       ├── Forward to specific player
│       └── Message persistence (for latecomers)
│
└── State Storage
    ├── rooms Map
    │   └── roomCode → {code, host, players, gameState, ops, messages}
    └── clients Map
        └── ws → {playerId, roomCode, playerData}
```

## Data Flow

### Game Flow

```
Player 1 (Lobby)
    ↓
Click Play Button
    ↓
Send: joinRoom message
    ↓
Server: Create/Join room
    ↓
Broadcast: playerJoined to all
    ↓
Players (Game Lobby)
    ↓
Host starts game
    ↓
Send: startGame message
    ↓
Server: Set order, gameState='playing'
    ↓
Broadcast: gameStarted with player order
    ↓
Players (Canvas/Drawing)
    ↓
Drawer draws
    ↓
Send: op messages (drawing operations)
    ↓
Server: Broadcast ops to room
    ↓
Players: Render drawing in real-time
    ↓
Guesser guesses
    ↓
Send: guess message
    ↓
Server: Validate and broadcast
    ↓
Round ends → Next player
```

### Message Types

| Type | Direction | Purpose |
|------|-----------|---------|
| `joinRoom` | Client → Server | Join game room |
| `roomState` | Server → Client | Send current room state |
| `playerJoined` | Server → Client | Notify new player |
| `playerLeft` | Server → Client | Notify player left |
| `startGame` | Client → Server | Begin game |
| `gameStarted` | Server → Client | Game started, send order |
| `op` | Client → Client | Drawing operation (via server) |
| `chat` | Client → Client | Chat message |
| `guess` | Client → Client | Guess/Answer |
| `rtc` | Client → Client | WebRTC signaling |

## Environment Variables

```
FRONTEND (.env.production)
├── VITE_API_URL          # WebSocket server URL
└── GEMINI_API_KEY        # AI API key

BACKEND (Railway)
├── PORT                  # Server port (default: 3000)
├── GEMINI_API_KEY        # AI API key
└── NODE_ENV              # Environment (production)
```

## Deployment Sequence

```
1. Push to main branch
   ↓
2. GitHub Actions triggered
   ↓
3. Install dependencies (npm ci)
   ↓
4. Build frontend (vite build → dist/)
   ↓
5a. Deploy to GitHub Pages
    ├── Generate CNAME file
    ├── Upload dist/ to gh-pages branch
    └── Serve at drawkaro.io (HTTPS)
   
5b. Railway auto-detects new push
    ├── Build Docker image (or Nixpacks)
    ├── Run tests (if any)
    ├── Start drawkaro-server.js
    └── Server running at railway.app domain
```

## Technology Stack

### Frontend
- **React 19** - UI framework
- **TypeScript 5.8** - Type safety
- **Vite 6.2** - Fast build tool
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons
- **Motion** - Animations
- **WebSocket API** - Real-time communication

### Backend
- **Node.js 20** - Runtime
- **Express** - HTTP server
- **ws** - WebSocket library
- **dotenv** - Environment configuration

### Deployment
- **GitHub Pages** - Frontend hosting
- **Railway.app** - Backend hosting
- **GitHub Actions** - CI/CD pipeline
- **Docker/Nixpacks** - Containerization (Railway)

## Performance Considerations

### Frontend
- Code splitting via Vite
- CSS minification with Tailwind
- Image optimization (SVG icons)
- WebSocket compression
- Automatic reconnection

### Backend
- Event-driven architecture (WebSocket)
- Memory-efficient room management
- Operation persistence (last 500 ops)
- Message history for latecomers (last 50 messages)
- Automatic room cleanup on empty

## Security Considerations

- HTTPS enforced on GitHub Pages
- WebSocket over secure connection
- Input validation on server
- CORS configured for domain
- Environment variables for secrets
- No authentication (for game simplicity)

## Scalability

### Current Limits
- Rooms: Unlimited (memory-based)
- Players per room: Configurable (default: 5)
- Concurrent connections: ~1000+ per Railway Hobby plan
- Message history: 100 chat + 500 ops per room

### Future Improvements
- Database for persistence (MongoDB)
- Redis for scaling (multiple servers)
- Load balancing
- CDN for static assets
- Rate limiting
- User authentication

## Monitoring

### GitHub Pages
- Actions tab: Build status
- Pages settings: Deployment history
- Custom domain: SSL status

### Railway
- Deployments tab: Build logs
- Monitoring: CPU, memory, network
- Logs: Real-time server output
- Alerts: Email notifications

## Disaster Recovery

### Data Loss Prevention
- WebSocket auto-reconnect
- Message persistence per room
- Late-joiner support
- No persistent data needed (stateless)

### Rollback Procedure
```bash
# Revert to previous commit
git revert HEAD
git push

# GitHub Actions automatically redeploys
# Railway detects change and rebuilds
```

## References

- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Railway Docs](https://docs.railway.app/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Vite Guide](https://vitejs.dev/)
- [React Docs](https://react.dev/)
