

import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Input } from "./input";
import { ScrollArea } from "./scroll-area";
import { $Enums } from "@/lib/enums";
import { Session } from "next-auth";
import { format } from "date-fns";
import { useTheme } from "next-themes";
import { Dispatch, RefObject, SetStateAction, useEffect, useRef } from "react";

interface MessageSectionProps {
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
    }
    item: {
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
    }
    assignedToMember: {
        id: string;
        TeamId: string;
        name: string;
        email: string;
        image: string;
    } | undefined;
    message: string;
    setMessage: Dispatch<SetStateAction<string>>;
    handleSubmitMessage: (taskId: string) => Promise<void>;
    session: Session | null;
}

const MessageSection: React.FC<MessageSectionProps> = ({
    projectData,
    item,
    assignedToMember,
    message,
    setMessage,
    handleSubmitMessage,
    session
}) => {

    const { theme } = useTheme();

    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [item.messages.length]);

    return (
        <ScrollArea>
            <div className='flex flex-col max-h-48 px-4 gap-4'>
                {item.messages.length != 0 ?
                    item.messages.map((data) => {
                        return (
                            data.senderId === session?.user.userId ?
                                <div className='flex justify-end gap-2'>
                                    <div className='flex flex-col items-start gap-2'>
                                        <div className='flex justify-end items-center gap-1 w-full'>
                                            <p className='text-[0.65rem] text-gray-500'>{format(data.createdAt, "h:mm aa")}</p>
                                            <h1 className='text-xs font-bold'>You</h1>
                                        </div>
                                        <div className='bg-[#5B7553] rounded-lg w-fit'>
                                            <p className='p-2 text-sm text-white'>{data.message}</p>
                                        </div>
                                    </div>
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={session.user.userId !== projectData.userId ? assignedToMember?.image : projectData.userImage} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </div>
                                :
                                <div className='flex gap-2'>
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={data.senderId === projectData.userId ? projectData.userImage : assignedToMember?.image} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className='flex flex-col items-start gap-2'>
                                        <div className='flex items-center gap-1'>
                                            <h1 className='text-xs font-bold'>{data.senderId === projectData.userId ? projectData.adminName : assignedToMember?.name}</h1>
                                            <p className='text-[0.65rem] text-gray-500'>{format(data.createdAt, "h:mm aa")}</p>
                                        </div>
                                        <div className={`${theme === 'dark' ? 'bg-[#1e293b]' : 'bg-[#f1f5f9]'} rounded-lg w-fit`}>
                                            <p className='p-2 text-sm'>{data.message}</p>
                                        </div>
                                    </div>
                                </div>
                        )
                    })
                    :
                    <div className='flex justify-center items-center text-xs text-gray-500 italic'>
                        There is no messages for now...
                    </div>
                }
                <div ref={bottomRef} />
                <div className={`${theme === 'dark' ? 'bg-[#020817]' : 'bg-[#ffffff]'} flex gap-2 pb-2 sticky bottom-0`}>
                    <Input placeholder='Aa' value={message} onChange={(e) => setMessage(e.target.value)} />
                    <Button onClick={() => handleSubmitMessage(item.id)} size={'icon'} variant={'outline'}>
                        <Send className='h-5 w-5 mx-2' />
                    </Button>
                </div>
            </div>
        </ScrollArea>
    )
}

export default MessageSection;