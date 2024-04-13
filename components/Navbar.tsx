"use client";

import Link from "next/link";
import Image from "next/image";

import Container from "./ui/Container";
import MainNavigation from "./Main-Navigation";
import NavbarAction from "./Navbar-Action";

import KolabLogoLight from "../public/images/kolab-logo-light.png";
import KolabTextLight from "@/public/images/kolab-text-ligth.png";
import KolabLogoDark from "@/public/images/kolab-logo-dark.png";
import KolabTextDark from "@/public/images/kolab-text-dark.png";
import { useEffect, useState } from "react"
import { Menu } from "lucide-react";
import MobileMenu from "./Mobile-Menu";
import useMenuModal from "@/hook/use-menu-modal";
import { useTheme } from "next-themes";


const Navbar = () => {

    const [scrollY, setScrollY] = useState(0);
    const menuModal = useMenuModal();
    const { theme } = useTheme();

    const openMenu = () => {
        menuModal.onOpen();
    }

    useEffect(() => {
    const handleScroll = () => {
        setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    }, [scrollY]);

    return(
        <>
        <div className={`${theme === 'dark' ? 'bg-[#020817]' : ''} ${theme === 'light' ? 'bg-white' : ''} sticky top-0 z-20 ${scrollY === 0 ? '' : 'border-b transition-all duration-300 ease-out'}`}>
            <Container>
               <div className="relative px-2 sm:px-4 lg:px-8 flex h-20 items-center justify-between">
                    <Link href="/" className="ml-4 lg:ml-0 flex items-center hover:scale-110 transition">
                        {theme === 'dark' ? (<>
                                                <Image src={ KolabLogoDark } alt="" height={30} width={30} priority />
                                                <Image src={ KolabTextDark } alt="" height={30} priority />
                                             </>) 
                                          : 
                                            <></>
                        }
                        {theme === 'light' ? (<>
                                                <Image src={ KolabLogoLight } alt="" height={30} width={30} priority />
                                                <Image src={ KolabTextLight } alt="" height={30} priority />
                                             </>) 
                                          : 
                                            <></>
                        }
                    </Link>
                    <MainNavigation />
                    <NavbarAction />
                    <Menu onClick={() => openMenu()} className="flex lg:hidden hover:scale-110 cursor-pointer transition" size={30} />
               </div> 
            </Container>
        </div>
        {menuModal.isOpen && <MobileMenu />}
        </>
    )
}

export default Navbar;