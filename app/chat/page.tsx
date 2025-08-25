"use client";
// Página de chat en vivo para comentarios
// Esta es una estructura básica, puedes expandir la lógica y el diseño según las necesidades.

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface Message {
  user: string;
  text: string;
  timestamp: string;
}

export default function LiveChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      {
        user: "Tú",
        text: input,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Chat en vivo</h1>
      <div className="flex-1 overflow-y-auto border rounded p-2 mb-2 bg-white/80">
        {messages.length === 0 && (
          <div className="text-gray-400 text-center">No hay mensajes aún.</div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <span className="font-semibold text-primary mr-2">{msg.user}:</span>
            <span>{msg.text}</span>
            <span className="text-xs text-gray-400 ml-2">{msg.timestamp}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend} variant="default">
          Enviar
        </Button>
      </div>
    </div>
  );
}
