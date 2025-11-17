import React, { useState, useEffect, useRef } from "react";
import "../../../css/Bedtimestory.css";

// ---------------- Welcome Message ----------------
function WelcomeMessage() {
  return (
    <div className="welcome-message">
      <div className="welcome-icon">🌙</div>
      <h3>Welcome to Bedtime Stories!</h3>
      <p>Tell me what kind of story you'd like to hear tonight...</p>
      <div className="story-suggestions">
        <span>Try: "a brave princess", "a friendly dragon", "a magical forest"</span>
      </div>
    </div>
  );
}

// ---------------- Typing Indicator ----------------
function TypingIndicator() {
  return (
    <div className="bot-msg typing-indicator">
      <strong>Story Bot: </strong>
      <div className="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}

// ---------------- Chat Input ----------------
function ChatInput({ chatMessages, setChatMessages, isTyping, setIsTyping }) {
  const [inputText, setInputText] = useState("");

  function saveInputText(event) {
    setInputText(event.target.value);
  }

  function handleKeyPress(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  async function sendMessage() {
    if (!inputText.trim() || isTyping) return;

    const userMessage = {
      message: inputText,
      sender: "user",
      id: crypto.randomUUID(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Add user message
    setChatMessages([...chatMessages, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      // Send message to backend
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputText }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();

      // Add bot response
      setChatMessages(prev => [
        ...prev,
        {
          message: data.response || data.message || "I couldn't generate a story right now. Please try again!",
          sender: "robot",
          id: crypto.randomUUID(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      setChatMessages(prev => [
        ...prev,
        {
          message: "Sorry, I'm having trouble connecting right now. Please try again later. 😔",
          sender: "robot",
          id: crypto.randomUUID(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div className="chat-input-container">
      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask for a bedtime story..."
          onChange={saveInputText}
          onKeyPress={handleKeyPress}
          value={inputText}
          disabled={isTyping}
        />
        <button 
          onClick={sendMessage} 
          disabled={!inputText.trim() || isTyping}
          className="send-button"
        >
          <span className="send-icon">✉️</span>
          Send
        </button>
      </div>
    </div>
  );
}

// ---------------- Chat Messages ----------------
function ChatMessages({ chatMessages, isTyping }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  return (
    <div className="chat-messages">
      {chatMessages.length === 0 && <WelcomeMessage />}
      
      {chatMessages.map((msg) => (
        <div
          key={msg.id}
          className={`message-wrapper ${msg.sender === "user" ? "user-wrapper" : "bot-wrapper"}`}
        >
          <div className={msg.sender === "user" ? "user-msg" : "bot-msg"}>
            <div className="message-header">
              <span className="sender-icon">
                {msg.sender === "user" ? "👤" : "🤖"}
              </span>
              <strong>{msg.sender === "user" ? "You" : "Story Bot"}</strong>
              <span className="timestamp">{msg.timestamp}</span>
            </div>
            <div className="message-content">
              {msg.message}
            </div>
          </div>
        </div>
      ))}
      
      {isTyping && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
}

// ---------------- Main App ----------------
function BedtimeStoryChatbot() {
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  return (
    <div className="bedtime-app">
      <div className="chat-container">
        {/* Header */}
        <div className="chat-header">
          <div className="header-content">
            <h1 className="chat-title">
              <span className="title-icon">🌙</span>
              Bedtime Story Chatbot
              <span className="title-icon">✨</span>
            </h1>
            <p className="chat-subtitle">Your magical storyteller for peaceful dreams</p>
          </div>
        </div>

        {/* Messages Area */}
        <ChatMessages chatMessages={chatMessages} isTyping={isTyping} />

        {/* Input Area */}
        <ChatInput
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
          isTyping={isTyping}
          setIsTyping={setIsTyping}
        />
      </div>
    </div>
  );
}

export default BedtimeStoryChatbot;