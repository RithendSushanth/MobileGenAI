"use client";
import { BACKEND_URL } from "@/config";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";

interface Action {
    id: string;
    content: string;
    createdAt: Date;
}

export function useActions(projectId: string) {
    const {getToken} = useAuth();
    const [actions, setActions] = useState<Action[]>([]);

    useEffect(()=>{
        async function getActions() {
            const token = await getToken();
            axios.get(`${BACKEND_URL}/actions/${projectId}`,{
                headers:{
                    "Authorization": `Bearer ${token}`
                }
            }).then((res) => {
                setActions(res.data.actions);
            });
        }
        getActions();
        const interval = setInterval(getActions, 1000);
        return () => clearInterval(interval);
    },[])

    return { actions };
}