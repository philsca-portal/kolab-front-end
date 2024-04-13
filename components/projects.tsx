"use client";

import { Session } from "next-auth";
import AddProject from "./add-project";
import { ScrollArea } from "./ui/scroll-area";
import SpreadProject from "./spread-project";
import { $Enums } from "@/lib/enums";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import useMessageNotification from "@/hook/use-message-notification";

interface ProjectsProps {
    session: Session | null;
}

const Projects: React.FC<ProjectsProps> = ({
    session,
}) => {

    const { addMessageNotification } = useMessageNotification();

    const [projectData, setProjectData] = useState<{
        adminName: string | null | undefined;
        members: {
            id: string;
            TeamId: string;
            name: string;
            email: string;
            image: string;
        }[] | undefined;
        userImage: string;
        userId: string | undefined;
        teamIcon: string | undefined;
        teamName: string | undefined;
        tasks: ({
            attachments: {
                id: string;
                taskId: string;
                fileName: string;
                url: string;
                createdAt: Date;
                updatedAt: Date;
            }[];
            messages: {
                id: string;
                taskId: string;
                senderId: string;
                receiverId: string;
                message: string;
                adminStatus: $Enums.StatusType;
                assigneeStatus: $Enums.StatusType;
                createdAt: Date;
                updatedAt: Date;
            }[];
        } & {
            id: string;
            projectId: string;
            assignedTo: string | null;
            title: string;
            description: string | null;
            tag: string | null;
            status: $Enums.TaskStatus;
            priority: $Enums.TaskPriority;
            dueDate: Date | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        id: string;
        TeamId: string;
        projectName: string;
    }[]>([]);

    useEffect(() => {
        const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);

        socket.emit('projectUpdate', session?.user.userId);

        socket.on('projectUpdate', (projectData) => {
            setProjectData(projectData);
            addMessageNotification(projectData);
        });

        return () => {
            socket.disconnect();
        }
    }, [addMessageNotification, session?.user.userId]);

    return (
        <div>
            <h1 className="text-[12px] text-gray-500 font-extrabold uppercase ml-2">PROJECTS</h1>
            <ScrollArea>
                <div className="flex flex-col item-center mt-2 max-h-36 space-y-1">
                    {projectData.map((data, index) =>
                        <SpreadProject key={index} projectData={data} session={session} />
                    )}
                    <AddProject session={session} />
                </div>
            </ScrollArea>
        </div>
    )
}

export default Projects;