import React, { useState } from "react";
import axios from "axios";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am your AI CRM Assistant. How can I help you manage your HCP interactions today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/agent/chat",
        { message: userMessage.text },
      );
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: response.data.reply },
      ]);
    } catch (err) {
      setError(
        "Connection to AI Agent failed. Please check your backend server.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col h-[75vh] w-full max-w-4xl mx-auto overflow-hidden">
      <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
        <span className="text-2xl">🤖</span>
        <h2 className="m-0 text-lg font-semibold text-sky-700">
          AI CRM Assistant
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col gap-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl text-sm leading-relaxed max-w-[75%] shadow-sm ${
              m.sender === "user"
                ? "bg-sky-600 text-white self-end rounded-br-sm"
                : "bg-white border border-slate-200 text-slate-800 self-start rounded-bl-sm"
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="p-4 bg-white border border-slate-200 text-slate-500 italic self-start rounded-xl rounded-bl-sm text-sm shadow-sm">
            Agent is processing...
          </div>
        )}
      </div>

      {error && (
        <div className="mx-5 mb-3 p-3 bg-red-50 text-red-800 border border-red-200 rounded-md text-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSend}
        className="flex p-4 bg-white border-t border-slate-200"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message (e.g., 'Check my history with Dr. Strange')"
          disabled={loading}
          className="flex-1 px-4 py-3 border border-slate-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm bg-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-3 rounded-r-md font-medium transition-colors disabled:opacity-70"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
