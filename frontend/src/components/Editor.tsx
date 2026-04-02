"use client";

import { useEffect, useRef, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";

interface EditorProps {
  projectId: string;
  fileId: string | null;
}

export default function Editor({ projectId, fileId }: EditorProps) {
  const [editor, setEditor] = useState<any>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const docRef = useRef<Y.Doc | null>(null);

  useEffect(() => {
    if (!editor || !fileId) return;

    // Disconnect old doc and provider
    if (providerRef.current) providerRef.current.destroy();
    if (bindingRef.current) bindingRef.current.destroy();
    if (docRef.current) docRef.current.destroy();

    const doc = new Y.Doc();
    docRef.current = doc;

    // Room name: projectId + fileId for separate file syncs
    const roomName = `${projectId}-${fileId}`;
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/yjs";

    const provider = new WebsocketProvider(wsUrl, roomName, doc);
    providerRef.current = provider;

    const type = doc.getText("monaco");
    const model = editor.getModel();

    if (model) {
      bindingRef.current = new MonacoBinding(type, model, new Set([editor]), provider.awareness);
    }

    return () => {
      provider?.destroy();
      bindingRef.current?.destroy();
      doc?.destroy();
    };
  }, [editor, projectId, fileId]);

  if (!fileId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#1e1e1e] text-ide-text">
        <p>Select a file to start editing</p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full bg-[#1e1e1e]">
      <MonacoEditor
        width="100%"
        height="100%"
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on",
        }}
        onMount={(e) => setEditor(e)}
        path={fileId}
      />
    </div>
  );
}
