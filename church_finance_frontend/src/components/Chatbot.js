import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your Church Finance Assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputValue),
        sender: 'bot'
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const getBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('hello') || input.includes('hi')) {
      return "Hello! How can I assist you with the church finances today?";
    }
    
    if (input.includes('transaction') || input.includes('expense') || input.includes('receipt')) {
      return "You can view and manage transactions in the Transactions section. Would you like me to navigate there for you?";
    }
    
    if (input.includes('budget') || input.includes('actual')) {
      return "Budget vs actual reports are available in the Dashboard and Budgets sections. You can see detailed comparisons there.";
    }
    
    if (input.includes('project')) {
      return "Project information can be found in the Projects section. You can view project ledgers and financial details there.";
    }
    
    if (input.includes('report') || input.includes('export')) {
      return "Financial reports and export options are available in the Reports section. You can generate various reports there.";
    }
    
    if (input.includes('province') || input.includes('contribution')) {
      return "Province performance and contribution tracking is available in the Dashboard and Province Statement sections.";
    }
    
    if (input.includes('obligation') || input.includes('commitment')) {
      return "Future obligations and commitments are tracked in the Obligations section.";
    }
    
    if (input.includes('help')) {
      return "I can help you with: transactions, budgets, projects, reports, province performance, and obligations. What would you like to know?";
    }
    
    return "I'm here to help with church finance management. You can ask me about transactions, budgets, projects, reports, province performance, or obligations. What would you like to know?";
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center">
              <FaRobot className="mr-2" />
              <h3 className="font-bold">Finance Assistant</h3>
            </div>
            <button onClick={toggleChat} className="text-white hover:text-gray-200">
              <FaTimes />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-3 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div
                  className={`inline-block p-2 rounded-lg max-w-xs ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="flex">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700 focus:outline-none"
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none"
        >
          <FaRobot className="text-xl" />
        </button>
      )}
    </div>
  );
};

export default Chatbot;