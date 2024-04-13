"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Image from "next/image";
import KolabLogoLight from "@/public/images/kolab-logo-light.png";
import { Badge } from "@/components/ui/badge";
import { Session } from "next-auth";
import { useTimeAgo } from "next-timeago";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ActiveSessionProps{
    existingSettingsData1: {
        userId: any;
        OS: string | null;
        browserUsed: string | null;
        IpAddress: string | null;
        date: Date;
        expires: Date;
    }[] | null
    session: Session | null
}

const ActiveSessions: React.FC<ActiveSessionProps> = ({
    existingSettingsData1,
    session
}) => {
    const router = useRouter();
    const { TimeAgo } = useTimeAgo();
    const deleteSession = async (userId: any, expires: Date, date: Date) => {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/deleteSession`, {
            userId,
            expires,
            date
        });

        if(response.data.success){
            toast.success('Device signed out.');
            router.refresh();
        }else{
            toast.error('Something went wrong.');
        }
    }
    return(
        <div className="lg:w-1/2 w-full">
            {existingSettingsData1?.sort((a, b) => {
                if (a.expires.toString() === session?.user.sessionExpires) {
                    return -1; 
                } else if (b.expires.toString() === session?.user.sessionExpires) {
                    return 1; 
                } else {
                    return 0; 
                }
            }).map((activeSession, index) => (
                <Accordion key={index} type="single" collapsible className="w-full">
                    <AccordionItem value={index.toString()} className="border-none">
                        <AccordionTrigger>
                            <div className="px-4 grid grid-cols-8 space-x-8 w-full">
                                <div className="col-span-2">
                                    <Image src={KolabLogoLight} alt="" height={80} width={80} priority />
                                </div>
                                <div className="col-span-6 flex-col">
                                    <div className="flex space-x-2 items-center">
                                        <h1 className="text-xs md:text-sm font-extrabold uppercase">{activeSession.OS}</h1>
                                        {activeSession?.expires.toString() === session?.user.sessionExpires ?   <Badge variant="outline">This device</Badge> : ''}
                                        </div>
                                    <div className="flex-col italic text-xs md:text-sm text-gray-400">
                                        <p className="w-fit">{activeSession.browserUsed}</p>
                                        <p className="w-fit">{activeSession.IpAddress}</p>
                                        <p className="w-fit">
                                            <TimeAgo date={activeSession.date} locale='en' />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="flex-col px-4">
                                {activeSession?.expires.toString() === session?.user.sessionExpires ? <h1 className="text-xs md:text-sm font-extrabold uppercase">Current device</h1> : <h1 className="text-xs md:text-sm font-extrabold uppercase">Sign out</h1>}
                                {activeSession?.expires.toString() === session?.user.sessionExpires ? <p className="italic text-xs md:text-sm text-gray-400">This is the device you are currently using.</p> : <p className="italic text-xs md:text-sm text-gray-400">Sign out from your account on this device.</p>}
                                {activeSession?.expires.toString() === session?.user.sessionExpires ?  '' : <Button onClick={() => deleteSession(activeSession.userId, activeSession.expires ,activeSession.date)} className="text-xs md:text-sm mt-4" variant={"destructive"}>Sign out from this device</Button> }
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion> 
            ))}
        </div>
    )
}

export default ActiveSessions;