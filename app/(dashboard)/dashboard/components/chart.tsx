"use client";

import axios from 'axios';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface ChartProps {
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

const Chart: React.FC<ChartProps> = ({
  taskData
}) => {

  const { theme } = useTheme();

  useEffect(() => {
    const updateExpiredTasks = async () => {

      if (!Array.isArray(taskData)) {
        return;
      }

      const currentDate = new Date();
      for (const task of taskData) {
        if (task.dueDate && new Date(task.dueDate) < currentDate) {
          try {

            const addToArchive = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/addToArchive`, {
              taskId: task.id
            });

            if (addToArchive.data.success) {
              await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/updateTaskStatusToExpired`, {
                taskId: task.id,
                status: 'EXPIRED'
              });
            }

          } catch (error) {
            console.error(`Failed to update status for task ${task.id}`);
          }
        }
      }
    };

    updateExpiredTasks();
  }, [taskData]);

  const processData = () => {

    if (!taskData || taskData.length === 0) {
      return [];
    }
    const taskCounts = {
      '12 AM': { taskCompleted: 0, onGoingTasks: 0 },
      '4 AM': { taskCompleted: 0, onGoingTasks: 0 },
      '8 AM': { taskCompleted: 0, onGoingTasks: 0 },
      '12 PM': { taskCompleted: 0, onGoingTasks: 0 },
      '4 PM': { taskCompleted: 0, onGoingTasks: 0 },
      '8 PM': { taskCompleted: 0, onGoingTasks: 0 }
    };

    taskData.forEach(task => {
      const createdAt = new Date(task.createdAt);
      const updatedAt = new Date(task.updatedAt);
      const createdAtHour = createdAt.getHours();
      const updatedAtHour = updatedAt.getHours();
      const createdAtTimeSlot = getTimeSlot(createdAtHour);
      const updatedAtTimeSlot = getTimeSlot(updatedAtHour);

      if (task.status === 'PENDING') {
        taskCounts[createdAtTimeSlot].onGoingTasks++;
      } else if (task.status === 'ON_GOING' || task.status === 'IN_REVIEW') {
        taskCounts[updatedAtTimeSlot].onGoingTasks++;
      } else if (task.status === 'COMPLETED') {
        taskCounts[updatedAtTimeSlot].taskCompleted++;
      }
    });


    const dataArray = Object.entries(taskCounts).map(([name, { taskCompleted, onGoingTasks }]) => ({
      name,
      taskCompleted,
      onGoingTasks
    }));

    return dataArray;
  };


  const getTimeSlot = (hour: number) => {
    if (hour >= 0 && hour < 4) return '12 AM';
    else if (hour >= 4 && hour < 8) return '4 AM';
    else if (hour >= 8 && hour < 12) return '8 AM';
    else if (hour >= 12 && hour < 16) return '12 PM';
    else if (hour >= 16 && hour < 20) return '4 PM';
    else return '8 PM';
  };

  const data = processData();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return false;
  }

  const findProductive = () => {
    if (data.length === 0) {
      return 0;
    }

    const maxTaskCompletedEntry = data.reduce((prev, current) => {
      return (prev.taskCompleted > current.taskCompleted) ? prev : current;
    }, data[0]);

    return maxTaskCompletedEntry.taskCompleted + maxTaskCompletedEntry.onGoingTasks;
  };

  return (
    <div className='relative flex flex-col'>
      <div className="grid grid-cols-12">
        <div className="flex justify-between items-center col-span-12">
          <h1 className="text-lg font-semibold ml-0 md:ml-7 mb-4">Daily Productivity</h1>
          <div className="flex space-x-2 mb-4 pr-3">
            <div className="flex items-center space-x-1">
              <div className="bg-[#5B7553] h-2 w-2 rounded-full" />
              <p className="text-xs font-bold">Pending</p>
            </div>
            <div className="flex items-center space-x-1">
              <div className={`${theme === 'dark' ? 'bg-white' : 'bg-black'} h-2 w-2 rounded-full`} />
              <p className="text-xs font-bold">Completed</p>
            </div>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart className=' -translate-x-6 md:translate-x-0' data={data}>
          <XAxis fontSize={12} stroke={theme === 'dark' ? '#fafbfc' : '#000000'} tick={{ fill: '#6B7280' }} tickLine={false} dataKey="name" />
          <YAxis fontSize={12} stroke="#6B7280" tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
          <Bar cursor={'pointer'} barSize={5} radius={[10, 10, 0, 0]} dataKey="onGoingTasks" stackId="a" fill="#5B7553" />
          <Bar cursor={'pointer'} barSize={5} radius={[10, 10, 0, 0]} dataKey="taskCompleted" stackId="a" fill={theme === 'dark' ? '#fafbfc' : '#000000'} label={{
            position: 'top',
            formatter: (value: number) => (value === 0 ? '' : ''),
            style: {
              fontWeight: 'bolder',
              fontSize: 12,
              fill: '#6B7280',
              transform: 'translateY(-5px)'
            }
          }} />
        </BarChart>
      </ResponsiveContainer>
      {taskData === null
        &&
        <span className='absolute self-center ml-16 mt-32 text-sm text-gray-500 italic'>no task for now..</span>
      }
    </div>
  )
}

export default Chart;
