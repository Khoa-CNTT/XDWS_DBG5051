import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ChatBot.scss';

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

const ChatBot = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { sender: 'user' as const, text: input }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const res = await axios.post('http://localhost:8000/api/chatbox', {
                message: input,
            });
            setMessages([...newMessages, { sender: 'bot' as const, text: res.data.response }]);
        } catch (err) {
            setMessages([...newMessages, { sender: 'bot' as const, text: 'Chúng tôi đang bận, vui lòng thử lại sau.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chatbox">
            <h2>Chúng tôi có thể giúp gì cho bạn ?</h2>
            <div className="chat-window">
                {messages.map((msg, i) => (
                    <div key={i} className={`message ${msg.sender}`}>
                        <div className="message-content">
                            <b>{msg.sender === 'user' ? 'Bạn' : 'Nhà hàng'}:</b> {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="message bot">
                        <div className="message-content loading">
                            <div className="loading-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="input-area">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Nhập câu hỏi..."
                    disabled={isLoading}
                />
                <button onClick={handleSend} disabled={isLoading}>
                    Gửi
                </button>
            </div>
        </div>
    );
};

export default ChatBot;
