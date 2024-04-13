"use client";

import Image from "next/image";

import { X } from "lucide-react";
import KolabLogoLight from "@/public/images/kolab-logo-light.png";
import KolabLogoDark from "@/public/images/kolab-logo-dark.png";
import useMenuModal from "@/hook/use-menu-modal";
import { useTheme } from "next-themes";

const MobileMenu = () => {

    const menuModal = useMenuModal();
    const { theme } = useTheme();

    return(
        <div className={`fixed z-30 lg:hidden top-0 left-0 w-full h-full ${theme === 'dark' ? 'bg-[#020817]' : 'bg-white'} px-4 overflow-y-scroll`}>
                <div className="flex lg:hidden items-center justify-between p-4 sm:p-6">
                    <Image src={theme === "dark" ? KolabLogoDark : KolabLogoLight} priority alt="" height={30} width={30} />
                    <X onClick={() => menuModal.onClose()} className="hover:scale-110 cursor-pointer transition" />
                </div>
                <div className="flex flex-col p-4 sm:p-6 space-y-8">
                    <div className="grid grid-cols-2">
                        <a className={`px-4 h-24 font-semibold flex items-center rounded-xl cursor-pointer ${theme === 'dark' ? 'hover:bg-white hover:text-black' : 'hover:bg-black hover:text-white'} transition-colors`}>Sign-in</a>
                        <a className={`px-4 h-24 font-semibold flex items-center rounded-xl cursor-pointer ${theme === 'dark' ? 'hover:bg-white hover:text-black' : 'hover:bg-black hover:text-white'} transition-colors`}>Sign-up</a>
                    </div>
                    <a className={`px-4 h-24 font-semibold flex items-center rounded-xl cursor-pointer ${theme === 'dark' ? 'hover:bg-white hover:text-black' : 'hover:bg-black hover:text-white'} transition-colors`}>Features</a>
                    <a className={`px-4 h-24 font-semibold flex items-center rounded-xl cursor-pointer ${theme === 'dark' ? 'hover:bg-white hover:text-black' : 'hover:bg-black hover:text-white'} transition-colors`}>About</a>
                    <a className={`px-4 h-24 font-semibold flex items-center rounded-xl cursor-pointer ${theme === 'dark' ? 'hover:bg-white hover:text-black' : 'hover:bg-black hover:text-white'} transition-colors`}>Purpose</a>
                    <a className={`px-4 h-24 font-semibold flex items-center rounded-xl cursor-pointer ${theme === 'dark' ? 'hover:bg-white hover:text-black' : 'hover:bg-black hover:text-white'} transition-colors`}>Pricing</a>
                    <a className={`px-4 h-24 font-semibold flex items-center rounded-xl cursor-pointer ${theme === 'dark' ? 'hover:bg-white hover:text-black' : 'hover:bg-black hover:text-white'} transition-colors`}>Creator</a>
                </div>
        </div>
    )
}

export default MobileMenu;