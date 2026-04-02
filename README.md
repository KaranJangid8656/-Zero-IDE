# -Zero IDE

A modern web-based collaborative IDE application with real-time editing and chat functionality. 

## Tech Stack
* **Frontend:** Next.js (TypeScript), React, Tailwind CSS
* **Code Editor:** Monaco Editor
* **Realtime Collab:** Socket.IO for chat, Yjs (CRDT-based sync) + y-websocket
* **Backend:** Node.js, Express, WebSocket
* **Database:** MongoDB

## Folder Structure
```text
.
├── backend
│   ├── src
│   │   ├── config/       # MongoDB connection setup
│   │   ├── models/       # Mongoose Schemas (User, Project, FileNode)
│   │   ├── routes/       # Express API routes
│   │   └── index.ts      # Server setup (HTTP, Socket.IO, Yjs Websocket)
│   └── package.json
└── frontend
    ├── src
    │   ├── app/          # Next.js App Router (Layouts & Pages)
    │   ├── components/   # React UI Components (Editor, Sidebar, Chat)
    │   └── lib/          # Helper utilities (Socket.IO client)
    └── package.json
```

## Running Locally

### Prerequisites
- Node.js installed
- MongoDB running locally on `mongodb://127.0.0.1:27017/zero-ide` or set `MONGODB_URI` in `backend/.env`

### Start Backend
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Start the development server (runs on `http://localhost:8080`):
   ```bash
   npm run dev
   ```

### Start Frontend
1. Open up another terminal, and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Start the Next.js development environment (runs on `http://localhost:3000`):
   ```bash
   npm run dev
   ```

### Features implemented:
1. Monaco Editor integration
2. Real-time collaboration using Yjs (CRDT synchronization)
3. Project & File System (basic boilerplate with creation and switching via Mongoose DB)
4. User System with JWT and basic Username login
5. Live team chat inside the IDE
6. VS Code styled dark-theme UI 
7. Future-ready placeholders (e.g., *Run* button for code execution, online status indicators)
