import { TabsContent } from "@/components/ui/tabs"
import OverviewGraph from "./overview-graph";
import { $Enums } from "@/lib/enums";
import { useTheme } from "next-themes";
import { ArrowUpRight } from "lucide-react";
import { useTimeAgo } from "next-timeago";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface OverviewProps {
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

const Overview: React.FC<OverviewProps> = ({
    projectData,
    completedTask
}) => {

    const { theme } = useTheme();
    const { TimeAgo } = useTimeAgo();

    const completedPercentage = projectData.tasks.length === 0 ? Math.round((completedTask?.length) / (completedTask.length) * 100) : Math.round((completedTask?.length) / (projectData.tasks?.length + completedTask.length) * 100);

    const filterOnGoing = projectData.tasks.filter((data) => data.status === "PENDING" || data.status === "ON_GOING" || data.status === "IN_REVIEW") ?? [];
    const onGoingPercentage = Math.round((filterOnGoing.length / (projectData.tasks?.length + completedTask.length)) * 100);

    const filterExpired = projectData.tasks.filter((data) => data.status === "EXPIRED") ?? [];
    const expiredPercentage = Math.round((filterExpired.length / (projectData.tasks?.length + completedTask.length)) * 100);

    return (
        <TabsContent className="mt-6" value="overview">
            <div className="grid grid-cols-10">
                <OverviewGraph completedTask={completedTask} projectData={projectData} />
                <div className="col-span-5 flex flex-col gap-6">
                    <div className="flex justify-evenly">
                        <div className={`${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'} flex justify-center items-center h-28 w-40 rounded-2xl px-5 py-3 space-y-2`}>
                            <div>
                                <div className="flex justify-between items-center">
                                    <h1 className="text-3xl font-semibold">{completedTask.length}</h1>
                                    <p className="flex text-xs"><ArrowUpRight className="h-4 w-4" />{Number.isNaN(completedPercentage) ? 0 : completedPercentage}%</p>
                                </div>
                                <p className="text-xs">Task Completed</p>
                            </div>
                        </div>
                        <div className="bg-[#5B7553] text-white flex justify-center items-center h-28 w-40 rounded-2xl px-6 py-4 space-y-2">
                            <div>
                                <div className="flex justify-between items-center">
                                    <h1 className="text-3xl font-semibold">{filterOnGoing.length}</h1>
                                    <p className="flex text-xs"><ArrowUpRight className="h-4 w-4" />{Number.isNaN(onGoingPercentage) ? 0 : onGoingPercentage}%</p>
                                </div>
                                <p className="text-xs">On-going Tasks</p>
                            </div>
                        </div>
                        <div className={`${theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-gray-200'} text-black flex justify-center items-center h-28 w-40 rounded-2xl px-6 py-4 space-y-2`}>
                            <div>
                                <div className="flex justify-between items-center">
                                    <h1 className="text-3xl font-semibold">{filterExpired.length}</h1>
                                    <p className="flex text-xs"><ArrowUpRight className="h-4 w-4" />{Number.isNaN(expiredPercentage) ? 0 : expiredPercentage}%</p>
                                </div>
                                <p className="text-xs">Expired Tasks</p>
                            </div>
                        </div>
                    </div>
                    <div className="px-6">
                        <div className="flex flex-col border rounded-lg h-64 px-2">
                            <h1 className="font-extrabold uppercase mt-4 ml-6">Done Activity</h1>
                            <ScrollArea className="p-6 max-h-42">
                                {completedTask.length != 0 ?
                                    completedTask.map((item, index) => (
                                        <div key={index} className="flex flex-col space-y-2 border rounded-lg p-2">
                                            <div className="flex flex-col gap-2">
                                                <p className={`text-sm font-bold not-italic uppercase ${theme === 'dark' ? 'text-white' : 'text-black'} flex flex-col gap-1`}>
                                                    {item.title}:
                                                    <span className={`text-xs italic lowercase font-normal ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{item.description}.</span>
                                                </p>
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src={projectData.members?.find((data) => data.id === item.assignedTo)?.image} alt="@shadcn" />
                                                    <AvatarFallback>CN</AvatarFallback>
                                                </Avatar>
                                                <p className={`text-xs font-normal italic ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    <TimeAgo date={item.createdAt} locale='en' />
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                    :
                                    <div className="flex justify-center italic text-sm text-gray-500">
                                        There is no completed activity for now..
                                    </div>
                                }
                            </ScrollArea>
                        </div>
                    </div>
                </div>
            </div>
        </TabsContent>
    )
}

export default Overview;