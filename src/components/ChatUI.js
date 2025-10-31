import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setData, setProperties, setCenter } from "../store/appSlice";

export default function ChatUI() {
  const selectedProperty = useSelector((state) => state.app.selectedProperty);
  const dispatch = useDispatch();
  
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "Hey there 👋 How can I help you find properties?" },
  ]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [context, setContext] = useState({
    pincode: null,
    bhk: null,
    propertyType: null,
    availableFor: null,
    currentProperty: null,
    viewedProperties: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Generate sessionId on component mount
  useEffect(() => {
    const randomSessionId = Math.floor(Math.random() * 1000000000);
    setSessionId(randomSessionId);
  }, []);

  // Auto-scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Sync selectedProperty with context.currentProperty
  useEffect(() => {
    if (selectedProperty) {
      setContext((prev) => ({
        ...prev,
        currentProperty: selectedProperty
      }));
    } else {
      setContext((prev) => ({
        ...prev,
        currentProperty: null
      }));
    }
  }, [selectedProperty]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !sessionId) return;

    const userMessage = input.trim();
    const newMessage = { id: Date.now(), sender: "user", text: userMessage };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Make API call
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/chat/message`,
        {
          prompt: userMessage,
          context: context,
          sessionId: sessionId,
        },
        {
          withCredentials: true,
        }
      );

      // Extract response data
      const { message, updatedContext, data: infrastructureData, properties } = response.data;

      // Display bot message
      if (message) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: "bot", text: message },
        ]);
      }

      // Update context state (only non-null values for pincode, bhk, propertyType, availableFor)
      if (updatedContext) {
        setContext((prevContext) => ({
          ...prevContext,
          ...(updatedContext.pincode !== null && { pincode: updatedContext.pincode }),
          ...(updatedContext.bhk !== null && { bhk: updatedContext.bhk }),
          ...(updatedContext.propertyType !== null && { propertyType: updatedContext.propertyType }),
          ...(updatedContext.availableFor !== null && { availableFor: updatedContext.availableFor }),
        }));
        
        // Update map center if lat and lng are provided
        if (updatedContext?.lat != null && updatedContext?.lng != null) {
          console.log("updatedContext", updatedContext.lat, updatedContext.lng);
          dispatch(setCenter({ 
            lat: updatedContext.lat, 
            lng: updatedContext.lng 
          }));
        }
      }

      // Update Redux with infrastructure data
      if (infrastructureData && infrastructureData.data) {
        console.log("infrastructureData", infrastructureData.data);
        dispatch(setData(infrastructureData.data));
      }

      // Update Redux with properties
      if (properties && properties.length >= 0) {
        console.log("properties", properties);
        dispatch(setProperties(properties));
      }
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Display error message in chat
      const errorMessage = error.response?.data?.message || "Sorry, I encountered an error. Please try again.";
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "bot", text: `❌ ${errorMessage}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-indigo-100 via-white to-blue-100">
      {/* Header */}
      <header className="backdrop-blur-md bg-white/70 border-b border-gray-200 shadow-sm py-3 px-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-base font-semibold text-gray-800 flex items-center gap-2">
          💬 Assistant
        </h1>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Online"></div>
      </header>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`relative max-w-[85%] px-3 py-2 rounded-xl text-xs shadow-md transition-transform duration-200 hover:scale-[1.02] ${
                msg.sender === "user"
                  ? "bg-gradient-to-br from-blue-600 to-indigo-500 text-white rounded-br-none"
                  : "bg-white/90 backdrop-blur-md text-gray-800 border border-gray-200 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <form
        onSubmit={sendMessage}
        className="p-3 bg-white/70 backdrop-blur-lg border-t border-gray-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-1 border border-gray-300 rounded-full px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/90 shadow-sm"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white rounded-full px-4 py-1.5 text-xs font-medium shadow-md transition-transform duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}