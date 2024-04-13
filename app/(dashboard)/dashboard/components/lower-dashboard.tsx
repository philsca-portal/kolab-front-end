"use client";

import { useEffect, useState } from "react";
import DatePicker from "./date-picker";
import Timeline from "./timeline";
import { format } from "date-fns";
import { io } from "socket.io-client";
import { Session } from "next-auth";

interface LowerDashboardProps{
    data: {
        id: string;
        TeamId: string;
        meetingName: string;
        description: string;
        startDate: Date;
        endDate: Date;
        createdAt: Date;
    }[]
}

const LowerDashboard: React.FC<LowerDashboardProps> = ({
    data
}) => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const formattedDate = date && format(date, 'yyyy-MM-dd');

    const meetings = data.map((item) => ({
        x: [item.startDate, item.endDate],
        y: item.meetingName,
        z: item.description
    }));
    
    return(
        <div className="grid grid-cols-12 h-full">
            <div className="col-span-12">
                <div className="flex items-center justify-between px-7">
                    <h1 className="text-lg font-semibold">Today&apos;s Schedule</h1>
                    <div>
                        <DatePicker date={date} setDate={setDate} />  
                    </div>
                </div>
                <div>
                    <div>
                        <Timeline data={meetings} date={formattedDate} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LowerDashboard;