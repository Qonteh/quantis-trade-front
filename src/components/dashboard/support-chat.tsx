"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { HelpCircle, X, Send, ImageIcon, Paperclip, Smile } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface Message {
  id: string
  content: string
  sender: "user" | "agent"
  timestamp: Date
}

const SupportChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! How can I help you today?",
      sender: "agent",
      timestamp: new Date(),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const toggleChat = () => {
    setIsOpen(!isOpen)
    // If first time opening, show notification
    if (!isOpen && messages.length === 1) {
      setTimeout(() => {
        toast({
          title: "Customer Support",
          description: "Our agents are online and ready to assist you.",
        })
      }, 1000)
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setMessage("")

    // Simulate agent typing
    setIsTyping(true)

    // Simulate response after delay
    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getAutoResponse(message),
        sender: "agent",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, agentMessage])
      setIsTyping(false)
    }, 1500)
  }

  // Simple auto-responses based on keywords
  const getAutoResponse = (msg: string): string => {
    const lowerMsg = msg.toLowerCase()

    if (lowerMsg.includes("deposit") || lowerMsg.includes("fund")) {
      return "To make a deposit, please go to the Deposit page from the sidebar menu. We accept various payment methods including credit/debit cards, bank transfers, and e-wallets."
    }

    if (lowerMsg.includes("withdraw")) {
      return "Withdrawals are processed within 24 hours. Please visit the Withdraw page to submit your request."
    }

    if (lowerMsg.includes("verification") || lowerMsg.includes("verify")) {
      return 'To complete account verification, please click on the "Complete Verification" button on your dashboard and follow the steps to upload your documents.'
    }

    if (lowerMsg.includes("trade") || lowerMsg.includes("platform")) {
      return 'You can access our trading platform by clicking on "Open Platform" from your dashboard or the Trade option in the sidebar.'
    }

    return "Thank you for your message. One of our support agents will assist you shortly. Is there anything specific you'd like help with regarding your trading account?"
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-5 right-5 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white p-4 rounded-full shadow-lg transition-all duration-300 z-30 hover:scale-110"
        aria-label="Support Chat"
      >
        {isOpen ? <X size={20} /> : <HelpCircle size={20} />}
      </button>

      {/* Chat Window - with slide-in animation */}
      <div
        className={`fixed bottom-5 right-5 w-80 md:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden z-30 transition-all duration-300 transform ${
          isOpen ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-0 scale-95 pointer-events-none"
        }`}
        style={{ maxHeight: "calc(100vh - 100px)" }}
      >
        <div className="bg-gradient-to-r from-[#2D1B69] to-[#3d2a87] p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 border-2 border-white/20">
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback className="bg-[#7C3AED] text-white">CS</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <h3 className="text-white text-sm font-medium">Customer Support</h3>
              <div className="flex items-center text-[10px] text-green-300">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block mr-1 animate-pulse"></span>
                Online now
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-full h-8 w-8"
          >
            <X size={18} />
          </Button>
        </div>

        <div className="h-80 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
          {messages.map((msg) => (
            <div key={msg.id} className={`mb-4 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              {msg.sender === "agent" && (
                <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-[#7C3AED] text-white text-xs">CS</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white rounded-tr-none shadow-md"
                    : "bg-white text-gray-800 rounded-tl-none shadow-md border border-gray-100"
                }`}
              >
                {msg.content}
                <div
                  className={`text-[9px] mt-1 ${msg.sender === "user" ? "text-white/70 text-right" : "text-gray-500"}`}
                >
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
              {msg.sender === "user" && (
                <Avatar className="h-8 w-8 ml-2 mt-1 flex-shrink-0">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">ME</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start mb-4">
              <Avatar className="h-8 w-8 mr-2 mt-1">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-[#7C3AED] text-white text-xs">CS</AvatarFallback>
              </Avatar>
              <div className="bg-white text-gray-800 rounded-2xl rounded-tl-none px-4 py-3 text-sm shadow-md border border-gray-100">
                <div className="flex items-center space-x-1">
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-3 border-t bg-white">
          <div className="flex items-center">
            <div className="flex space-x-1 mr-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-gray-500 hover:text-[#7C3AED] hover:bg-[#7C3AED]/10"
              >
                <Paperclip size={16} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-gray-500 hover:text-[#7C3AED] hover:bg-[#7C3AED]/10"
              >
                <ImageIcon size={16} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-gray-500 hover:text-[#7C3AED] hover:bg-[#7C3AED]/10"
              >
                <Smile size={16} />
              </Button>
            </div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 text-sm bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50 focus:bg-white transition-all"
            />
            <Button
              type="submit"
              className="ml-2 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] text-white p-2 rounded-full h-8 w-8 flex items-center justify-center"
              disabled={!message.trim()}
            >
              <Send size={16} />
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}

export default SupportChat
