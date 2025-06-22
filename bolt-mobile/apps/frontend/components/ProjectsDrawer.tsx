"use client"

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "./ui/button";
import { BACKEND_URL } from "@/config";
import axios from "axios";
import { LogOutIcon, MessageSquareIcon } from "lucide-react";
import { use, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

const WIDTH = 250;
type Project = {
    id: string;
    description: string;
    createdAt: string;
}

function useProjects() {
    const { getToken } = useAuth();
    const [projects, setProjects] = useState<{ [date: string]: Project[] }>({});
    useEffect(() => {
        //(async ()=> {})() <--IIFE
        (async () => {
            const token = await getToken();
            if (!token) return;
            const response = await axios.get(`${BACKEND_URL}/projects`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            // 4. Sort the projects received from the backend by creation date (newest first).
            const sortedProjects = response.data.projects.sort((a: Project, b: Project) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            // 5. Group the sorted projects by their creation date.
            // It creates an object where keys are date strings (e.g., "June 20, 2025")
            // and values are arrays of projects created on that date.
            const projectsByDate = sortedProjects.reduce((acc: { [date: string]: Project[] }, project: Project) => {
                const date = new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(project);
                return acc;
            }, {}); // Initialize accumulator as an empty object

            setProjects(projectsByDate); // 6. Update the React component's state with the processed projects.

        })() // <--- The final '()' immediately invokes (calls) the anonymous function.

    }, [getToken]) // Dependency array: this effect re-runs when 'getToken' changes.
    // (Though 'getToken' is likely a stable function, so this effectively runs once on mount).
    return projects;
}

export function ProjectsDrawer() {
    const projects = useProjects();
    const [isOpen, setIsOpen] = useState(false);
    const [searchString, setSearchString] = useState("");
    const router = useRouter();

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (e.clientX < 40) {
                setIsOpen(true);
            }
            if (e.clientX > WIDTH) {
                setIsOpen(false);
            }
        }
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        }
    }, []);

    return (
        <>
            <Drawer open={isOpen} onOpenChange={setIsOpen} direction="left">
                <DrawerContent style={{ maxWidth: WIDTH }} className="bg-background">
                    <DrawerHeader>
                        <Button onClick={() => {
                            setIsOpen(false);
                        }} variant="ghost" className="w-full"><MessageSquareIcon /> Start new project</Button>
                        <Input
                            type="text"
                            placeholder="Search"
                            value={searchString}
                            onChange={(e) => setSearchString(e.target.value)}
                        />
                        <DrawerTitle className="font-semibold pl-2 pt-2">Your projects</DrawerTitle>
                        {Object.keys(projects).map((date) => (
                            <div key={date} className="py-2">
                                <h2 className="font-semibold text-xs px-2">{date}</h2>
                                {projects[date]
                                    .filter((project) =>
                                        project.description
                                            .toLowerCase()
                                            .includes(searchString.toLowerCase()),
                                    )
                                    .map((project) => (
                                        <Button
                                            key={project.id}
                                            variant={"ghost"}
                                            onClick={() => {
                                                router.push(`/project/${project.id}`)
                                            }}
                                            className="pl-2 w-full text-left justify-start items-start rounded hover:bg-accent cursor-pointer hover:text-accent-foreground text-muted-foreground"
                                        >
                                            <span className="block text-sm leading-snug max-w-full overflow-hidden text-ellipsis line-clamp-2">
                                                {project.description}
                                            </span>

                                        </Button>

                                    ))}
                            </div>
                        ))}
                    </DrawerHeader>
                    <DrawerFooter>
                        <Button variant="ghost" className="w-full">
                            <LogOutIcon /> Logout
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );

}