"use client";

import { useTheme } from "next-themes";
import SoundsOption from "./sounds-option";
import Mute from "./mute";
import { useEffect, useRef, useState } from "react";
import stopSoundFx from "@/public/sounds/stopSoundFx.mp3";
import shootingSoundFx from "@/public/sounds/shootingSoundFx.mp3";
import notificationEmailFx from "@/public/sounds/notificationEmailFx.mp3";
import notificationSoundFx from "@/public/sounds/notificationSoundFx.mp3";
import silenceSoundFx from "@/public/sounds/silenceSoundFx.mp3"
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Session } from "next-auth";
import ActiveSessions from "./active-session";
import DeleteSection from "./delete-section";

interface SettingsOptionsProps{
    existingSettingsData: {
        id: string;
        userId: string;
        notificationSound: string | null;
        muteDuration: string | null;
    } | null;
    existingSettingsData1: {
        userId: any;
        OS: string | null;
        browserUsed: string | null;
        IpAddress: string | null;
        date: Date;
        expires: Date;
    }[] | null
    session: Session | null;
}

const formSchema = z.object({
    sounds: z.string(),
    mute: z.string()
});

const SettingsOptions: React.FC<SettingsOptionsProps> = ({
    existingSettingsData,
    existingSettingsData1,
    session
}) => {

    const { theme } = useTheme();
    const [isMuted, setIsMuted] = useState(false);
    const [isSwitch, setIsSwitch] = useState(false);
    const [removeMuteDialog,setRemoveMuteDialog] = useState(false);
    const audioPlayer = useRef<HTMLAudioElement | null>(null);

    type SettingsFormValues = z.infer<typeof formSchema>;

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            sounds: '',
            mute: ''
        }
    });

    useEffect(() => {

        if (existingSettingsData) {
            form.setValue('sounds', existingSettingsData.notificationSound || '');
            form.setValue('mute', existingSettingsData.muteDuration || '');
        }

        if(existingSettingsData?.muteDuration !== null){
            setIsMuted(true);
        }else{
            setIsMuted(false);
        }
        
    }, [existingSettingsData, form]);

    const handleSoundChange = (value: string) => {
        if (value === 'none' && audioPlayer.current) {
            audioPlayer.current.src = silenceSoundFx
            audioPlayer.current.play();
        }

        if (value === 'stopSoundFx' && audioPlayer.current) {
            audioPlayer.current.src = stopSoundFx
            audioPlayer.current.play();
        }

        if(value === 'shootingSoundFx' && audioPlayer.current){
            audioPlayer.current.src = shootingSoundFx
            audioPlayer.current.play();
        }

        if(value === 'notificationEmailFx' && audioPlayer.current){
            audioPlayer.current.src = notificationEmailFx
            audioPlayer.current.play();
        }

        if(value === 'notificationSoundFx' && audioPlayer.current){
            audioPlayer.current.src = notificationSoundFx
            audioPlayer.current.play();
        }
    };
    
    return(
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="flex items-center text-lg md:text-2xl font-bold">
                    Notification Preferences
                </h1>
                <div className="md:flex px-4 md:space-x-8 space-y-4 md:space-y-0">
                    <div className="flex flex-col space-y-1">
                        <p className={`italic text-sm md:text-md ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Sounds</p>
                        <SoundsOption session={session} form={form} handleSoundChange={handleSoundChange} />
                    </div>
                    <div className="flex flex-col space-y-1">
                        <p className={`italic text-sm md:text-md ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Mute/Unmute Notifications</p>
                        <div className="flex">
                            <Mute existingSettingsData={existingSettingsData} removeMuteDialog={removeMuteDialog} setRemoveMuteDialog={setRemoveMuteDialog}  isMuted={isMuted} isSwitch={isSwitch} session={session} form={form} setIsSwitch={setIsSwitch} setIsMuted={setIsMuted} />
                            <audio ref={audioPlayer}/>
                        </  div>
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                <h1 className="flex items-center text-lg md:text-2xl font-bold">
                    Sign-in Security
                </h1>
                <div className="flex px-4 space-x-8">
                    <ActiveSessions session={session} existingSettingsData1={existingSettingsData1} />
                </div>
            </div>
            <div className="space-y-2 pb-8">
                <h1 className="flex items-center text-lg md:text-2xl font-bold">
                    Danger
                </h1>
                <div className="flex px-4 space-x-8">
                    <div className="flex space-x-20 justify-center items-center">
                        <div className="space-y-1">
                            <h1 className="text-xs md:text-sm font-extrabold uppercase">Delete Account</h1>
                            <p className="flex-col italic text-xs md:text-sm text-gray-400">Delete your account and all its associated data</p>
                        </div>
                        <DeleteSection session={session} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsOptions;