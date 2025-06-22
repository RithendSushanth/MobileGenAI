```md
#  AI-powered Dev Workflow Automation

Its a local-first, AI-driven development environment that transforms natural language prompts into complete working codebases, executes shell commands, and updates files in real time. Built using Bun, Gemini 2.5 Flash, and Prisma.

---


## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/RithendSushanth/MobileGenAI.git
cd bolt-mobile
````

### 2. Install dependencies

```bash
bun install
```

---

### 3. Setup Environment Variables

Create a `.env` file at the root of your worker:

```env
GEMINI_API_KEY=your_gemini_key_here
DATABASE_URL=your_postgresql_db_url_here
WS_RELAYER_URL=ws://localhost:9093
```

---

### 4. Generate Prisma Client

```bash
bunx prisma generate
```

---

### 5. Start the Worker

```bash
cd apps/worker
bun index.ts
```

This will:

* Initialize Gemini 2.5 Flash
* Start listening on **[http://localhost:9091](http://localhost:9091)**
* Start receiving and processing prompts
* Auto-create files under `tmp/bolty-worker/` via WebSocket

---

## 🌐 Useful URLs

| Service        | URL                                                                                     | Description                      |
| -------------- | --------------------------------------------------------------------------------------- | -------------------------------- |
| **Worker**     | [http://localhost:9091](http://localhost:9091)                                          | Bun Express API + Gemini handler |
| **Health**     | [http://localhost:9091/health](http://localhost:9091/health)                            | Healthcheck endpoint             |
| **History**    | [http://localhost:9091/project/\:id/history](http://localhost:9091/project/:id/history) | Project chat + action history    |
| **WebSocket**  | ws\://localhost:9093                                                                    | Stream shell/file ops (relayer)  |
| **Frontend**   | [http://localhost:3000/project/\:id](http://localhost:3000/project/:id)                 | Web interface with iframe + logs |
| **Mobile App** | Run via `npx expo start` inside `bolt-mobile`                                           | React Native preview             |

---

## 📦 Technologies Used

* ⚙️ **Bun** – Superfast JavaScript runtime
* 🧠 **Gemini 2.5 Flash** – Google’s AI model for prompt processing
* 📡 **WebSockets** – Live sync between worker and frontend
* 🧬 **Prisma + PostgreSQL** – Database layer
* 📱 **Expo + React Native** – Mobile frontend (bolt-mobile)
* 🧩 **Next.js App Router** – For the web frontend (with Clerk auth)

---

## 📌 Notes

* `tmp/bolty-worker/` is **regenerated per session** and **excluded from Git** via `.gitignore`.

---

## 🤖 Example Prompt

```xml
<boltArtifact id="simple-task-app" title="Simple Task App">
  <boltAction type="file" filePath="app/index.tsx">
    // your React Native code here
  </boltAction>
  <boltAction type="shell">
    npm install
  </boltAction>
</boltArtifact>
```

---
