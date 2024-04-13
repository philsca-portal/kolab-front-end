"use client";

import { MessageSquareDashed } from "lucide-react";
import { Button } from "./ui/button";
import { DialogHeader, Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";
import { DataTable } from "./tasks-table/data-table";
import { Task, columns } from "./tasks-table/columns";
import { Session } from "next-auth";
import {useState } from "react";
import axios from "axios";
import { format } from "date-fns";


interface ViewMeetingProps{
    session: Session | null;
    teamDataUserId: string;
    teamDataTeamId: string;
}

const ViewMeeting: React.FC<ViewMeetingProps> = ({
    session,
    teamDataUserId,
    teamDataTeamId,
}) => {

    const [openTable, setOpenTable] = useState(false);

    const handleOpenTableChange = (open: boolean) => {
        if(!open){
            setOpenTable(false);
        }
    }

    const [data, setData] = useState<Task[]>([]);

    const fetchData = async () => {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getMeeting`, {
            teamDataTeamId
        });

        if(response.data.success){
            setData(response.data.transformedMeetingsData);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const formattedData: Task[] = data.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        startdate: format(item.startdate, "MMM. dd, yyyy hh:mm aa"),
        enddate: format(item.enddate, "MMM. dd, yyyy hh:mm aa"),
    }));

    return(
        <Dialog open={openTable} onOpenChange={handleOpenTableChange}>
            <DialogTrigger onClick={() => setOpenTable(true)} asChild>
                <Button onClick={fetchData} className="text-xs" variant="secondary" size={"sm"}><MessageSquareDashed className="h-4 w-4 mr-2" />View Meetings</Button>
            </DialogTrigger>
            <DialogContent className="max-w-max">
                <DialogHeader>
                    <DialogTitle className="font-bold">Meetings</DialogTitle>
                    <DialogDescription>
                    {session?.user.userId === teamDataUserId ? "Here's the list of meetings in your team!" :  "Here's the list of your meetings!"}
                    </DialogDescription>
                </DialogHeader>
                <DataTable session={session} teamDataTeamId={teamDataTeamId} columns={columns({setOpenTable})} data={formattedData} setOpenTable={setOpenTable} />
            </DialogContent>
        </Dialog>
    )  
}

export default ViewMeeting;