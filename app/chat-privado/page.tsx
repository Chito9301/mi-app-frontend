"use client";

import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000"); // URL del backend Socket.IO

interface PrivateMessage {
  user: string;
  text: string;
  timestamp: string;
}

export default function PrivateChatPage() {
  const [messages, setMessages] = useState<PrivateMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on("private message", (msg: PrivateMessage) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.off("private message");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const msg: PrivateMessage = {
      user: "Tú",
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    socket.emit("private message", msg);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full max-w-md mx-auto p-6 bg-gray-50 rounded shadow-lg">
      <h1 className="text-2xl font-semibold mb-6 text-center">Chat Privado</h1>
      <div className="flex-1 overflow-y-auto p-4 border rounded bg-white space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 select-none">
            No hay mensajes aún. ¡Empieza la conversación!
          </p>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.user === "Tú" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-lg shadow-sm ${
                msg.user === "Tú"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-900 rounded-bl-none"
              }`}
            >
              <div className="text-sm break-words">{msg.text}</div>
              <div className="mt-1 text-xs text-gray-300 text-right select-none">
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-4 flex gap-3"
        aria-label="Enviar mensaje privado"
      >
        <input
          aria-label="Escribe un mensaje privado"
          className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje privado..."
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="btn-secondary"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
