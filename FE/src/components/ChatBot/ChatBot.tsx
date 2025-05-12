import { useState } from 'react';
import axios from 'axios';
import './ChatBot.scss';

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

const ChatBot = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { sender: 'user' as const, text: input }];
        setMessages(newMessages);
        setInput('');

        try {
            const res = await axios.post<{ response: string }>('http://localhost:8000/api/chatbox', {
                message: input,
            });
            setMessages([...newMessages, { sender: 'bot' as const, text: res.data.response }]);
        } catch (err) {
            setMessages([...newMessages, { sender: 'bot' as const, text: '⚠️ Lỗi server hoặc API.' }]);
        }
    };

    return (
        <div className="chatbox">
            <h2>Bạn có điều gì muốn hỏi chúng tôi ?</h2>
            <div className="chat-window">
                {messages.map((msg, i) => (
                    <div key={i} className={`message ${msg.sender}`}>
                        <span>
                            <b>{msg.sender === 'user' ? 'Bạn' : 'Bot'}:</b> {msg.text}
                        </span>
                    </div>
                ))}
            </div>
            <div className="input-area">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Nhập câu hỏi..."
                />
                <button onClick={handleSend}>Gửi</button>
            </div>
        </div>
    );
};

export default ChatBot;
