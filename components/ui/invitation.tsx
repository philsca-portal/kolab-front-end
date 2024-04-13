
import toast from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Button } from "./button"
import { DropdownMenuItem } from "./dropdown-menu"
import axios from "axios";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useTimeAgo } from "next-timeago";

interface InvitationProps {
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
    session: Session | null;
}

const Invitation: React.FC<InvitationProps> = ({
    theme,
    item,
    session
}) => {

    const router = useRouter();
    const { TimeAgo } = useTimeAgo();
    const Accept = async () => {
        try {
            const convertStatus = "MEMBER";
            const invStatus = "ACCEPTED";
            const teamId = item.teamId;
            const userId = session?.user.userId;
            const email = session?.user.email;
            const notificationId = item.id;

            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/changeStatusToMember`, {
                teamId,
                convertStatus,
                email
            });

            if (response.data.success === true) {
                const invitationStatus = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/changeStatusToAccepted`, {
                    invStatus,
                    notificationId
                });

                if (invitationStatus.data.success === true) {

                    const createNotificationForAccepting = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/createNotificationForAccepting`, {
                        teamId,
                        userId
                    });

                    if (createNotificationForAccepting.data.success === true) {
                        toast.success('You accepted the request.');
                        router.refresh();
                    } else {
                        toast.error('Something went wrong.(Notification)');
                    }
                } else {
                    toast.error('Something went wrong.(Invitation)');
                }
            } else {
                toast.error('Something went wrong.(Member Status)');
            }

        } catch (error) {
            console.log(error);
            toast.error('Something went wrong.');
        }
    }

    return (
        <DropdownMenuItem className="flex flex-col max-w-80">
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
            {item.invitationStatus === 'ACCEPTED' ?
                <div className="text-gray-500 italic">
                    Request accepted
                </div>
                :
                <div className="flex space-x-3">
                    <Button onClick={Accept} size={'sm'}>Accept</Button>
                    <Button variant={"destructive"} size={'sm'}>Reject</Button>
                </div>
            }
        </DropdownMenuItem>
    )
}

export default Invitation;