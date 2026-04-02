"use client";

import { useEffect, useState, useRef } from "react";
import { socketService } from "@/lib/socket";

interface ChatMessage {
  username: string;
  message: string;
  timestamp: string;
}

interface ChatProps {
  projectId: string;
}

export default function Chat({ projectId }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = socketService.connect();
    const username = sessionStorage.getItem("username") || "Guest";

    socket.emit("join-project", projectId, username);

    socket.on("receive-message", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("user-joined", ({ username }) => {
      setActiveUsers((prev) => [...new Set([...prev, username])]);
    });

    return () => {
      socket.off("receive-message");
      socket.off("user-joined");
    };
  }, [projectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    socketService.socket?.emit("send-message", {
      projectId,
      message: input,
      username: sessionStorage.getItem("username") || "Guest"
    });

    setInput("");
  };

  return (
    <div className="w-80 h-full bg-ide-chat border-l border-ide-border flex flex-col text-sm text-ide-text">
      <div className="p-3 bg-ide-topbar font-bold border-b border-ide-border text-xs uppercase tracking-wider text-ide-text-active flex justify-between">
        <span>Team Chat</span>
        <span className="bg-ide-highlight px-2 rounded-full text-[10px] items-center flex">{activeUsers.length + 1} Online</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className="flex flex-col">
            <span className="font-semibold text-ide-blue mb-1">{msg.username} <span className="text-gray-500 font-normal text-xs ml-1">{new Date(msg.timestamp).toLocaleTimeString()}</span></span>
            <span className="break-words bg-[#2d2d2d] py-1 px-2 rounded-lg text-ide-text-active">{msg.message}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-3 bg-ide-bottombar border-t border-ide-border flex">
        <input
          type="text"
          className="flex-1 bg-[#252526] text-ide-text border border-ide-border rounded-l px-3 py-2 text-sm focus:outline-none focus:border-ide-blue disabled:opacity-50"
          placeholder="Message project..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-ide-blue text-white px-3 py-2 rounded-r font-semibold hover:bg-blue-600 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
