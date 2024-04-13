import toast from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Button } from "./button"
import { DropdownMenuItem } from "./dropdown-menu"
import { useTimeAgo } from "next-timeago";

interface TaskAssignedProps {
    theme: string | undefined;
    item: {
        id: string;
        sendersInfo: {
            id: string;
            name: string | null;
            hashedPassword: string | null;
            email: string | null;
            emailVerified: Date | null;
            image: string | null;
            bio: string | null;
            skill: string | null;
        } | null;
        teamId: string;
        userId: string;
        type: 'TASK_ASSIGNED' | 'INVITATION' | 'GENERAL';
        content: string;
        invitationStatus: string | null;
        status: 'READ' | 'UNREAD';
        createdAt: string;
    };
}

const TaskAssigned: React.FC<TaskAssignedProps> = ({
    theme,
    item
}) => {

    const { TimeAgo } = useTimeAgo();

    return (
        <DropdownMenuItem className="flex max-w-80">
            <div className="flex justify-start">
                <Avatar className={`${theme === 'dark' ? 'border-white' : 'border-black'} h-14 w-14 border mr-4`}>
                    <AvatarImage src={item.sendersInfo?.image ? item.sendersInfo?.image : ''} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <div>
                        <span className="mr-1 font-extrabold">{item.sendersInfo?.name}</span>
                        {item.content}.
                    </div>
                    <div className="text-gray-500 italic">
                        <TimeAgo date={item.createdAt} locale='en' />
                    </div>
                </div>
            </div>
        </DropdownMenuItem>
    )
}

export default TaskAssigned;