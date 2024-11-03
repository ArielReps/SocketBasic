import React, { useState } from 'react';
import useWebSocket from './hooks/useWebSocket';
import SocketDTO from './interfaces/socketDTO';

const App: React.FC = () => {
  const { messages, sendMessage,setMessages } = useWebSocket('ws://localhost:3000');
  const [input, setInput] = useState('');
  const [room, setRoom] = useState('');
  const [currentRoom, setCurrentRoom] = useState('');
  const [name, setName] = useState('');

  const handleSendMessage = () => {
    const date = new Date();
    const timeString = date.toTimeString().split(' ')[0].slice(0, 5); 
    const message: SocketDTO = { name, room, message: input, date: timeString, request: "message" };
    sendMessage(message);
    setInput('');
  };

  const handleSetRoom = () => {
    const message: SocketDTO = { name, room, message: input, date: '', request: "room" };
    sendMessage(message);
    setCurrentRoom(room);
    setMessages([]);
    
  };

  return (
    <div className="chat-container">
      <div className="header">
        <span>Chat Room: {currentRoom || 'None'}</span>
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Enter room"
          style={{ marginLeft: '1rem' }}
        />
        <button onClick={handleSetRoom}>Join Room</button>
      </div>

      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <div>
              <span className="sender">{msg.name}</span>
              <span className="time">at {msg.date}</span>
            </div>
            <div className="content">{msg.message}</div>
          </div>
        ))}
      </div>

      <div className="footer">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
        />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default App;
