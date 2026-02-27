import express from "express";
import { createServer as createViteServer } from "vite";
import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";

interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

let leaderboard: LeaderboardEntry[] = [];

async function startServer() {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/leaderboard", (req, res) => {
    res.json(leaderboard);
  });

  app.post("/api/leaderboard", (req, res) => {
    const entry: LeaderboardEntry = req.body;
    if (entry && entry.name && typeof entry.score === 'number') {
      leaderboard.push(entry);
      leaderboard.sort((a, b) => b.score - a.score);
      leaderboard = leaderboard.slice(0, 50); // Keep top 50
      broadcastLeaderboard();
      res.status(201).json({ status: "ok" });
    } else {
      res.status(400).json({ error: "Invalid entry" });
    }
  });

  function broadcastLeaderboard() {
    const data = JSON.stringify({ type: 'leaderboard', data: leaderboard });
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  wss.on("connection", (ws) => {
    console.log("Client connected to leaderboard");
    ws.send(JSON.stringify({ type: 'leaderboard', data: leaderboard }));
  });

  // Broadcast every 30 seconds as requested
  setInterval(() => {
    broadcastLeaderboard();
  }, 30000);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
