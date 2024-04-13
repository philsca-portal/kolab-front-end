"use client";

import { useEffect, useState } from "react";
import ExpiredTasks from "./expired-tasks";
import OngoingTasks from "./ongoing-task";
import CompletedTasks from "./completed-tasks";
import { $Enums } from "@/lib/enums";

interface legendProps {
  completedTaskData: {
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
  taskData: {
    id: string;
    projectId: string;
    projectName: string;
    assignedTo: string | null;
    title: string;
    description: string | null;
    tag: string | null;
    status: string;
    priority: string;
    dueDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

const Legend: React.FC<legendProps> = ({
  completedTaskData,
  taskData
}) => {

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const filterOnGoing = taskData?.filter((data) => data.status === "PENDING" || data.status === "ON_GOING" || data.status === "IN_REVIEW") ?? [];
  const filterTaskCompleted = completedTaskData ?? [];
  const filterExpired = taskData?.filter((data) => data.status === "EXPIRED") ?? [];

  const onGoingPercentage = Math.round((filterOnGoing.length / (taskData?.length ?? 1)) * 100);
  const completedPercentage = Math.round((filterTaskCompleted.length / (taskData?.length ?? 1)) * 100);
  const expiredPercentage = Math.round((filterExpired.length / (taskData?.length ?? 1)) * 100);

  return (
    <div className="flex justify-center gap-4 h-36 md:flex-col md:h-auto md:w-auto md:px-12">
      <CompletedTasks filterTaskCompleted={filterTaskCompleted} completedPercentage={completedPercentage} />
      <OngoingTasks filterOnGoing={filterOnGoing} onGoingPercentage={onGoingPercentage} />
      <ExpiredTasks filterExpired={filterExpired} expiredPercentage={expiredPercentage} />
    </div>
  )
}

export default Legend;