"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });
import Chat from "@/components/Chat";
import { Play } from "lucide-react";

export default function ProjectIDE() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  useEffect(() => {
    const user = sessionStorage.getItem("username");
    if (!user) {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="flex flex-col h-screen w-full bg-ide-bg text-ide-text overflow-hidden font-sans">
      {/* Premium Top Bar */}
      <div className="h-14 bg-gradient-to-b from-[#1a1a1a] to-ide-sidebar border-b border-[#333] flex items-center justify-between px-6 shadow-md z-10">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          
          <div className="flex items-center ml-4">
            <img 
              src="https://res.cloudinary.com/dx9bvma03/image/upload/v1775234149/Screenshot_2026-04-03_220257-removebg-preview_yrvc12.png" 
              alt="Logo" 
              className="h-8 w-auto object-contain" 
            />
          </div>
          <div className="h-6 w-px bg-ide-border mx-2"></div>
          <div className="flex items-center space-x-2 bg-[#1e1e1e] border border-[#333] px-3 py-1 rounded-md text-xs font-mono text-gray-300">
            <span className="text-gray-500">Room ID:</span> 
            <span className="text-white font-bold tracking-wide">{id}</span>
          </div>
        </div>
        
        <div className="flex space-x-4 items-center">
          <div className="flex items-center -space-x-2 mr-4">
             {/* Fake Avatars for visual aesthetics */}
             <div className="w-8 h-8 rounded-full border-2 border-ide-sidebar bg-indigo-600 flex items-center justify-center text-xs font-bold text-white z-20">Me</div>
             <div className="w-8 h-8 rounded-full border-2 border-ide-sidebar bg-blue-500 flex items-center justify-center text-xs text-white z-10 opacity-70">?</div>
          </div>
          
          <button 
            onClick={() => {
              navigator.clipboard.writeText(id);
              alert('Room ID copied to clipboard! Share it with your friends to collaborate.');
            }}
            className="flex items-center space-x-2 bg-[#252526] hover:bg-[#333] px-3 py-1.5 rounded-lg border border-[#444] text-xs font-medium text-gray-200 transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            <span>Invite / Share</span>
          </button>

          <button className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 px-4 py-1.5 rounded-lg text-white text-xs font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all transform hover:scale-105">
            <Play size={14} fill="currentColor" />
            <span>Run Code</span>
          </button>
        </div>
      </div>

      {/* Main IDE Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          projectId={id} 
          onSelectFile={(fId, name) => {
            setSelectedFileId(fId);
            setSelectedFileName(name);
          }} 
          selectedFileId={selectedFileId} 
        />

        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-ide-border bg-ide-bg">
          {selectedFileId && (
            <div className="h-10 border-b border-ide-border bg-ide-sidebar flex items-center px-4 overflow-x-auto text-sm text-ide-text-active">
               <span className="italic">{selectedFileName}</span>
            </div>
          )}
          <div className="flex-1 relative">
            <Editor projectId={id} fileId={selectedFileId} />
          </div>
        </div>

        {/* Chat / Sidebar Right */}
        <Chat projectId={id} />
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-blue-600 text-white text-xs flex items-center px-4 justify-between">
        <div className="flex space-x-4">
          <span>Connected</span>
          <span>{selectedFileName ? `Editing ${selectedFileName}` : "Ready"}</span>
        </div>
        <div>
           {/* Placeholders for WebRTC/Docker indicators */}
           <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
}
