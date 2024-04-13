import { $Enums } from "@/lib/enums";
import Chart from "./chart";
import Legend from "./legend";
import TaskSchedules from "./task-schedules";

interface MiddleDashboardProps {
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
  data: {
    name: string;
    description: string;
    date: Date;
    invitedUsers: {
      name: string | null;
      email: string | null;
      image: string | null;
    }[];
  }[];
}

const MiddleDashboard: React.FC<MiddleDashboardProps> = ({
  completedTaskData,
  taskData,
  data
}) => {

  return (
    <div className="grid grid-cols-12 h-full gap-5 md:gap-0">
      <div className="flex flex-col-reverse gap-10 col-span-12 md:gap-0 md:col-span-9 md:grid md:grid-cols-9">
        <div className="col-span-6">
          <Chart taskData={taskData} />
        </div>
        <div className="col-span-3">
          <Legend completedTaskData={completedTaskData} taskData={taskData} />
        </div>
      </div>
      <div className="col-span-12 md:col-span-3">
        <TaskSchedules data={data} />
      </div>
    </div>
  )
}

export default MiddleDashboard;