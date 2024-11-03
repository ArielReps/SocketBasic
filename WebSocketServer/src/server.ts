// server.ts
import express, { Request, Response } from 'express';
import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import SocketDTO from './interfaces/socketDTO';

const app = express();
const PORT = process.env.PORT || 3000;

// HTTP server setup
const server = http.createServer(app);

// WebSocket server setup
const wss = new WebSocketServer({ server });

const rooms: { [key: string]: WebSocket[] } = {}; // Room name -> Array of client IDs
interface WebSocketWithRoom extends WebSocket {
    room?: string; // Optional property to store room information
}


//Broadcast function
const broadcastall = (data: string) => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  };
const broadcastroom = (data:string, room:WebSocketWithRoom[]) =>{
    room.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
}


// WebSocket connection handler
wss.on('connection', (ws: WebSocketWithRoom) => {
    console.log('New client connected');

    ws.on('message', (message: string) => {
        const data:SocketDTO = JSON.parse(message);
        console.log(`Received message from client: `,data);
        
        if(data.request === "room")
        {
            if(ws.room)// checking if it's already have a room
            {
                rooms[ws.room].filter(e=>e != ws); //removing the ws from the room it's already in
            }
            ws.room = data.room;

            if (!rooms[data.room]) {
                rooms[data.room] = [];
            }
            if(!(rooms[data.room].find((webs: WebSocket) => webs ==ws)))
            rooms[data.room].push(ws);


          
        }
        if(data.request === "message")
        {
            if(rooms[data.room])
           { 
            data.success=true;
            broadcastroom(JSON.stringify(data),rooms[data.room])
            }
            else // if there are no clients in that room
            ws.send(JSON.stringify({success:false}))
        }

        
        
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// API Route for testing
app.get('/', (req: Request, res: Response) => {
    res.send('WebSocket server is running');
});

// Start server
server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
