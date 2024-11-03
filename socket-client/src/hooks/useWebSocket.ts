// src/hooks/useWebSocket.ts
import { useEffect, useState } from 'react';
import SocketDTO from '../interfaces/socketDTO';

const useWebSocket = (url: string) => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<SocketDTO[]>([]);

    useEffect(() => {
        const socket = new WebSocket(url);
        setWs(socket);

        socket.onopen = () => console.log('Connected to WebSocket server');
        socket.onmessage = (event) => {
            const data :SocketDTO=JSON.parse(event.data)
            console.log('Received message:', event.data);
            if(data.success == false){alert("Something went wrong");return ; } 
            
            setMessages((prev) => [...prev,data]);
        };
        socket.onclose = () => console.log('Disconnected from WebSocket server');

        return () => {
            socket.close();
        };
    }, [url]);

    const sendMessage = (message: SocketDTO) => {
        ws?.send(JSON.stringify(message));
    };

    return { messages, sendMessage ,setMessages};
};

export default useWebSocket;
