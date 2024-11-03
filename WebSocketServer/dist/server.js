"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = __importStar(require("ws"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// HTTP server setup
const server = http_1.default.createServer(app);
// WebSocket server setup
const wss = new ws_1.WebSocketServer({ server });
const rooms = {}; // Room name -> Array of client IDs
//Broadcast function
const broadcastall = (data) => {
    wss.clients.forEach(client => {
        if (client.readyState === ws_1.default.OPEN) {
            client.send(data);
        }
    });
};
const broadcastroom = (data, room) => {
    room.forEach(client => {
        if (client.readyState === ws_1.default.OPEN) {
            client.send(data);
        }
    });
};
// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('New client connected');
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log(`Received message from client: `, data);
        if (data.request === "room") {
            if (ws.room) // checking if it's already have a room
             {
                rooms[ws.room].filter(e => e != ws); //removing the ws from the room it's already in
            }
            ws.room = data.room;
            if (!rooms[data.room]) {
                rooms[data.room] = [];
            }
            if (!(rooms[data.room].find((webs) => webs == ws)))
                rooms[data.room].push(ws);
        }
        if (data.request === "message") {
            if (rooms[data.room]) {
                data.success = true;
                broadcastroom(JSON.stringify(data), rooms[data.room]);
            }
            else // if there are no clients in that room
                ws.send(JSON.stringify({ success: false }));
        }
    });
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
// API Route for testing
app.get('/', (req, res) => {
    res.send('WebSocket server is running');
});
// Start server
server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map