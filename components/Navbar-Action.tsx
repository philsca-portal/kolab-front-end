"use client";

import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import ToggleTheme from "./ui/toggle-theme";
import Link from "next/link";
import { useSession } from "next-auth/react";

const NavbarAction = () => {

    const session = useSession();
    const { theme } = useTheme();

    return(
        <div className="hidden lg:flex">
            {session.data ? 
            (<div>
               <Link href="/dashboard" passHref>
                    <Button  className={`p-2  transition group hover:bg-black ${ theme === 'dark' ? 'hover:bg-white' : ' hover:bg-black'}`} variant={"outline"}>
                        <p className={` ${theme === 'dark' ? 'group-hover:text-black' : 'group-hover:text-white'} transition-colors`}>Dashboard</p>
                    </Button>
                </Link> 
            </div>) 
                :
            (<div className={`border border-black ${theme == 'dark' ? 'border-white' : 'border-black'} rounded-full`}>
                <Link href="/sign-in" passHref>
                    <Button  className={`p-2 rounded-l-full transition group hover:bg-black ${ theme === 'dark' ? 'hover:bg-white' : ' hover:bg-black'}`} variant={"outline"}>
                        <p className={` ${theme === 'dark' ? 'group-hover:text-black' : 'group-hover:text-white'} transition-colors`}>Sign-in</p>
                    </Button>
                </Link>
                <Link href="/sign-up" passHref>
                    <Button className={`p-2  rounded-r-full transition group hover:bg-black border-l-black ${ theme === 'dark' ? 'hover:bg-white border-l-white' : 'hover:bg-black border-l-black'} `} variant={"outline"}>
                        <p className={` ${theme === 'dark' ? 'group-hover:text-black' : 'group-hover:text-white'} transition-colors`}>Sign-up</p>
                    </Button>
                </Link>
            </div>)}
            <div className="ml-4">
            <ToggleTheme />
            </div>
        </div>
    )
}

export default NavbarAction;