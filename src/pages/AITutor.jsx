import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

const AITutor = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your ARIS AI Tutor. Ask me any general or subject question!", isBot: true }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const userMsg = { id: Date.now(), text: userText, isBot: false };
    
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        // Fallback simulated logic if no API key is present
        setTimeout(() => {
          let reply = "That's an interesting question! For detailed explanations, consider consulting your textbook.\n\n*(Note: To unlock the real, smart AI, add `VITE_GEMINI_API_KEY=your_key` to a `.env` file in the root of the project!)*";
          const lowerText = userText.toLowerCase();
          
          if (lowerText.includes('math') || lowerText.includes('solve')) {
            reply = "For math problems, try breaking them into smaller steps. What specific formula are you struggling with? (Add API key for real math help!)";
          } else if (lowerText.includes('hello') || lowerText.includes('hi')) {
            reply = "Hi there! Ready to study?";
          }
          
          setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, isBot: true }]);
          setIsTyping(false);
        }, 1500);
        return;
      }

      // Real Gemini AI Call using REST API (no npm package required)
      const prompt = `You are ARIS, an intelligent, motivating, and helpful AI study tutor within a student productivity app. Keep your response concise, helpful, and directly address this student's query: "${userText}"`;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const responseText = result?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure how to answer that right now.";

      setMessages(prev => [...prev, { id: Date.now() + 1, text: responseText, isBot: true }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "Wait, I encountered a connection error. Please try again later.", isBot: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ background: 'var(--accent-primary)', padding: '0.5rem', borderRadius: '50%', boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)' }}>
          <Bot size={24} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>AI Tutor</h1>
          <p style={{ color: 'var(--success)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} className="pulse-glow"></span> Online
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
        {messages.map(msg => (
          <div key={msg.id} className="animate-slide-in" style={{
            display: 'flex', 
            justifyContent: msg.isBot ? 'flex-start' : 'flex-end',
            width: '100%'
          }}>
            <div style={{
              maxWidth: '85%',
              padding: '0.75rem 1rem',
              borderRadius: '16px',
              borderBottomLeftRadius: msg.isBot ? '4px' : '16px',
              borderBottomRightRadius: msg.isBot ? '16px' : '4px',
              background: msg.isBot ? 'var(--bg-elevated)' : 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              color: 'white',
              border: msg.isBot ? '1px solid var(--border-color)' : 'none',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{msg.text}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '16px',
              background: 'var(--bg-elevated)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-color)',
            }}>
              <p className="pulse-glow" style={{ fontSize: '0.9rem' }}>Thinking...</p>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <input 
          type="text" 
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Ask a question..."
          className="input-field"
          style={{ borderRadius: '999px', background: 'var(--bg-elevated)' }}
          disabled={isTyping}
        />
        <button type="submit" className="btn btn-primary btn-icon" disabled={!inputText.trim() || isTyping} style={{ borderRadius: '50%' }}>
          <Send size={20} />
        </button>
      </form>

    </div>
  );
};

export default AITutor;
