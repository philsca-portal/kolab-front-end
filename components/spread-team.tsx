"use client";

import { useTheme } from "next-themes";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Image from "next/image";
import SpreadMember from "./spread-member";
import { Session } from "next-auth";
import ViewAssignments from "./view-assignments";
import ViewMeeting from "./view-meeting";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface SpreadTeamProps {
    teamData: ({
        id: string;
        adminName: string;
        members: {
            TeamId: string;
            name: string;
            email: string;
            image: string;
            status: string;
        }[];
    } & {
        userId: string;
        teamName: string;
        teamIcon: string;
    });
    session: Session | null
}

const SpreadTeam: React.FC<SpreadTeamProps> = ({
    teamData,
    session
}) => {

    const { theme } = useTheme();

    return (
        <Dialog>
            <DialogTrigger className={`${theme === 'dark' ? 'hover:text-primary hover:bg-slate-800' : 'hover:text-primary hover:bg-slate-200'} text-muted-foreground text-xs font-semibold transition-colors flex items-center py-2 rounded-xl`}>
                <div className="relative flex items-center mx-1">
                    <Avatar className="mr-1 h-4 w-4">
                        <AvatarImage src={teamData.teamIcon} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    {teamData.teamName}
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <div className="flex items-center space-x-4">
                            <div className="relative h-40 w-40">
                                <Image className={`${theme === 'dark' ? 'ring-white' : 'ring-black'} aspect-square object-cover rounded-full ring`} sizes="100%" src={teamData.teamIcon} alt="alt Image" fill />
                            </div>
                            <div className="flex flex-col space-y-4">
                                <div>
                                    <h1 className="text-3xl">{teamData.teamName}</h1>
                                    <p className="text-xs">
                                        Admin: <span className="text-gray-500 italic">{teamData.adminName} {session?.user.userId === teamData.userId && '(you)'}</span>
                                    </p>
                                </div>
                                {session?.user.userId === teamData.userId &&
                                    <div className="flex space-x-2">
                                        <ViewAssignments session={session} teamData={teamData.userId} />
                                        <ViewMeeting session={session} teamDataUserId={teamData.userId} teamDataTeamId={teamData.id} />
                                    </div>
                                }
                            </div>
                        </div>
                    </DialogTitle>
                    <DialogDescription className="pt-4">
                        <div className="flex items-center space-x-1">
                            <span className={`${theme === 'dark' ? 'text-white' : 'text-black'} text-sm font-extrabold uppercase`}>Members:</span>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger className="cursor-pointer hover:scale-105" asChild>
                                        <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.877075 7.49972C0.877075 3.84204 3.84222 0.876892 7.49991 0.876892C11.1576 0.876892 14.1227 3.84204 14.1227 7.49972C14.1227 11.1574 11.1576 14.1226 7.49991 14.1226C3.84222 14.1226 0.877075 11.1574 0.877075 7.49972ZM7.49991 1.82689C4.36689 1.82689 1.82708 4.36671 1.82708 7.49972C1.82708 10.6327 4.36689 13.1726 7.49991 13.1726C10.6329 13.1726 13.1727 10.6327 13.1727 7.49972C13.1727 4.36671 10.6329 1.82689 7.49991 1.82689ZM8.24993 10.5C8.24993 10.9142 7.91414 11.25 7.49993 11.25C7.08571 11.25 6.74993 10.9142 6.74993 10.5C6.74993 10.0858 7.08571 9.75 7.49993 9.75C7.91414 9.75 8.24993 10.0858 8.24993 10.5ZM6.05003 6.25C6.05003 5.57211 6.63511 4.925 7.50003 4.925C8.36496 4.925 8.95003 5.57211 8.95003 6.25C8.95003 6.74118 8.68002 6.99212 8.21447 7.27494C8.16251 7.30651 8.10258 7.34131 8.03847 7.37854L8.03841 7.37858C7.85521 7.48497 7.63788 7.61119 7.47449 7.73849C7.23214 7.92732 6.95003 8.23198 6.95003 8.7C6.95004 9.00376 7.19628 9.25 7.50004 9.25C7.8024 9.25 8.04778 9.00601 8.05002 8.70417L8.05056 8.7033C8.05924 8.6896 8.08493 8.65735 8.15058 8.6062C8.25207 8.52712 8.36508 8.46163 8.51567 8.37436L8.51571 8.37433C8.59422 8.32883 8.68296 8.27741 8.78559 8.21506C9.32004 7.89038 10.05 7.35382 10.05 6.25C10.05 4.92789 8.93511 3.825 7.50003 3.825C6.06496 3.825 4.95003 4.92789 4.95003 6.25C4.95003 6.55376 5.19628 6.8 5.50003 6.8C5.80379 6.8 6.05003 6.55376 6.05003 6.25Z" fill="currentColor"></path></svg>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Note: If you already invited them, please wait for them to accept 😊.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </DialogDescription>
                    <SpreadMember teamData={teamData} />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default SpreadTeam;