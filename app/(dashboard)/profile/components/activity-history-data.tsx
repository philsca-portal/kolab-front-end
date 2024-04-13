"use client";

import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { useTimeAgo } from 'next-timeago';

interface ActivityHistoryDataProps{
    data: {
        action: string;
        title: string | null;
        date: Date;
    };
}

const ActivityHistoryData: React.FC<ActivityHistoryDataProps> = ({
    data
}) => {

    const { theme } = useTheme();
    const { TimeAgo } = useTimeAgo();

    return(
        <div className="flex flex-col">
            <div className="p-4">
                <p className={`text-sm italic ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {data.action} -
                    <span className={`text-sm font-bold not-italic ${theme === 'dark' ? 'text-white' : 'text-black'} ml-2`}>{data.title}</span>
                    .
                </p>
                <p className={`ml-2 text-sm font-semibold italic ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    <TimeAgo date={data.date} locale='en' />
                </p>
            </div>
            <Separator />
        </div>
    )
}

export default ActivityHistoryData;