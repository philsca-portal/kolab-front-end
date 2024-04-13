"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import useDashboardMenuModal from "@/hook/use-dashboardmenu-modal";
import { KeyRound, LogOut, Moon, PaintbrushIcon, Sun, User } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

interface ProfileMenuProps{
    profileData:any;
    session: Session | null;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
    profileData,
    session
}) => {

    const dashboardMenuModal = useDashboardMenuModal();
    const { setTheme } = useTheme();

    const changeTheme = ( theme: string) => {
        setTheme(`${theme}`);
        dashboardMenuModal.onClose();
    }

    return(
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <div className="flex items-center space-x-2 cursor-pointer">
                <div className="relative aspect-square h-8 w-8">
                    <Image className="rounded-full hover:scale-105 transition object-cover object-center ring-1 ring-offset-1 ring-black" src={session?.user.image? session?.user.image : ''} alt="" fill sizes="icon" priority />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-[11px] hover:underline font-bold transition">{session?.user.name}</h1>
                    <p className="text-[9px] text-gray-500">Free plan | 0 members</p>
                </div>
            </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href={'/profile'}>
                <DropdownMenuItem className="cursor-pointer" onClick={() => dashboardMenuModal.onClose()}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                </DropdownMenuItem>
            </Link>
            <Link href={'/changePassword'}>
                <DropdownMenuItem className="cursor-pointer" onClick={() => dashboardMenuModal.onClose()}>
                    <KeyRound className="mr-2 h-4 w-4" />
                    Change Password
                </DropdownMenuItem>
            </Link>
            <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer">
                    <PaintbrushIcon className="mr-2 h-4 w-4" />
                    <span>Theme</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                        <DropdownMenuItem onClick={() => changeTheme('light')} className="cursor-pointer"> 
                            <Sun className="mr-2 h-4 w-4" />
                            Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeTheme('dark')} className="cursor-pointer">
                            <Moon className="mr-2 h-4 w-4" />
                            Dark
                        </DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
    )
}

export default ProfileMenu;