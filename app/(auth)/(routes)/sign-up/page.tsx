"use client";

import Image from "next/image";
import KolabLogoLight from "@/public/images/kolab-logo-light.png";
import KolabTextLight from "@/public/images/kolab-text-ligth.png";
import Browser from "@/components/ui/browser";
import { Button } from "@/components/ui/button";
import googleIcon from "@/public/images/google-icon.png";
import githubIcon from "@/public/images/github-icon.png";
import discordIcon from "@/public/images/discord-icon.png";
import { MoveRight } from "lucide-react";
import SignupForm from "./components/sign-up-form";
import { useInView } from "react-intersection-observer";
import { useState } from "react";
import { signIn } from "next-auth/react";


const SignUp = () => {
    const [loading, setIsLoading] = useState(false);
    const [leftDivRef, leftDivInView] = useInView({
        triggerOnce: true
    });

    const [rightDivRef, rightDivInView] = useInView({
        triggerOnce: true
    });

    const google = async () => {
        await signIn('google', {callbackUrl: '/dashboard?authenticated=1'});
    }

    const github = async () => {
        await signIn('github', { callbackUrl: `/dashboard?authenticated=1`});
    }

    const discord = async () => {
        await signIn('discord', { callbackUrl: `/dashboard?authenticated=1`});
    }
    
    return(
        <div className="grid grid-cols-12 h-full w-full">
            <div ref={leftDivRef} className={`${leftDivInView ? 'animate-opacity-translate-from-left-transition-1sec' : ''} col-span-4 hidden lg:flex flex-col bg-[#5B7553] relative overflow-hidden`}>
                <div className="px-12 py-10 space-y-6 ">
                    <div className="flex p-2 bg-white w-fit rounded-xl">
                        <Image src={KolabLogoLight} alt="" height={20} width={20} priority />
                        <Image src={KolabTextLight} alt="" height={20}  priority />
                    </div>
                    <p className="text-3xl font-bold text-white">Supercharge your collaboration with Kolab Task Management</p>
                    <p className="text-white text-sm">Sign up for free and unlock a world of seamless teamwork and productivity.</p>
                </div>
                <Browser/>
            </div>
            <div className="col-span-12 lg:col-span-8 flex items-center justify-center p-2">
                <div ref={rightDivRef} className={`${rightDivInView? 'animate-opacity-transition-1sec' : ''} flex flex-col`}>
                    <div className="space-y-2">
                        <p className="text-3xl font-bold">Create your account</p>
                        <p className="text-sm">to continue to Kolab</p>
                    </div>               
                    <div className="space-y-2 mt-4">
                        <Button onClick={google} disabled={loading}  className="flex justify-between w-full group border-gray-300" variant={"outline"} size={"lg"}>
                        <div className="flex items-center">
                            <Image className="mr-2" src={googleIcon} alt="" height={25} width={25} priority /> 
                            Continue with Google
                            </div>
                            <MoveRight className="text-gray-600 -translate-x-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition" />
                        </Button>
                    </div>
                    <div className="flex justify-center">
                        <p className="text-sm text-gray-400 mt-6 mb-2">━━━━━━━━ or ━━━━━━━━</p>
                    </div>                
                    <div className="space-y-2 mt-4">
                        <Button onClick={github} disabled={loading}  className="flex justify-between w-full group border-gray-300" variant={"outline"} size={"lg"}>
                        <div className="flex items-center">
                            <Image className="mr-2" src={githubIcon} alt="" height={25} width={25} priority /> 
                            Continue with Github
                            </div>
                            <MoveRight className="text-gray-600 -translate-x-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition" />
                        </Button>
                    </div>
                    <div className="space-y-2 mt-4">
                        <Button onClick={discord} disabled={loading}  className="flex justify-between w-full group border-gray-300" variant={"outline"} size={"lg"}>
                        <div className="flex items-center">
                            <Image className="mr-2" src={discordIcon} alt="" height={25} width={25} priority /> 
                            Continue with Discord
                            </div>
                            <MoveRight className="text-gray-600 -translate-x-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition" />
                        </Button>
                    </div>
                    <SignupForm />
                </div>
            </div>
        </div>
    )
}

export default SignUp;