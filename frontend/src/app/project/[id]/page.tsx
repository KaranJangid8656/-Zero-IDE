"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Editor from "@/components/Editor";
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
      {/* Top Bar */}
      <div className="h-12 bg-ide-sidebar border-b border-ide-border flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <div className="font-bold text-lg text-white">-Zero IDE</div>
          <div className="px-3 py-1 bg-ide-bg text-xs border border-ide-border rounded text-gray-400">
            Project: <span className="text-white font-medium">{id}</span>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button className="flex items-center space-x-1 bg-green-700 hover:bg-green-600 px-4 py-1.5 rounded text-white text-sm font-semibold transition-colors">
            <Play size={16} fill="currentColor" />
            <span>Run</span>
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
