"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button";
import { ListFilter } from "lucide-react";
import Backlogs from "./backlogs";
import Overview from "./overview";
import AddTask from "./add-task";
import { $Enums } from "@/lib/enums";
import { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";

interface ProjectTabsProps {
    session: Session | null;
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
    completedTask: {
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
    }[]
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({
    session,
    projectData,
    completedTask
}) => {

    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [filterData, setFilterData] = useState<string[]>([]);
    const [data, setData] = useState<({
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
    })[]>(projectData.tasks);

    useEffect(() => {
        if (projectData.userId === session?.user?.userId) {
            const tags = projectData.tasks
                .map(item => item.tag)
                .filter(tag => tag !== null) as string[];

            setFilterData(tags);
        } else {
            const tags = projectData.tasks
                .filter(item => item.status !== "EXPIRED")
                .map(item => item.tag)
                .filter(tag => tag !== null) as string[];

            setFilterData(tags);
        }
    }, [projectData.tasks, projectData.userId, session?.user?.userId]);

    const filterItems = useCallback(() => {
        if (selectedFilters.length > 0) {
            let tempItems = selectedFilters.map((selectedItem) => {
                let temp = projectData.tasks.filter((item) => item.tag === selectedItem);
                return temp;
            });

            setData(tempItems.flat());
        } else {
            setData([...projectData.tasks]);
        }
    }, [selectedFilters, projectData.tasks, setData]);

    useEffect(() => {
        filterItems();
    }, [projectData, selectedFilters, filterItems]);

    const handleFilterButtonClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, item: string) => {
        if (selectedFilters.includes(item)) {
            let filters = selectedFilters.filter((el) => el !== item);
            setSelectedFilters(filters);
        } else {
            setSelectedFilters([...selectedFilters, item]);
        }
    }

    const totalUnreadAdminMessages = projectData.tasks.reduce((acc, task) => {
        const unreadMessages = task.messages.filter(message => message.adminStatus === "UNREAD");
        return acc + unreadMessages.length;
    }, 0);

    const totalUnreadAssigneeMessages = projectData.tasks.reduce((acc, task) => {
        const unreadMessages = task.messages.filter(message => message.assigneeStatus === "UNREAD" && task.status !== "EXPIRED");
        return acc + unreadMessages.length;
    }, 0);

    return (
        <Tabs defaultValue="account" className="w-[1150px] mt-4">
            <div className="flex justify-between">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger className="relative" value="backlogs">
                        Backlogs
                        {projectData.userId === session?.user.userId ?
                            totalUnreadAdminMessages > 0 && (
                                <div className="absolute -top-[2px] -right-1 h-4 w-4 bg-red-500 rounded-full text-center text-xs text-white">
                                    {totalUnreadAdminMessages}
                                </div>
                            )
                            :
                            totalUnreadAssigneeMessages > 0 && (
                                <div className="absolute -top-[2px] -right-1 h-4 w-4 bg-red-500 rounded-full text-center text-xs text-white">
                                    {totalUnreadAssigneeMessages}
                                </div>
                            )
                        }
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="backlogs" className="flex items-center mt-0 space-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={"outline"} size={"sm"}>
                                <ListFilter className="mr-1 h-4 w-4" />
                                Filter
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-fit">
                            {filterData.length != 0 ?
                                filterData.map((item, index) => (
                                    <DropdownMenuCheckboxItem
                                        key={index}
                                        onClick={(e) => handleFilterButtonClick(e, item)}
                                        checked={selectedFilters.includes(item)}
                                    >
                                        <h1 className={`${selectedFilters.includes(item) ? '' : 'text-gray-500'}`}>
                                            {item}
                                        </h1>
                                    </DropdownMenuCheckboxItem>
                                ))
                                :
                                <div className="px-2 italic text-gray-500">
                                    none
                                </div>
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {session?.user.userId === projectData.userId && <AddTask session={session} projectData={projectData} />}
                </TabsContent>
            </div>
            <Overview projectData={projectData} completedTask={completedTask} />
            <Backlogs session={session} projectData={projectData} filteredTask={data} />
        </Tabs>
    )
}

export default ProjectTabs;