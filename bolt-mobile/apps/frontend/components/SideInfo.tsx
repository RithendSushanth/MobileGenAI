"use client";

import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar } from "lucide-react";

export default function SideInfo() {
    const { user } = useUser();

    return (
        <span className="fixed bottom-2 left-1.5 flex flex-col items-center gap-2">
            <Avatar>
                <AvatarImage />
                <AvatarFallback>{user?.firstName}</AvatarFallback>
            </Avatar>
            <Sidebar className="text-primary/70" />
        </span>
    )
}