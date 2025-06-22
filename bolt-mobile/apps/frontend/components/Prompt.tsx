"use client";
import { Send } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { use, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { BACKEND_URL, WORKER_API_URL } from "@/config";
import { useRouter } from "next/navigation";
export function Prompt() {
    const [prompt, setPrompt] = useState("");
    const {getToken} = useAuth();
    const router = useRouter();
    return (
        <div>
            <Textarea placeholder="Write your prompt here..." 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="flex justify-end pt-2">
                <Button onClick={async () => {
                    const token = await getToken();
                    const response = await axios.post(`${BACKEND_URL}/project`, {
                        prompt: prompt,
                    }, {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    })
                    console.log(response.data.projectId);

                    //sending req to worker url  for prompt and then routing to the project page
                    await axios.post(`${WORKER_API_URL}/prompt`,{
                        projectId: response.data.projectId,
                        prompt: prompt
                    })
                    router.push(`/project/${response.data.projectId}`);
                }}>
                    <Send className="text-2xl cursor-pointer hover:text-zinc-400 transition-all duration-200 ease-in-out" />
                </Button>
            </div>
        </div>
    )
}