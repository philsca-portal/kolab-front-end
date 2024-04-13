"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import General from "@/components/ui/general";
import Invitation from "@/components/ui/invitation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import TaskAssigned from "@/components/ui/taskAssigned";
import axios from "axios";
import { BellRing, MessageCircle } from "lucide-react";
import { Session } from "next-auth";
import { useTheme } from "next-themes";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";

type Notification = {
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

interface UpperDashboardProps {
  data: Notification[];
  session: Session | null;

}

const UpperDashboard: React.FC<UpperDashboardProps> = ({
  data,
  session
}) => {

  const { theme } = useTheme();
  const [open, setOpen] = useState(false);

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      setOpen(false);
    }
  }

  const viewNotification = async () => {
    try {
      setOpen(true);

      const status = "READ";
      const userId = session?.user.userId;

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/changeStatus`, {
        status,
        userId
      });

      if (response.data.success === false) {
        toast.error('Something went wrong.');
      }

    } catch (error) {
      console.log(error);
    }
  }

  const sortedNotifications = data.sort((a, b) => {
    // Convert createdAt strings to Date objects and compare
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="grid grid-cols-12 h-full">
      <div className="col-span-9 space-y-2">
        <h1 className="text-4xl font-semibold">Hello,</h1>
        <h1 className="text-4xl font-light">{session?.user.name}</h1>
        <p className="text-md text-gray-500">Let&apos;s check how my day goes.</p>
      </div>
      <div className="col-span-3">
        <div className="flex justify-end space-x-2">
          <div className="w-fit hover:scale-110 cursor-pointer transition-all">
            <DropdownMenu open={open} onOpenChange={handleOnOpenChange}>
              <DropdownMenuTrigger onClick={viewNotification} asChild>
                <div className="relative border rounded-full">
                  <BellRing className="h-5 w-5 m-2" />
                  {data.filter(item => item.status === "UNREAD").length !== 0
                    &&
                    <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-center text-xs text-white">
                      {data.filter(item => item.status === "UNREAD").length}
                    </div>
                  }
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea>
                  <div className="max-h-[500px]">
                    {sortedNotifications.map((item, index) => (
                      <Fragment key={index}>
                        {item.type === 'INVITATION' && (
                          <Invitation session={session} theme={theme} item={item} />
                        )}
                        {item.type === 'GENERAL' && (
                          <General theme={theme} item={item} />
                        )}
                        {item.type === 'TASK_ASSIGNED' && (
                          <TaskAssigned theme={theme} item={item} />
                        )}
                        <Separator />
                      </Fragment>
                    ))}
                  </div>
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpperDashboard;