"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [username, setUsername] = useState("");
  const [projectId, setProjectId] = useState("");
  const router = useRouter();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && projectId) {
      sessionStorage.setItem("username", username);
      router.push(`/project/${projectId}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-ide-bg text-ide-text">
      <div className="bg-ide-sidebar p-8 rounded shadow-lg border border-ide-border w-96">
        <h1 className="text-2xl font-bold mb-6 text-ide-text-active text-center">-Zero IDE</h1>
        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-ide-bg border border-ide-border rounded px-3 py-2 text-ide-text focus:outline-none focus:border-ide-blue"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Project ID</label>
            <input
              type="text"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full bg-ide-bg border border-ide-border rounded px-3 py-2 text-ide-text focus:outline-none focus:border-ide-blue"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-ide-blue hover:bg-blue-600 text-white font-semibold py-2 rounded transition-colors"
          >
            Join / Create Project
          </button>
        </form>
      </div>
    </div>
  );
}
