"use client";

import Navigation from "@/components/navigation";
import ProfileMenu from "@/components/profile-menu";
import Projects from "@/components/projects";
import { Session } from "next-auth";
import { useEffect, useRef, useState } from "react";
import Teams from "./teams";
import { Menu } from "lucide-react";
import { useTheme } from "next-themes";
import useDashboardMenuModal from "@/hook/use-dashboardmenu-modal";
import useNotification from "@/hook/use-notification";
import stopSoundFx from "@/public/sounds/stopSoundFx.mp3";
import shootingSoundFx from "@/public/sounds/shootingSoundFx.mp3";
import notificationEmailFx from "@/public/sounds/notificationEmailFx.mp3";
import notificationSoundFx from "@/public/sounds/notificationSoundFx.mp3";
import silenceSoundFx from "@/public/sounds/silenceSoundFx.mp3"
import { io } from "socket.io-client";
import useMutedStore from "@/hook/use-muted";

interface MenuNavigationProps {
    profileData: any;
    session: Session | null;
}

const DashboardNavbar: React.FC<MenuNavigationProps> = ({
    profileData,
    session
}) => {
    const { theme } = useTheme();
    
    const { muted } = useMutedStore();
    const dashboardMenuModal = useDashboardMenuModal();
    const [isMounted, setIsMounted] = useState(false);
    const { notifications, addNotification } = useNotification();

    const audioPlayer = useRef<HTMLAudioElement | null>(null);

    const [sound, setSound] = useState('');
    const [teamData, setTeamData] = useState<({
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
    })[]>([]);

    useEffect(() => {
        const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);

        socket.emit('notificationsForUsers', session?.user.userId);

        socket.on('notificationsForUsers', (notificationData) => {
            if (JSON.stringify(notificationData) !== JSON.stringify(notifications)) {
                addNotification(notificationData);
            }
        });

        socket.emit('notificationsSoundForUsers', session?.user.userId);

        socket.on('notificationsSoundForUsers', (notificationSound) => {
            setSound(notificationSound);
        });

        socket.emit('teamUpdate', session?.user.userId);

        socket.on('teamUpdate', (teamData) => {
            setTeamData(teamData);
        });

        return () => {
            socket.disconnect();
        }
    }, [addNotification, notifications, session?.user.userId]);

    useEffect(() => {
        if (muted === true && audioPlayer.current) {
            audioPlayer.current.src = silenceSoundFx
            audioPlayer.current.play();
        } else {
            if (notifications.length > 0) {
                if (sound === 'none' && audioPlayer.current) {
                    audioPlayer.current.src = silenceSoundFx
                    audioPlayer.current.play();
                }

                if (sound === 'stopSoundFx' && audioPlayer.current) {
                    audioPlayer.current.src = stopSoundFx
                    audioPlayer.current.play();
                }

                if (sound === 'shootingSoundFx' && audioPlayer.current) {
                    audioPlayer.current.src = shootingSoundFx
                    audioPlayer.current.play();
                }

                if (sound === 'notificationEmailFx' && audioPlayer.current) {
                    audioPlayer.current.src = notificationEmailFx
                    audioPlayer.current.play();
                }

                if (sound === 'notificationSoundFx' && audioPlayer.current) {
                    audioPlayer.current.src = notificationSoundFx
                    audioPlayer.current.play();
                }
            }
        }
    }, [notifications.length, sound, muted]);

    useEffect(() => {
        setIsMounted(true);
        setTimeout(() => {
        }, 4000);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <audio ref={audioPlayer} />
            <div className={`${theme === 'dark' ? 'bg-[#020817]' : ''} ${theme === 'light' ? 'bg-white' : ''} flex justify-end border-b transition-all `}>
                <Menu onClick={dashboardMenuModal.onOpen} className="flex lg:hidden hover:scale-110 cursor-pointer transition p-6 mx-5" size={80} />
            </div>
            <div className="hidden sticky top-1 lg:flex flex-col p-4 space-y-6">
                <ProfileMenu profileData={profileData} session={session} />
                <Navigation />
                <Projects session={session} />
                <Teams teamData={teamData} session={session} />
            </div>
            {dashboardMenuModal.isOpen &&
                (
                    <div className=" animate-opacity-translate-from-right-transition-0.2sec grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 fixed z-30 lg:hidden top-0 right-0 w-full h-full">
                        <div onClick={() => dashboardMenuModal.onClose()} className="col-span-2 sm:col-span-3 md:col-span-5 w-full h-full backdrop-blur-md">
                        </div>
                        <div className={`col-span-1 ${theme === 'dark' ? 'bg-[#020817]' : 'bg-white'} p-4 space-y-8 border-l`}>
                            <ProfileMenu profileData={profileData} session={session} />
                            <Navigation />
                            <Projects session={session} />
                            <Teams teamData={teamData} session={session} />
                        </div>
                    </div>
                )}
        </>
    )
}

export default DashboardNavbar;