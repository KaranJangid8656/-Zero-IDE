import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { WebSocketServer } from "ws";
import * as Y from "yjs";
const utils = require("y-websocket/bin/utils");

import connectDB from "./config/db";
import apiRoutes from "./routes/api";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", apiRoutes);

const server = http.createServer(app);

// Socket.IO for Live Chat & active users
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a specific project room
    socket.on("join-project", (projectId: string, username: string) => {
        socket.join(projectId);
        // broadcast to project room
        socket.to(projectId).emit("user-joined", { username, id: socket.id });
        console.log(`${username} joined project ${projectId}`);
    });

    // Handle chat messages
    socket.on("send-message", ({ projectId, message, username }) => {
        // broadcast back to everyone in room including sender? Or just others based on frontend pref
        // we use io.to() to broadcast to everyone
        io.to(projectId).emit("receive-message", {
            message,
            username,
            timestamp: new Date().toISOString()
        });
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Yjs WebSocket Server for Real-Time Collaboration
const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (conn, req) => {
    utils.setupWSConnection(conn, req);
});

// Upgrade HTTP to WS for Yjs
server.on("upgrade", (request, socket, head) => {
    const url = new URL(request.url || "", `http://${request.headers.host}`);
    if (url.pathname.startsWith("/yjs")) {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit("connection", ws, request);
        });
    } else {
        // Let Socket.IO handle other upgrades (Socket.IO v4 handles upgrades internally if path matches /socket.io/)
    }
});

const PORT = process.env.PORT || 8080;
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
