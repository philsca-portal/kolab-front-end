"use client";

import { useTheme } from "next-themes";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Session } from "next-auth";
import Image from "next/image";
import ProjectTabs from "./project-tabs";
import { $Enums } from "@/lib/enums";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

interface SpreadProjectProps {
    projectData: {
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
    };
    session: Session | null
}

const SpreadProject: React.FC<SpreadProjectProps> = ({
    projectData,
    session
}) => {

    const { theme } = useTheme();

    const [completedTask, setCompletedTask] = useState<{
        id: string;
        taskId: string;
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
    }[]>([]);

    const totalUnreadAdminMessages = projectData.tasks.reduce((acc, task) => {
        const unreadMessages = task.messages.filter(message => message.adminStatus === "UNREAD");
        return acc + unreadMessages.length;
    }, 0);

    const totalUnreadAssigneeMessages = projectData.tasks.reduce((acc, task) => {
        const unreadMessages = task.messages.filter(message => message.assigneeStatus === "UNREAD" && task.status !== "EXPIRED");
        return acc + unreadMessages.length;
    }, 0);

    useEffect(() => {
        const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);

        socket.emit('completedTaskData', projectData.id);

        socket.on('completedTaskData', (completedTaskData) => {
            setCompletedTask(completedTaskData);
        });

        return () => {
            socket.disconnect();
        }
    }, [projectData.id]);

    return (
        <Dialog>
            <DialogTrigger className={`${theme === 'dark' ? 'hover:text-primary hover:bg-slate-800' : 'hover:text-primary hover:bg-slate-200'} text-muted-foreground text-xs font-semibold transition-colors flex items-center py-2 rounded-xl`}>
                <div className="relative flex items-center mx-1">
                    <Avatar className="mr-1 h-4 w-4">
                        <AvatarImage src={projectData.teamIcon} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    {projectData.projectName}
                    {projectData.userId === session?.user.userId ?
                        totalUnreadAdminMessages > 0 && (
                            <div className="absolute -top-[8px] left-1 h-3 w-3 bg-red-500 rounded-full text-center text-[0.50rem] leading-[12px] text-white">
                                {totalUnreadAdminMessages}
                            </div>
                        )
                        :
                        totalUnreadAssigneeMessages > 0 && (
                            <div className="absolute -top-[8px] left-1 h-3 w-3 bg-red-500 rounded-full text-center text-[0.50rem] leading-[12px] text-white">
                                {totalUnreadAssigneeMessages}
                            </div>
                        )
                    }
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-max">
                <DialogHeader>
                    <DialogTitle>
                        <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-4">
                                <div className="relative h-14 w-14">
                                    <Image className={`${theme === 'dark' ? 'ring-white' : 'ring-black'} aspect-square object-cover rounded-full ring`} sizes="100%" src={projectData.teamIcon ? projectData.teamIcon : ''} alt="alt Image" fill />
                                </div>
                                <div className="flex space-y-4">
                                    <div className="space-y-1">
                                        <h1 className="text-3xl">{projectData.projectName}</h1>
                                        <p className="text-xs">
                                            Admin: <span className="text-gray-500 italic">{projectData.adminName} {session?.user.userId === projectData.userId && '(you)'}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex mr-8 items-center -space-x-1">
                                {projectData.members && projectData.members.slice(0, 3).map((item, index) => (
                                    <Avatar key={index} className={`${theme === 'dark' ? 'border-white' : 'border-black'} h-8 w-8 border`}>
                                        <AvatarImage src={item.image ? item.image : ''} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                ))}
                                {projectData.members && projectData.members.length >= 3
                                    &&
                                    <div className={`${theme === 'dark' ? 'bg-[#020817]' : 'bg-gray-200'} flex justify-center items-center rounded-full h-4 w-4 text-[0.50rem] z-10`}>
                                        <div className={`${theme === 'dark' ? 'text-white' : 'text-black'} font-semibold`}>{projectData.members && projectData.members.length >= 4 && projectData.members && projectData.members.length - 3}</div>
                                    </div>
                                }
                            </div>
                        </div>
                    </DialogTitle>
                </DialogHeader>
                <ProjectTabs session={session} completedTask={completedTask} projectData={projectData} />
            </DialogContent>
        </Dialog>
    )
}

export default SpreadProject;