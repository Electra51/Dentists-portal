import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Minimize2, User } from "lucide-react";

const LiveChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! Welcome to Dentist Portal. How can we help you today?",
      sender: "bot",
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickReplies = [
    "Book an appointment",
    "Service pricing",
    "Office hours",
    "Emergency care",
  ];

  const handleSendMessage = (text = message) => {
    if (!text.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: text,
      sender: "user",
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");

    setIsTyping(true);

    setTimeout(() => {
      const botReply = getBotReply(text);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: botReply,
          sender: "bot",
          time: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotReply = (userText) => {
    const lowerText = userText.toLowerCase();

    if (lowerText.includes("appointment") || lowerText.includes("book")) {
      return "Great! You can book an appointment by calling +880 1234-56789 or clicking the 'Book Appointment' button on our website. What time works best for you?";
    } else if (lowerText.includes("price") || lowerText.includes("cost")) {
      return "Our pricing varies by service. A routine check-up starts from $50. For specific treatment costs, please share what service you're interested in!";
    } else if (lowerText.includes("hours") || lowerText.includes("time")) {
      return "We're open Monday-Friday: 9:00 AM - 6:00 PM, Saturday: 10:00 AM - 4:00 PM. We're closed on Sundays. Would you like to schedule a visit?";
    } else if (lowerText.includes("emergency")) {
      return "For dental emergencies, please call our emergency hotline immediately: +880 1234-56789. We provide 24/7 emergency dental care!";
    } else if (lowerText.includes("hi") || lowerText.includes("hello")) {
      return "Hello! How can I assist you with your dental care needs today?";
    } else {
      return "Thank you for your message! A team member will get back to you shortly. Is there anything specific I can help you with right now?";
    }
  };

  const handleQuickReply = (reply) => {
    handleSendMessage(reply);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-secondary to-info text-white  shadow-md p-4 rounded-full  hover:bg-teal-600 transition-all duration-300 hover:scale-110 z-50 group">
          <MessageCircle className="w-6 h-6" />

          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
            1
          </span>

          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Chat with us!
          </span>
        </button>
      )}

      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized ? "h-16" : "h-[600px]"
          }`}>
          <div className="bg-gradient-to-r from-secondary to-info text-white hover:opacity-90 shadow-md p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-[#5ecdc9]" />
              </div>
              <div>
                <h3 className="font-semibold">Dentist Portal</h3>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-xs text-teal-100">
                    Online • Replies in ~2 min
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-[#5ecdc9] p-1 rounded transition-colors">
                <Minimize2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-[#5ecdc9] p-1 rounded transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}>
                    <div
                      className={`max-w-[75%] ${
                        msg.sender === "user" ? "order-2" : "order-1"
                      }`}>
                      <div
                        className={`p-3 rounded-2xl ${
                          msg.sender === "user"
                            ? "bg-teal-500 text-white rounded-br-none"
                            : "bg-white text-gray-800 rounded-bl-none shadow-md"
                        }`}>
                        <p className="text-sm">{msg.text}</p>
                      </div>
                      <p
                        className={`text-xs text-gray-500 mt-1 ${
                          msg.sender === "user" ? "text-right" : "text-left"
                        }`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-md">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="px-4 py-2 bg-white border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs bg-gray-100 hover:bg-teal-50 text-gray-700 hover:text-teal-600 px-3 py-1.5 rounded-full transition-colors duration-200 border border-gray-200 hover:border-teal-300">
                      {reply}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    className="bg-teal-500 text-white p-2 rounded-full hover:bg-teal-600 transition-colors duration-200 shadow-md hover:shadow-lg">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  We typically reply within 2 minutes
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default LiveChatWidget;
