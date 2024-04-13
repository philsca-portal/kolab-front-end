import { $Enums } from "@/lib/enums";
import { useTheme } from "next-themes";
import { PieChart, Pie, Sector, Cell, Tooltip } from "recharts";

interface TaskCountMap {
    [key: string]: number;
}

interface OverviewGraphProps {
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

const OverviewGraph: React.FC<OverviewGraphProps> = ({
    projectData,
    completedTask
}) => {
    const { theme } = useTheme();

    const statusCategories: { [key: string]: string } = {
        "PENDING": "On-going tasks",
        "ON_GOING": "On-going tasks",
        "IN_REVIEW": "On-going tasks",
        "COMPLETED": "Completed tasks",
        "EXPIRED": "Expired tasks"
    };

    const categoryColors: { [key: string]: string } = {
        "On-going tasks": "#5b7553",
        "Expired tasks": "#4b5563",
        "Completed tasks": `${theme === 'dark' ? "#ffffff" : "#000000"}`
    };

    const ongoingTaskCountMap: TaskCountMap = projectData.tasks.reduce((countMap: TaskCountMap, task) => {
        const category = statusCategories[task.status];
        if (category === "On-going tasks") {
            countMap[category] = (countMap[category] || 0) + 1;
        }
        return countMap;
    }, {});

    const completedTaskCountMap: TaskCountMap = completedTask.reduce((countMap: TaskCountMap, task) => {
        countMap["Completed tasks"] = (countMap["Completed tasks"] || 0) + 1;
        return countMap;
    }, {});

    const taskCountMap: TaskCountMap = {
        ...ongoingTaskCountMap,
        ...completedTaskCountMap
    };

    const data = Object.keys(taskCountMap).map(category => ({
        category,
        value: taskCountMap[category]
    }));

    return (
        <div className="col-span-5 flex flex-col rounded-lg border">
            <h1 className="font-extrabold uppercase mt-4 ml-4">Task Overview</h1>
            <PieChart width={575} height={350}>
                <Pie
                    data={data}
                    cx={280}
                    cy={160}
                    innerRadius={110}
                    outerRadius={150}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="category"
                    animationBegin={0}
                    animationDuration={1000}
                    animationEasing="ease-in-out"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`}
                            fill={categoryColors[entry.category]}
                            stroke={categoryColors[entry.category]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: "#cdcdcd",
                        padding: "10px",
                        borderRadius: "5px",
                        WebkitTextFillColor: "#000000"
                    }}
                />
            </PieChart>
        </div>
    )
}

export default OverviewGraph;