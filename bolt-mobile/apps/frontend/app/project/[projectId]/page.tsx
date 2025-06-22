// "use client";
// import { Appbar } from "@/components/Appbar";
// import { Prompt } from "@/components/Prompt";
// import { Button } from "@/components/ui/button";
// import { WORKER_URL } from "@/config";
// import { useActions } from "@/hooks/useActions";
// import { usePrompts } from "@/hooks/usePrompts";
// import { Send } from "lucide-react";
// import { use } from "react";

// export default function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
//     const { projectId } = use(params); 
//      const { prompts } = usePrompts(projectId);
//   const { actions } = useActions(projectId);
//     return <div>
//         <Appbar />
//         <div className="flex  h-screen">
//             <div className="w-1/2 h-screen flex flex-col justify-between">
//                 <div>
//                     chat history
//                     {prompts.filter((prompt) => prompt.type === "USER").map((prompt) => (
//                         <div key={prompt.id}>
//                             {prompt.content}
//                         </div>
//                     ))}
//                     {actions.map((action) => (
//                         <div key={action.id}>
//                             {action.content}
//                         </div>
//                     ))}
//                 </div>
//                 <div>
//                     <Button>
//                         <Send />
//                     </Button>
//                 </div>
//             </div>
//             <div className="w-3/4 p-8">
//                 <iframe src={`${WORKER_URL}`} className="w-3/4" width={"100%"} height={"100%"}></iframe>
//             </div>

//         </div>;
//     </div>

// }


"use client"

import { Appbar } from "@/components/Appbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { WORKER_URL } from "@/config"
import { useActions } from "@/hooks/useActions"
import { usePrompts } from "@/hooks/usePrompts"
import { Send, User, Bot } from "lucide-react"
import { use, useState } from "react"

export default function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params)
  const { prompts } = usePrompts(projectId)
  const { actions } = useActions(projectId)
  const [inputValue, setInputValue] = useState("")

  const sendMessage = () => {
    if (!inputValue.trim()) return
    console.log("Send message:", inputValue) 
    setInputValue("")
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      {/* <Appbar /> */}

      <div className="flex flex-1 overflow-hidden">
        {/* Chat Panel */}
        <div className="w-full md:w-1/2 border-r border-gray-200 dark:border-zinc-700 flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
            <h2 className="text-lg font-semibold">Chat</h2>
            <p className="text-sm text-zinc-500">Project: {projectId}</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 bg-white dark:bg-zinc-900">
            {prompts.filter(p => p.type === "USER").map(prompt => (
              <div key={prompt.id} className="flex gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="bg-blue-100 dark:bg-blue-950 dark:text-blue-100 rounded-lg px-4 py-2 max-w-sm">
                  <p className="text-sm">{prompt.content}</p>
                </div>
              </div>
            ))}

            {actions.map(action => (
              <div key={action.id} className="flex gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-green-500 rounded-full">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-green-100 dark:bg-green-900 dark:text-green-100 border border-green-200 dark:border-green-800 rounded-lg px-4 py-2 max-w-sm">
                  <p className="text-sm">{action.content}</p>
                </div>
              </div>
            ))}

            {prompts.length === 0 && actions.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-16 text-zinc-500 dark:text-zinc-400">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                  <Bot className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
                <p className="text-sm max-w-xs">
                  Ask questions, request changes, or describe what you'd like to build.
                </p>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 dark:border-zinc-700 p-4 bg-white dark:bg-zinc-800">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 text-sm"
              />
              <Button size="sm" onClick={sendMessage}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="hidden md:flex w-4/3 flex-col bg-white dark:bg-zinc-900">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
            <h2 className="text-lg font-semibold">Preview</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Live preview of your project</p>
          </div>
          <div className="flex-1 p-4">
            <div className="h-full bg-gray-50 dark:bg-zinc-800 border-2 border-dashed border-gray-300 dark:border-zinc-600 rounded-lg overflow-hidden">
              <iframe
                src={WORKER_URL}
                className="w-full h-full border-0 rounded-lg"
                title="Project Preview"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

