"use client";

import { useEffect, useState } from "react";
import { Folder, File, Plus, RefreshCw, Trash2 } from "lucide-react";

interface FileNode {
  _id: string;
  name: string;
  isFolder: boolean;
  parentId: string | null;
}

interface SidebarProps {
  projectId: string;
  onSelectFile: (fileId: string, name: string) => void;
  selectedFileId: string | null;
}

export default function Sidebar({ projectId, onSelectFile, selectedFileId }: SidebarProps) {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [newFileName, setNewFileName] = useState("");
  const [creating, setCreating] = useState(false);

  // Mock initial load instead of actual API for boilerplate
  useEffect(() => {
    fetchFiles();
  }, [projectId]);

  const fetchFiles = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/projects/${projectId}/files`);
      if (res.ok) {
        const data = await res.json();
        setFiles(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName) return;

    try {
      const res = await fetch(`http://localhost:8080/api/projects/${projectId}/files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFileName, isFolder: false, parentId: null })
      });
      if (res.ok) {
        const newFile = await res.json();
        setFiles(prev => [...prev, newFile]);
        setNewFileName("");
        setCreating(false);
      }
    } catch(e) {
      console.error(e);
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:8080/api/files/${id}`, { method: "DELETE" });
      setFiles(prev => prev.filter(f => f._id !== id));
    } catch(e) {
      console.error(e);
    }
  };

  return (
    <div className="w-64 h-full bg-ide-sidebar border-r border-ide-border text-ide-text flex flex-col">
      <div className="p-3 text-xs font-semibold uppercase tracking-wider text-ide-text flex justify-between items-center bg-ide-bg">
        Explorer
        <div className="flex space-x-2">
          <button onClick={() => setCreating(!creating)} className="hover:text-ide-text-active"><Plus size={16}/></button>
          <button onClick={fetchFiles} className="hover:text-ide-text-active"><RefreshCw size={14}/></button>
        </div>
      </div>
      
      {creating && (
        <form onSubmit={handleCreateFile} className="p-2 border-b border-ide-border">
          <input
            autoFocus
            type="text"
            className="w-full bg-ide-bg text-sm text-ide-text border border-ide-border px-2 py-1 focus:outline-none focus:border-ide-blue rounded"
            placeholder="New File.js"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onBlur={() => setCreating(false)}
          />
        </form>
      )}

      <div className="flex-1 overflow-y-auto">
        {files.map(f => (
          <div
            key={f._id}
            className={`flex items-center justify-between px-3 py-1 text-sm cursor-pointer group ${
              selectedFileId === f._id ? "bg-ide-highlight text-ide-text-active" : "hover:bg-ide-border"
            }`}
            onClick={() => onSelectFile(f._id, f.name)}
          >
            <div className="flex items-center space-x-2">
              <File size={16} className="text-gray-400 group-hover:text-gray-300" />
              <span>{f.name}</span>
            </div>
            
            <button 
              onClick={(e) => { e.stopPropagation(); handleDelete(f._id); }} 
              className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {files.length === 0 && !creating && (
          <div className="p-4 text-xs text-gray-500 text-center">No files in project</div>
        )}
      </div>
    </div>
  );
}
