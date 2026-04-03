"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Code2, MonitorPlay, Users } from "lucide-react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [joinId, setJoinId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const saved = sessionStorage.getItem("username");
    if (saved) setUsername(saved);
  }, []);

  const handleCreate = () => {
    if (!username.trim()) return alert("Please enter a username and become the Admin");
    const newId = Math.random().toString(36).substring(2, 8).toUpperCase();
    sessionStorage.setItem("username", username);
    router.push(`/project/${newId}`);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return alert("Please enter a username to join");
    if (!joinId.trim()) return alert("Please enter a valid Project ID");
    sessionStorage.setItem("username", username);
    router.push(`/project/${joinId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-ide-blue/20 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[100px]"></div>
      </div>

      <div className="z-10 bg-[#151515]/80 backdrop-blur-xl border border-[#333] p-10 rounded-2xl shadow-2xl w-full max-w-lg mb-20 animate-fade-in-up">
        <div className="flex flex-col items-center justify-center mb-8">
          <img 
            src="https://res.cloudinary.com/dx9bvma03/image/upload/v1775234149/Screenshot_2026-04-03_220257-removebg-preview_yrvc12.png" 
            alt="-Zero IDE Logo" 
            className="h-24 w-auto object-contain mb-2" 
          />
        </div>
        
        <p className="text-gray-400 text-center mb-10 text-sm">
          A high-performance, real-time collaborative workspace for modern teams.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 tracking-wider mb-2">Your Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. Karan"
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
            />
          </div>

          <div className="h-px bg-[#333] w-full my-6"></div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleCreate}
              className="group flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-500 p-4 rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] border border-blue-500 hover:scale-[1.02]"
            >
              <MonitorPlay size={24} className="mb-2 text-blue-100 group-hover:text-white" />
              <span className="font-semibold text-sm">New Project</span>
              <span className="text-[10px] text-blue-200 mt-1">Generate dynamic link</span>
            </button>

            <form onSubmit={handleJoin} className="flex flex-col space-y-2">
              <input
                type="text"
                value={joinId}
                onChange={(e) => setJoinId(e.target.value)}
                placeholder="Paste Room ID"
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm text-center"
              />
              <button
                type="submit"
                className="flex items-center justify-center space-x-2 bg-ide-sidebar hover:bg-[#333] border border-[#444] p-3 rounded-lg transition-all text-sm font-semibold text-gray-200"
              >
                <Users size={16} />
                <span>Join Project</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
