"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { format } from "date-fns";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

interface TaskSchedulesProps{
    data: {
        name: string;
        description: string;
        date: Date;
        invitedUsers: {
            name: string | null;
            email: string | null;
            image: string | null;
        }[];
    }[]
}

const TaskSchedules: React.FC<TaskSchedulesProps> = ({
    data
}) => {

    const { theme } = useTheme();
    const [date, setDate] = useState<Date[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [filteredData, setFilteredData] = useState<{
        name: string;
        description: string;
        date: Date;
        invitedUsers: {
            name: string | null;
            email: string | null;
            image: string | null;
        }[];
    }[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        if (selectedDate) {
            const filterData = data.filter((item) => format(item.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd"));
            setFilteredData(filterData);
        }
    }, [selectedDate, data]);

    const firstTwoEvents = filteredData.slice(0, 2);

    useEffect(() => {
        setIsMounted(true);

        const getFiveDays = () => {
            const currentDate = new Date();
            const nextDates: Date[] = [];

            for(let i = 0; i <= 4; i++){
                const nextDate = new Date(currentDate);
                nextDate.setDate(currentDate.getDate() + i);
                nextDates.push(nextDate);
            }

            setDate(nextDates);
            setSelectedDate(nextDates[0]);
        }

        getFiveDays();

    },[]);

    const handleDateClick = (dateClicked: Date) => {
        if(dateClicked.toDateString().length !== 0){
            setSelectedDate(dateClicked);
        }
    };

    const timeDifference = useCallback((data: string) => {
        const currentDate = new Date();
        const comparedDate = new Date(data);
                
        const timeDifference = comparedDate.getTime() - currentDate.getTime();

        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        switch (true) {
            case (days === 0 && hours === 1):
                return hours + ' hr remaining';
            case (days === 0 && hours !== 0):
                return hours + ' hrs remaining';
            case (days === 1 && hours === 0):
                return days + ' day remaining';
            case (days !== 0 && hours === 0):
                return days + ' days remaining';
            case (days !== 0 && hours === 1):
                return days + ' days and ' + hours + ' hr remaining';
            default:
                return days + ' days and ' + hours + ' hrs remaining';
        }
    }, []);

    if(!isMounted){
        return false;
    }

    return(
        <div className={`${theme === 'dark' ? 'border text-white' : 'bg-gray-200 text-black'} flex flex-col p-4 rounded-2xl space-y-5`}>
            <div className="flex justify-center gap-2">
                {
                    date.map((data, index) => (
                        <div key={index} onClick={() => handleDateClick(data)} className={`${selectedDate?.toDateString() === data.toDateString() ? `${theme === 'dark' ? 'bg-[#5B7553] text-white' : 'bg-black text-white'}` : `${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-white'}`} flex flex-col w-12 h-14 rounded-2xl justify-center items-center space-y-1 cursor-pointer`}>
                            <p className="text-sm">{data.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                            <p className="text-sm font-semibold">{data.getDate()}</p>
                        </div>
                    ))
                }
            </div>
            <div className="space-y-4">
                {firstTwoEvents.length !== 0 ? 
                (firstTwoEvents.map((data, index) => (
                    <Sheet key={index}>
                        <SheetTrigger asChild>
                            <div className={`${theme === 'dark' ? ' bg-slate-800 ring-white' : 'bg-white ring-black'} flex flex-col rounded-xl hover:scale-105 hover:ring-1 cursor-pointer transition`}>
                                <div className="flex items-center p-3">
                                    <div className="flex flex-col space-y-1 w-3/4">
                                        <div className="text-xs font-semibold">{data.name}</div>
                                        <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-800'} text-[0.60rem]`}>{timeDifference(data.date.toString())}</div>
                                    </div>
                                    <div className="flex items-center ml-2 px-1 -space-x-1">
                                        {data.invitedUsers.slice(0, 3).map((item, index) => (
                                            <Avatar key={index} className={`${theme === 'dark' ? 'border-white' : 'border-black'} h-6 w-6 border`}>
                                                <AvatarImage src={item.image ? item.image : ''} />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                        ))}
                                        {data.invitedUsers.length >= 3 
                                             &&             
                                        <div className={`${theme === 'dark' ? 'bg-[#020817]' : 'bg-gray-200'} flex justify-center items-center rounded-full h-4 w-4 text-[0.50rem] z-10`}>
                                            <div className={`${theme === 'dark' ? 'text-white' : 'text-black' } font-semibold`}>{data.invitedUsers.length >= 4 && filteredData.length - 3}</div>
                                        </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <div className="space-y-2">
                                    <SheetTitle className="text-2xl">{data.name}</SheetTitle>
                                    <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-800'} italic text-xs`}>
                                        {timeDifference(data.date.toString())}
                                    </div>
                                </div>
                                <div className="space-y-2 text-muted-foreground pt-4">
                                    <div className="text-sm font-extrabold uppercase">Description:</div>
                                    <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-200'} p-2 rounded-xl`}>
                                        {data.description}
                                    </div>
                                </div>
                            </SheetHeader>
                            <div className="flex flex-col space-y-2 mt-4">
                                <div className="text-sm font-extrabold uppercase">Invited:</div>
                                <div className="flex flex-col">
                                    {data.invitedUsers.map((item,index) => (
                                        <div className="flex items-center space-x-2" key={index}>
                                            <Avatar className={`${theme === 'dark' ? 'border-white' : 'border-black'} h-8 w-8 border`}>
                                                <AvatarImage src={item.image ? item.image : ''} />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar> 
                                            <div className="flex flex-col">
                                                <div className="text-sm">{item.name}</div>
                                                <div className="text-[0.65rem] text-gray-500">{item.email}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                )))
                :
                (
                    <div className="h-[171px] flex items-center justify-center">
                        <p className="text-sm text-gray-500">There is no meeting/s for this date..</p>
                    </div>
                )}
                {filteredData.length >= 3 
                    &&          
                <Dialog>
                    <DialogTrigger className={`${theme === 'dark' ? 'bg-slate-800 ring-white' : 'bg-white ring-black'} w-fit p-1 rounded-xl hover:ring-1 ring-white cursor-pointer transition`} asChild>
                    <p className="text-[0.60rem] font-semibold">+ {filteredData.length >= 3 && filteredData.length - 2} more</p>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>All Meetings</DialogTitle>
                            <DialogDescription>
                                Today&apos;s Meetings: See all your scheduled meetings for the day.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            {filteredData.map((data, index) => (
                                <Sheet key={index}>
                                <SheetTrigger asChild>
                                    <div className={`${theme === 'dark' ? ' bg-slate-800 ring-white' : 'bg-white ring-black'} flex flex-col rounded-xl hover:scale-105 hover:ring-1 cursor-pointer transition`}>
                                        <div className="flex items-center p-3">
                                            <div className="flex flex-col space-y-1 w-3/4">
                                                <div className="text-xs font-semibold">{data.name}</div>
                                                <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-800'} text-[0.60rem]`}>{timeDifference(data.date.toString())}</div>
                                            </div>
                                            <div className="flex items-center ml-2 px-1 -space-x-1">
                                                {data.invitedUsers.slice(0, 3).map((item, index) => (
                                                    <Avatar key={index} className={`${theme === 'dark' ? 'border-white' : 'border-black'} h-6 w-6 border`}>
                                                        <AvatarImage src={item.image ? item.image : ''} />
                                                        <AvatarFallback>CN</AvatarFallback>
                                                    </Avatar>
                                                ))}
                                                {data.invitedUsers.length >= 3 
                                                     &&             
                                                <div className={`${theme === 'dark' ? 'bg-[#020817]' : 'bg-gray-200'} flex justify-center items-center rounded-full h-4 w-4 text-[0.50rem] z-10`}>
                                                    <div className={`${theme === 'dark' ? 'text-white' : 'text-black' } font-semibold`}>{data.invitedUsers.length >= 4 && filteredData.length - 3}</div>
                                                </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <div className="space-y-2">
                                            <SheetTitle className="text-2xl">{data.name}</SheetTitle>
                                            <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-800'} italic text-xs`}>
                                                {timeDifference(data.date.toString())}
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-muted-foreground pt-4">
                                            <div className="text-sm font-extrabold uppercase">Description:</div>
                                            <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-200'} p-2 rounded-xl`}>
                                                {data.description}
                                            </div>
                                        </div>
                                    </SheetHeader>
                                    <div className="flex flex-col space-y-2 mt-4">
                                        <div className="text-sm font-extrabold uppercase">Invited:</div>
                                        <div className="flex flex-col">
                                            {data.invitedUsers.map((item,index) => (
                                                <div className="flex items-center space-x-2" key={index}>
                                                    <Avatar className={`${theme === 'dark' ? 'border-white' : 'border-black'} h-8 w-8 border`}>
                                                        <AvatarImage src={item.image ? item.image : ''} />
                                                        <AvatarFallback>CN</AvatarFallback>
                                                    </Avatar> 
                                                    <div className="flex flex-col">
                                                        <div className="text-sm">{item.name}</div>
                                                        <div className="text-[0.65rem] text-gray-500">{item.email}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                            ))}
                        </div> 
                    </DialogContent>
                </Dialog>
                }
            </div>
        </div>
    )
}

export default TaskSchedules;