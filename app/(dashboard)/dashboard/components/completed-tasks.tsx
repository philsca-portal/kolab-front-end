import { AlertCircle, ArrowUpRight, ClipboardCheck } from "lucide-react";
import { useTheme } from "next-themes";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { $Enums } from "@/lib/enums";

interface CompletedTasksProps {
    filterTaskCompleted: {
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
    }[];
    completedPercentage: number
}

const CompletedTasks: React.FC<CompletedTasksProps> = ({
    filterTaskCompleted,
    completedPercentage
}) => {

    const { theme } = useTheme();

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    }

    const handleOnOpenChange = (open: boolean) => {
        if (!open) {
            setOpen(false);
        }
    }

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

    const getColorForBadge = (badgeContent: string | null) => {
        if (badgeContent !== null) {

            const uniqueHash = badgeContent.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

            const colorIndex = Math.abs(uniqueHash) % aestheticColors.length;
            const selectedColor = aestheticColors[colorIndex];

            localStorage.setItem(`badgeColor_${badgeContent}`, selectedColor);

            return selectedColor;
        }

        return "#FFFFFF";
    };

    return (
        <Drawer open={open} onOpenChange={handleOnOpenChange}>
            <DrawerTrigger onClick={handleOpen} asChild>
                <div className={`${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'} flex items-center w-full rounded-2xl px-5 py-3`}>
                    <div className="flex flex-col-reverse gap-2 md:flex-col w-full">
                        <div className="flex flex-col gap-2 md:justify-between md:flex-row md:items-center">
                            <h1 className="text-6xl md:text-3xl font-semibold">{filterTaskCompleted.length}</h1>
                            <p className="flex text-xs"><ArrowUpRight className="h-4 w-4" />{Number.isNaN(completedPercentage) ? 0 : completedPercentage}%</p>
                        </div>
                        <p className="text-xs font-semibold md:font-normal">Task Completed</p>
                    </div>
                </div>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle className="flex items-center"><ClipboardCheck className="h-8 w-8 mr-2" />Task Completed</DrawerTitle>
                    <DrawerDescription className="max-w-[700px] text-gray-500 text-xs">Completed tasks signify work items that have been successfully finished within the project. These tasks have reached their intended objectives and have been marked as finished. Reviewing completed tasks allows for reflecting on accomplishments and identifying areas for improvement in future tasks.</DrawerDescription>
                </DrawerHeader>
                <div className="px-2">
                    <ScrollArea>
                        <div className="p-4 space-y-4 max-h-96">
                            {filterTaskCompleted.map((item, index) => (
                                <div key={index} className={`${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-300 hover:bg-gray-400'} flex flex-col w-full space-y-2 rounded-md cursor-pointer transition p-4`}>
                                    <h1 className={`${theme === 'dark' ? 'bg-[#020817]' : 'bg-white'} text-xs w-fit p-2 rounded-2xl`}>Project:
                                        <span className="font-bold ml-1">

                                        </span>
                                    </h1>
                                    <div className="flex items-center space-x-2">
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
                                    <h1 className="font-semibold break-words">{item.title}</h1>
                                    <p className="text-gray-500 text-xs italic">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default CompletedTasks;