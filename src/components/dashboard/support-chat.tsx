
import React, { useState } from 'react';
import { HelpCircle, X, Send, Loader } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

const SupportChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! How can I help you today?',
      sender: 'agent',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
    // If first time opening, show notification
    if (!isOpen && messages.length === 1) {
      setTimeout(() => {
        toast({
          title: "Customer Support",
          description: "Our agents are online and ready to assist you.",
        });
      }, 1000);
    }
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setMessage('');
    
    // Simulate agent typing
    setIsTyping(true);
    
    // Simulate response after delay
    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getAutoResponse(message),
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  // Simple auto-responses based on keywords
  const getAutoResponse = (msg: string): string => {
    const lowerMsg = msg.toLowerCase();
    
    if (lowerMsg.includes('deposit') || lowerMsg.includes('fund')) {
      return 'To make a deposit, please go to the Deposit page from the sidebar menu. We accept various payment methods including credit/debit cards, bank transfers, and e-wallets.';
    }
    
    if (lowerMsg.includes('withdraw')) {
      return 'Withdrawals are processed within 24 hours. Please visit the Withdraw page to submit your request.';
    }
    
    if (lowerMsg.includes('verification') || lowerMsg.includes('verify')) {
      return 'To complete account verification, please click on the "Complete Verification" button on your dashboard and follow the steps to upload your documents.';
    }
    
    if (lowerMsg.includes('trade') || lowerMsg.includes('platform')) {
      return 'You can access our trading platform by clicking on "Open Platform" from your dashboard or the Trade option in the sidebar.';
    }
    
    return "Thank you for your message. One of our support agents will assist you shortly. Is there anything specific you'd like help with regarding your trading account?";
  };
  
  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-5 right-5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white p-3 rounded-full shadow-lg transition-all duration-300 z-30"
      >
        {isOpen ? <X size={20} /> : <HelpCircle size={20} />}
      </button>
      
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-30 animate-fade-in">
          <div className="bg-[#2D1B69] p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white mr-2">
                <HelpCircle size={16} />
              </div>
              <div>
                <h3 className="text-white text-sm font-medium">Customer Support</h3>
                <span className="flex items-center text-[10px] text-green-300">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block mr-1"></span>
                  Online
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <X size={18} />
            </button>
          </div>
          
          <div className="h-72 overflow-y-auto p-4 bg-gray-50">
            {messages.map(msg => (
              <div 
                key={msg.id} 
                className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-[#7C3AED] text-white' 
                      : 'bg-white text-gray-800 shadow-sm'
                  }`}
                >
                  {msg.content}
                  <div className={`text-[9px] mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start mb-3">
                <div className="bg-white text-gray-800 rounded-lg px-3 py-2 text-sm shadow-sm">
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse mx-1"></div>
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSendMessage} className="p-3 border-t">
            <div className="flex">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
              />
              <button 
                type="submit" 
                className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-3 py-2 rounded-r-md"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default SupportChat;
