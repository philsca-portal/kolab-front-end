import { $Enums } from '@/lib/enums';
import { create } from 'zustand';

type Data = {
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

type messageNotification = {
    notifications: Data[];
    addMessageNotification: (messageNotification: Data[]) => void;
}

const useMessageNotification = create<messageNotification>((set) => ({
    notifications: [],
    addMessageNotification: (messageNotification) => set({ notifications: messageNotification }),  
  }));
  
  export default useMessageNotification;