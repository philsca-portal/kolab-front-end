import { TabsContent } from "@/components/ui/tabs"
import { $Enums } from "@/lib/enums";
import ToDo from "./to-do";
import OnGoing from "./on-going";
import InReview from "./in-review";
import { useState } from "react";
import { Session } from "next-auth";
import Complete from "./complete";
import Expired from "./expired";
import axios from "axios";
import toast from "react-hot-toast";
interface BacklogsProps {
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
    session: Session | null
}

const Backlogs: React.FC<BacklogsProps> = ({
    projectData,
    filteredTask,
    session
}) => {

    const [column, setColumn] = useState("");

    const handleMessageRead = async (taskId: string) => {
        try {
            if (taskId) {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messageRead`, {
                    userId: session?.user.userId,
                    taskId
                });

                if (response.data.success !== true) {
                    toast.error('Something went wrong. (Message)');
                }
            }

        } catch (error) {
            toast.error('Something went wrong.');
            console.log(error);
        }
    }

    return (
        <TabsContent className="mt-6" value="backlogs">
            <div className={`${session?.user.userId === projectData.userId ? 'grid grid-cols-5' : 'grid grid-cols-4'} gap-1`}>
                <ToDo session={session} column={column} setColumn={setColumn} projectData={projectData} filteredTask={filteredTask} handleMessageRead={handleMessageRead} />
                <OnGoing session={session} column={column} setColumn={setColumn} projectData={projectData} filteredTask={filteredTask} handleMessageRead={handleMessageRead} />
                <InReview session={session} column={column} setColumn={setColumn} projectData={projectData} filteredTask={filteredTask} handleMessageRead={handleMessageRead} />
                <Complete session={session} column={column} setColumn={setColumn} projectData={projectData} filteredTask={filteredTask} handleMessageRead={handleMessageRead}  />
                {session?.user.userId === projectData.userId && <Expired session={session} column={column} projectData={projectData} filteredTask={filteredTask} handleMessageRead={handleMessageRead} />}
            </div>
        </TabsContent>

    )
}

export default Backlogs;