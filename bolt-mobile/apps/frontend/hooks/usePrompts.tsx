"use client";
import { BACKEND_URL } from "@/config";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";


interface Prompt {
    actions: any;
    id: string;
    content: string;
    type: "USER" | "SYSTEM";
    createdAt: Date;
}

export function usePrompts(projectId: string) {
    const {getToken} = useAuth();
    const [prompts, setPrompts] = useState<Prompt[]>([]);

    useEffect(() => {
        async function getPrompts() {
            const token = await getToken();
            axios.get(`${BACKEND_URL}/prompts/${projectId}`,{
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then((res) => {
                setPrompts(res.data.prompts);
            });
        }
        getPrompts();
        const interval = setInterval(getPrompts, 1000);
        return () => clearInterval(interval);
    }, []);

    return { prompts };
}
