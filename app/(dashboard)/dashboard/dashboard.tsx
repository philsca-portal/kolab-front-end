"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { Session } from "next-auth";
import Bowser from "bowser";
import { io } from "socket.io-client";
import UpperDashboard from "./components/upper-dashboard";
import MiddleDashboard from "./components/middle-dashboard";
import LowerDashboard from "./components/lower-dashboard";
import useNotification from "@/hook/use-notification";
import { $Enums } from "@/lib/enums";

interface DashboardProps {
  session: Session | null
}

const Dashboard: React.FC<DashboardProps> = ({
  session
}) => {

  const searchParams = useSearchParams();
  const [meetingDates, setMeetingDates] = useState<{
    id: string;
    TeamId: string;
    meetingName: string;
    description: string;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
  }[]>([]);

  const [meetingDatesWithUser, setMeetingDatesWithUser] = useState<{
    name: string;
    description: string;
    date: Date;
    invitedUsers: {
      name: string | null;
      email: string | null;
      image: string | null;
    }[];
  }[]>([]);

  const [taskData, setTaskData] = useState<{
    id: string;
    projectId: string;
    projectName: string;
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

  const { notifications } = useNotification();

  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);

    socket.emit('deleteMeetingData');

    socket.on('deleteMeetingData', (deletedMeetings) => {
    });

    socket.emit('completedTask', session?.user.email);

    socket.on('completedTask', (completedtask) => {
      setCompletedTask(completedtask);
    });

    socket.emit('taskData', session?.user.email);

    socket.on('taskData', (taskData) => {
      setTaskData(taskData);
    });

    socket.emit('meetingUpdate', session?.user.email, session?.user.userId);

    socket.on('meetingUpdate', (meetingData) => {
      setMeetingDates(meetingData);
    });

    socket.emit('meetingUpdateWithUsers', session?.user.email, session?.user.userId);

    socket.on('meetingUpdateWithUsers', (meetingDataWithUser) => {
      setMeetingDatesWithUser(meetingDataWithUser);
    });

    return () => {
      socket.disconnect();
    }
  }, [session?.user.email, session?.user.userId]);

  useEffect(() => {
    if (searchParams.get("redirected")) {
      toast.error('Your account is provided by Google.');
    }

    function getOSName() {
      const OS = Bowser.getParser(window.navigator.userAgent);
      return OS.getOSName();
    }

    function getBrowserName() {
      const browser = Bowser.getParser(window.navigator.userAgent);
      return browser.getBrowserName();
    }

    const fetchData = async () => {
      const email = session?.user.email;
      const expireDate = session?.user.sessionExpires;
      const OS = getOSName();
      const Browser = getBrowserName();

      if (searchParams.get("authenticated")) {
        try {
          await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/activeSession`, {
            email,
            expireDate,
            OS,
            Browser
          });
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchData();
  }, [searchParams, session?.user.email, session?.user.sessionExpires]);

  return (
    <div className="flex-col space-y-10">
      <UpperDashboard session={session} data={notifications} />
      <MiddleDashboard completedTaskData={completedTask} taskData={taskData} data={meetingDatesWithUser} />
      <LowerDashboard data={meetingDates} />
    </div>
  )
}

export default Dashboard;