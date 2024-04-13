"use client";

import { Separator } from "@/components/ui/separator";
import { Settings as Gear } from "lucide-react";
import SettingsOptions from "./components/settings-options";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import axios from "axios";

interface SettingsProps {
    session: Session | null
}

const Settings: React.FC<SettingsProps> = ({
    session
}) => {

    const [existingSettingsData, setExistingSettingsData] = useState<{
        id: string;
        userId: string;
        notificationSound: string | null;
        muteDuration: string | null;
    } | null>(null);

    const [existingSettingsData1, setExistingSettingsData1] = useState<{
        userId: any;
        OS: string | null;
        browserUsed: string | null;
        IpAddress: string | null;
        date: Date;
        expires: Date;
    }[] | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settingsData`, {
                    userId: session?.user.userId
                });

                if (response.status === 200 && response.data?.existingSettingsData !== undefined && response.data?.existingSettingsData1 !== undefined) {
                    setExistingSettingsData(response.data.existingSettingsData);
                    setExistingSettingsData1(response.data.existingSettingsData1);
                } else {
                    console.error('Failed to fetch settings data.');
                }
            } catch (error) {
                console.error('Error fetching settings data:', error);
            }
        };

        fetchData();
    }, [session, setExistingSettingsData, setExistingSettingsData1]);

    return (
        <div className="py-8 space-y-8 h-full">
            <div className="space-y-6">
                <div>
                    <h1 className="flex items-center text-2xl md:text-3xl uppercase font-extrabold">
                        <Gear className="h-6 w-6 mr-1 md:h-8 Md:w-8 md:mr-2" />
                        Settings
                    </h1>
                    <p className="font-bold text-sm md:text-md text-gray-400 ml-8 md:ml-10">Configure general settings for your instance</p>
                </div>
                <Separator orientation="horizontal" />
                <div>
                    <SettingsOptions session={session} existingSettingsData={existingSettingsData} existingSettingsData1={existingSettingsData1} />
                </div>
            </div>
        </div>
    )
}

export default Settings;