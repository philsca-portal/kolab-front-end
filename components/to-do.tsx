import { AnimatePresence, motion } from 'framer-motion';
import {
    Card,
    CardContent
} from "@/components/ui/card"
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { AlertCircle, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";
import { $Enums } from "@/lib/enums";
import { format } from "date-fns";
import DropIndicator from "./drop-indicator";
import { Dispatch, SetStateAction, useState } from "react";
import { Session } from 'next-auth';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import toast from 'react-hot-toast';
import axios from 'axios';
import MessageSection from './ui/message-section';

interface ToDoProps {
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
    filteredTask: ({
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
    session: Session | null;
    setColumn: Dispatch<SetStateAction<string>>;
    column: string;
    handleMessageRead: (taskId: string) => Promise<void>;
}

const ToDo: React.FC<ToDoProps> = ({
    projectData,
    filteredTask,
    session,
    setColumn,
    column,
    handleMessageRead,
}) => {

    const { theme } = useTheme();
    const [active, setActive] = useState(false);
    const [message, setMessage] = useState('');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleSubmitMessage = async (taskId: string) => {
        if (message.length > 0) {
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sendMessage`, {
                    senderId: session?.user.userId,
                    taskId,
                    message
                });

                if (response.data.success) {
                    setMessage('');
                    toast.success('Message sent.');
                }
            } catch (error) {
                toast.error('Something went wrong.');
                console.log(error);
            }
        }
    }

    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    }

    const handleOnOpenDeleteDialogChange = (open: boolean) => {
        if (!open) {
            setOpenDeleteDialog(false);
        }
    }

    const handleDeleteTask = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, taskId: string) => {
        try {
            const deleteTaskNotification = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/deleteTaskNotification`, {
                sendersId: session?.user.userId,
                taskId
            });

            if (deleteTaskNotification.data.success) {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/deleteTask`, {
                    taskId
                });

                if (response.data.success) {
                    toast.success('Data deleted.');
                    setOpenDeleteDialog(false);
                } else {
                    toast.error('Something went wrong.(task)');
                }
            } else {
                toast.error('Something went wrong.(Notification)');
            }
        } catch (error) {
            toast.error('Something went wrong.');
            console.log(error);
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        if (column === "ON_GOING" || column === "IN_REVIEW") {
            setActive(false);
            return;
        } else {
            highlightIndicator(e);
            setActive(true);
        }
    }

    const highlightIndicator = (e: React.DragEvent<HTMLDivElement>) => {
        const indicators = getIndicators();
        clearHighlights(indicators);
        const el = getNearestIndicator(e, indicators);

        (el.element as HTMLElement).style.opacity = "1";
    }

    const clearHighlights = (el: Element[] | null = null) => {
        const indicators = el || getIndicators();

        indicators.forEach((i) => {
            (i as HTMLElement).style.opacity = "0";
        })
    }

    const getNearestIndicator = (e: React.DragEvent<HTMLDivElement>, indicators: Element[]) => {
        const DISTANCE_OFFSET = 50;

        const el = indicators.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = e.clientY - (box.top + DISTANCE_OFFSET);

            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, {
            offset: Number.NEGATIVE_INFINITY,
            element: indicators[indicators.length - 1],
        });

        return el;
    }

    const getIndicators = () => {
        return Array.from(document.querySelectorAll(`[data-column="PENDING"]`));
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        setActive(false);
        clearHighlights();
    }

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        setActive(false);
        clearHighlights();

        if (column === "ON_GOING" || column === "IN_REVIEW") {
            return;
        }
    }

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        setColumn("");
    }

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string, assignedTo: string) => {
        setColumn("PENDING");
        e.dataTransfer.setData('TODO', JSON.stringify({ id, assignedTo }));
    }

    const filteredMembers = projectData.members
        ? projectData.members.filter(member =>
            projectData.tasks.some(task => task.assignedTo === member.id)
        )
        : [];

    const containsFileType = (text: string, fileType: string[]) => {
        const lowerText = text.toLowerCase();

        return fileType.some(fileType => lowerText.includes(fileType));
    }

    const filterTask = filteredTask.filter((item) => item.status === "PENDING");

    const aestheticColors = [
        '#FF6B6B',
        '#78C0E0',
        '#FFD166',
        '#06D6A0',
        '#FCB69F',
        '#8367C7',
        '#5E60CE',
        '#4EA8DE',
        '#FAF3DD',
        '#B2CCD6',
        '#FFD700',
        '#6A0572',
        '#AB83A1',
        '#E63946',
        '#1D3557',
        '#F4A261',
        '#E76F51',
        '#2A9D8F',
        '#F4D35E',
        '#3C2F2F'
    ];

    return (
        <Card onDragEnd={handleDrag} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDragEnd} className={`${active ? 'bg-gray-500' : 'bg-card'} ${column === "ON_GOING" || column === "IN_REVIEW" || column === "COMPLETED" ? ' opacity-20' : 'opacity-100'} max-h-[400px] overflow-hidden mx-2`}>
            <CardContent className="p-2 space-y-4">
                <div className="col-span-1">
                    <h1 className="text-sm font-extrabold uppercase">TO-DO</h1>
                </div>
                <ScrollArea>
                    <div className="flex flex-col max-h-[350px] px-4">
                        <AnimatePresence>
                            {filterTask.map((item, index) => {
                                const assignedToMember = filteredMembers.find(
                                    member => member.id === item.assignedTo
                                );

                                const getAttachments = item.attachments.filter(taskId => taskId.taskId === item.id);

                                const getColorForBadge = (badgeContent: string | null) => {
                                    if (badgeContent !== null) {

                                        const uniqueHash = badgeContent.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

                                        const colorIndex = Math.abs(uniqueHash) % aestheticColors.length;
                                        const selectedColor = aestheticColors[colorIndex];

                                        localStorage.setItem(`${badgeContent}`, selectedColor);

                                        return selectedColor;
                                    }

                                    return "#FFFFFF";
                                };

                                const totalUnreadAdminMessages = projectData.tasks.reduce((acc, task) => {
                                    const unreadMessages = task.messages.filter(message => message.adminStatus === "UNREAD" && message.taskId === item.id);
                                    return acc + unreadMessages.length;
                                }, 0);

                                const totalUnreadAssigneeMessages = projectData.tasks.reduce((acc, task) => {
                                    const unreadMessages = task.messages.filter(message => message.assigneeStatus === "UNREAD" && message.taskId === item.id);
                                    return acc + unreadMessages.length;
                                }, 0);

                                return (
                                    <motion.div key={index}
                                        layout
                                        layoutId={item.id}>
                                        <DropIndicator beforeId={index || "-1"} column={"PENDING"} />
                                        <Card onDragStart={(e) => handleDragStart(e, item.id, assignedToMember?.email ?? '')} draggable={true} className={`${theme === 'dark' ? 'bg-[#1e293b]' : 'bg-[#f1f5f9]'} flex justify-center items-center cursor-grab active:cursor-grabbing`}>
                                            <CardContent className="p-4 flex flex-col gap-2 max-w-48">
                                                {session?.user.userId === projectData.userId
                                                    &&
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <div className="flex justify-end items-center">
                                                                <svg className="hover:scale-110 cursor-pointer transition" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM12.5 8.625C13.1213 8.625 13.625 8.12132 13.625 7.5C13.625 6.87868 13.1213 6.375 12.5 6.375C11.8787 6.375 11.375 6.87868 11.375 7.5C11.375 8.12132 11.8787 8.625 12.5 8.625Z" fill="currentColor"></path>
                                                                </svg>
                                                            </div>
                                                        </PopoverTrigger>
                                                        <PopoverContent className='max-w-[150px] flex flex-col p-1 gap-1'>
                                                            <Dialog open={openDeleteDialog} onOpenChange={handleOnOpenDeleteDialogChange}>
                                                                <DialogTrigger onClick={handleOpenDeleteDialog} asChild>
                                                                    <Button className='flex justify-start' variant={'ghost'} size={'sm'}>
                                                                        <Trash2 className='h-4 w-4 mr-2' />
                                                                        Delete
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent className='w-fit'>
                                                                    <DialogHeader>
                                                                        <DialogTitle>Delete this task</DialogTitle>
                                                                    </DialogHeader>
                                                                    <DialogDescription>
                                                                        This action cannot be undone. This will permanently delete your
                                                                        account and remove your data from our servers.
                                                                    </DialogDescription>
                                                                    <DialogFooter className='gap-2'>
                                                                        <DialogClose>Cancel</DialogClose>
                                                                        <Button onClick={(e) => handleDeleteTask(e, item.id)} variant={"destructive"}>Delete</Button>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </PopoverContent>
                                                    </Popover>
                                                }
                                                <div className="flex items-center justify-between">
                                                    <Badge className="w-fit text-white" style={{ backgroundColor: getColorForBadge(item.tag) }}>{item.tag}</Badge>
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <AlertCircle className={`${item.priority === "LOW" ? 'text-green-500' : item.priority === "NORMAL" ? ' text-yellow-400' : item.priority === "HIGH" ? 'text-orange-500' : item.priority === "URGENT" ? 'text-red-500' : ''} hover:scale-110 cursor-pointer transition`} size={16} />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>{item.priority}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                                <h1 className="w-28 font-semibold break-words">{item.title}</h1>
                                                <p className="text-gray-500 text-xs italic">Due: {item.dueDate && format(item.dueDate, 'MMM. d, yyyy')}</p>
                                                <div className="gap-2">
                                                    <div className="flex justify-between items-center">
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarImage src={assignedToMember?.image} alt={assignedToMember?.name} />
                                                            <AvatarFallback>CN</AvatarFallback>
                                                        </Avatar>
                                                        <Popover>
                                                            <PopoverTrigger onClick={() => handleMessageRead(item.id)} className="relative hover:scale-110 transition">
                                                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M12.5 3L2.5 3.00002C1.67157 3.00002 1 3.6716 1 4.50002V9.50003C1 10.3285 1.67157 11 2.5 11H7.50003C7.63264 11 7.75982 11.0527 7.85358 11.1465L10 13.2929V11.5C10 11.2239 10.2239 11 10.5 11H12.5C13.3284 11 14 10.3285 14 9.50003V4.5C14 3.67157 13.3284 3 12.5 3ZM2.49999 2.00002L12.5 2C13.8807 2 15 3.11929 15 4.5V9.50003C15 10.8807 13.8807 12 12.5 12H11V14.5C11 14.7022 10.8782 14.8845 10.6913 14.9619C10.5045 15.0393 10.2894 14.9965 10.1464 14.8536L7.29292 12H2.5C1.11929 12 0 10.8807 0 9.50003V4.50002C0 3.11931 1.11928 2.00003 2.49999 2.00002Z" fill="currentColor"></path>
                                                                </svg>
                                                                {projectData.userId === session?.user.userId ?
                                                                    totalUnreadAdminMessages > 0 && (
                                                                        <div className="absolute -top-[2px] -right-[6px] h-3 w-3 bg-red-500 rounded-full text-center text-[0.50rem] leading-[12px] text-white">
                                                                            {totalUnreadAdminMessages}
                                                                        </div>
                                                                    )
                                                                    :
                                                                    totalUnreadAssigneeMessages > 0 && (
                                                                        <div className="absolute -top-[2px] -right-[6px] h-3 w-3 bg-red-500 rounded-full text-center text-[0.50rem] leading-[12px] text-white">
                                                                            {totalUnreadAssigneeMessages}
                                                                        </div>
                                                                    )
                                                                }
                                                            </PopoverTrigger>
                                                            <PopoverContent>
                                                                <div onClick={() => handleMessageRead(item.id)}>
                                                                    <MessageSection item={item} session={session} projectData={projectData} assignedToMember={assignedToMember} message={message} setMessage={setMessage} handleSubmitMessage={handleSubmitMessage} />
                                                                </div>
                                                            </PopoverContent>
                                                        </Popover>
                                                    </div>
                                                    {getAttachments.length !== 0
                                                        &&
                                                        <Separator className={`${theme === 'dark' ? 'bg-white' : 'bg-black'} `} />
                                                    }
                                                    <div className="flex flex-col space-y-2">
                                                        {getAttachments.map((item, index) => {

                                                            const hasPDF = containsFileType(item.url, ["pdf"]);
                                                            const hasImage = containsFileType(item.url, ["gif", "jpg", "jpeg", "png", "svg"]);
                                                            const hasWord = containsFileType(item.url, ["docx", "doc", "ppt", "txt"]);

                                                            return (
                                                                <div key={index} className="flex items-center font-light">
                                                                    {hasPDF && <svg className="mr-1" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 2C3.22386 2 3 2.22386 3 2.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V6H8.5C8.22386 6 8 5.77614 8 5.5V2H3.5ZM9 2.70711L11.2929 5H9V2.70711ZM2 2.5C2 1.67157 2.67157 1 3.5 1H8.5C8.63261 1 8.75979 1.05268 8.85355 1.14645L12.8536 5.14645C12.9473 5.24021 13 5.36739 13 5.5V12.5C13 13.3284 12.3284 14 11.5 14H3.5C2.67157 14 2 13.3284 2 12.5V2.5Z" fill="currentColor"></path></svg>}
                                                                    {hasImage && <svg className="mr-1" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 11.0001V4.00006L1 4.00006L1 11.0001H14ZM15 4.00006V11.0001C15 11.5523 14.5523 12.0001 14 12.0001H1C0.447715 12.0001 0 11.5523 0 11.0001V4.00006C0 3.44778 0.447715 3.00006 1 3.00006H14C14.5523 3.00006 15 3.44778 15 4.00006ZM2 5.25C2 5.11193 2.11193 5 2.25 5H5.75C5.88807 5 6 5.11193 6 5.25V9.75C6 9.88807 5.88807 10 5.75 10H2.25C2.11193 10 2 9.88807 2 9.75V5.25ZM7.5 7C7.22386 7 7 7.22386 7 7.5C7 7.77614 7.22386 8 7.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H7.5ZM7 9.5C7 9.22386 7.22386 9 7.5 9H12.5C12.7761 9 13 9.22386 13 9.5C13 9.77614 12.7761 10 12.5 10H7.5C7.22386 10 7 9.77614 7 9.5ZM7.5 5C7.22386 5 7 5.22386 7 5.5C7 5.77614 7.22386 6 7.5 6H11.5C11.7761 6 12 5.77614 12 5.5C12 5.22386 11.7761 5 11.5 5H7.5Z" fill="currentColor"></path></svg>}
                                                                    {hasWord && <svg className="mr-1" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z" fill="currentColor"></path></svg>}
                                                                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs italic">{item.fileName}</a>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                        <DropIndicator beforeId={"-1"} column={"PENDING"} />
                    </div>
                </ScrollArea>
            </CardContent>
        </Card >
    )
}

export default ToDo;