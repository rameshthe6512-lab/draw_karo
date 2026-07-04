#!/usr/bin/env node
/**
 * DrawKaro Server
 * WebSocket-based multiplayer backend for DrawKaro game.
 * Handles: room management, player join/leave, game state sync, drawing ops, chat, voice signaling.
 *
 * Usage: npm install ws && node drawkaro-server.js
 * Connect from client: ws://localhost:8080
 */
import { WebSocketServer } from 'ws';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  let filePath = req.url === '/' || req.url === '' ? '/drawkaro.html' : req.url;
  if (filePath === '/index.html') {
    filePath = '/drawkaro.html';
  }

  if (filePath === '/drawkaro.html') {
    fs.readFile(path.join(__dirname, 'drawkaro.html'), 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading drawkaro.html');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const wss = new WebSocketServer({ server });

// State
const rooms = new Map(); // roomCode -> {code, host, players, gameState, ...}
const clients = new Map(); // ws -> {playerId, roomCode, playerData}

console.log(`🎨 DrawKaro server listening on ws://localhost:${PORT}`);

wss.on('connection', (ws) => {
  const clientId = Math.random().toString(36).slice(2, 9);
  let joined = null; // { roomCode, playerId }

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data);
      handleMessage(ws, msg, clientId);
    } catch (err) {
      ws.send(JSON.stringify({ type: 'error', msg: 'Invalid message' }));
    }
  });

  ws.on('close', () => {
    const client = clients.get(ws);
    if (client) {
      const room = rooms.get(client.roomCode);
      if (room) {
        room.players = room.players.filter(p => p.id !== client.playerId);
        broadcast(room.code, { type: 'playerLeft', playerId: client.playerId });
        if (room.players.length === 0) {
          rooms.delete(room.code);
          console.log(`  room ${room.code} empty → deleted`);
        } else {
          console.log(`  ${client.playerId} left ${room.code} (${room.players.length} remain)`);
          if (room.host === client.playerId) {
            // Host disconnected! Migrate host role to the next player (index 0)
            room.host = room.players[0].id;
            console.log(`  ★ host migrated to ${room.host} in ${room.code}`);
            broadcast(room.code, { type: 'hostChanged', hostId: room.host });
          }
        }
      }
    }
    clients.delete(ws);
  });

  ws.on('error', (err) => {
    console.error('  ws error:', err.message);
  });
});

function handleMessage(ws, msg, clientId) {
  const type = msg.type;

  if (type === 'joinRoom') {
    joinRoom(ws, msg, clientId);
  } else if (type === 'startGame') {
    startGame(ws, msg);
  } else if (type === 'op') {
    const client = clients.get(ws);
    const playerId = client ? client.playerId : (msg.playerId || 'unknown');
    broadcast(msg.roomCode, { ...msg, playerId });
  } else if (type === 'chat') {
    broadcast(msg.roomCode, msg);
  } else if (type === 'startTurn') {
    broadcast(msg.roomCode, msg);
  } else if (type === 'surpriseTrigger') {
    broadcast(msg.roomCode, msg);
  } else if (type === 'surpriseSelection') {
    broadcast(msg.roomCode, msg);
  } else if (type === 'surpriseSkip') {
    broadcast(msg.roomCode, msg);
  } else if (type === 'drawerSelectedWord') {
    broadcast(msg.roomCode, msg);
  } else if (type === 'guess') {
    broadcast(msg.roomCode, msg);
  } else if (type === 'rtc') {
    // WebRTC signaling: offer/answer/ice - forward directly to target player
    const client = clients.get(ws);
    if (client) {
      msg.fromPlayerId = client.playerId;
      forwardToPlayer(msg.roomCode, msg.targetPlayerId, msg);
    }
  } else {
    ws.send(JSON.stringify({ type: 'error', msg: 'Unknown message type: ' + type }));
  }
}

function joinRoom(ws, msg, clientId) {
  const { roomCode, playerData } = msg;
  let room = rooms.get(roomCode);

  if (!room) {
    room = {
      code: roomCode,
      host: playerData.id,
      settings: { players: 5, lang: 'en', drawTime: 60, rounds: 3, wordCount: 3, hints: 2, mode: 'normal', customWords: [], customOnly: false },
      players: [],
      gameState: 'lobby',
      ops: [],
      messages: [],
    };
    rooms.set(roomCode, room);
    console.log(`✓ room created: ${roomCode} (host: ${playerData.name})`);
  }

  // Remove any existing player with the same ID (reconnection)
  room.players = room.players.filter(p => p.id !== playerData.id);

  if (room.players.length >= room.settings.players) {
    ws.send(JSON.stringify({ type: 'error', msg: 'Room is full' }));
    return;
  }

  // Ensure name is unique in this room
  let originalName = playerData.name || 'You';
  let uniqueName = originalName;
  let counter = 1;
  while (room.players.some(p => p.name.toLowerCase() === uniqueName.toLowerCase())) {
    uniqueName = `${originalName} (${counter})`;
    counter++;
  }
  playerData.name = uniqueName;

  // Add player to room
  const player = { ...playerData, joinedAt: Date.now() };
  room.players.push(player);
  clients.set(ws, { playerId: player.id, roomCode, playerData });

  console.log(`✓ ${playerData.name} joined ${roomCode} (${room.players.length}/${room.settings.players})`);

  // Send current room state to joiner
  ws.send(
    JSON.stringify({
      type: 'roomState',
      roomCode,
      host: room.host,
      players: room.players,
      settings: room.settings,
      gameState: room.gameState,
      ops: room.ops.slice(-100), // last 100 ops for replay
      messages: room.messages.slice(-50),
    })
  );

  // Broadcast join to others
  broadcast(roomCode, {
    type: 'playerJoined',
    player,
  });
}

function startGame(ws, msg) {
  const { roomCode, settings } = msg;
  const room = rooms.get(roomCode);
  if (!room) return;

  // Validate host
  const client = clients.get(ws);
  if (!client) return;

  // Only the host can start the game!
  if (room.host !== client.playerId) {
    ws.send(JSON.stringify({ type: 'error', msg: 'Only the host can start the game!' }));
    return;
  }

  if (room.players.length < 1) {
    ws.send(JSON.stringify({ type: 'error', msg: 'Need at least 1 player to start' }));
    return;
  }

  room.settings = settings || room.settings;
  room.gameState = 'playing';
  room.ops = [];
  room.messages = [];

  const order = room.players.map(p => p.id).sort(() => Math.random() - 0.5);

  console.log(`🎮 game started in ${roomCode} (${room.players.length} players) with order: ${order.join(', ')}`);

  broadcast(roomCode, {
    type: 'gameStarted',
    players: room.players,
    settings: room.settings,
    order: order,
  });
}

function broadcast(roomCode, msg) {
  const room = rooms.get(roomCode);
  if (!room) return;

  const payload = JSON.stringify(msg);
  for (const [ws, client] of clients) {
    if (client.roomCode === roomCode) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(payload);
      }
    }
  }

  // Persist ops and chat for late joiners
  if (msg.type === 'op') {
    room.ops.push(msg);
    if (room.ops.length > 500) room.ops.shift();
  } else if (msg.type === 'chat') {
    room.messages.push(msg);
    if (room.messages.length > 100) room.messages.shift();
  }
}

function forwardToPlayer(roomCode, targetPlayerId, msg) {
  for (const [ws, client] of clients) {
    if (client.roomCode === roomCode && client.playerId === targetPlayerId) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(msg));
      }
      break;
    }
  }
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n📡 DrawKaro multiplayer server running on host 0.0.0.0 and port ${PORT}`);
  console.log(`\n   Rooms auto-clean when empty. Ops & chat replay for latecomers.\n`);
});
