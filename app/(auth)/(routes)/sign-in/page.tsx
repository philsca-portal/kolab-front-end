"use client";

import Image from "next/image";
import googleIcon from "@/public/images/google-icon.png";
import githubIcon from "@/public/images/github-icon.png";
import discordIcon from "@/public/images/discord-icon.png";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { useInView } from "react-intersection-observer";
import SigninForm from "./components/sign-in-form";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Suspense } from 'react';
import Loader from "@/components/ui/Loader";

const SignIn = () => {

    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get("redirected")) {
            toast.error('your Email already exists.');
        }
    }, [searchParams]);

    const [divRef, divInView] = useInView({
        triggerOnce: true
    });

    const google = async () => {
        await signIn('google', { callbackUrl: '/dashboard?authenticated=1' });
    }

    const github = async () => {
        await signIn('github', { callbackUrl: `/dashboard?authenticated=1` });
    }

    const discord = async () => {
        await signIn('discord', { callbackUrl: `/dashboard?authenticated=1` });
    }

    return (
        <Suspense fallback={<Loader />}>
            <div className="h-full w-full flex items-center justify-center p-2">
                <div ref={divRef} className={`${divInView ? 'animate-opacity-transition-1sec' : ''} flex flex-col`}>
                    <div className="space-y-2">
                        <p className="text-3xl font-bold">Sign in</p>
                        <p className="text-sm">to continue to Kolab</p>
                    </div>
                    <div className="space-y-2 mt-4">
                        <Button onClick={google} className="flex justify-between w-full group border-gray-300" variant={"outline"} size={"lg"}>
                            <div className="flex items-center">
                                <Image className="mr-2" src={googleIcon} alt="" height={25} width={25} priority />
                                Continue with Google
                            </div>
                            <MoveRight className="text-gray-600 -translate-x-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition" />
                        </Button>
                    </div>
                    <div className="flex justify-center">
                        <p className="text-sm text-gray-400 mt-4 mb-2">━━━━━━━━ or ━━━━━━━━</p>
                    </div>
                    <div className="space-y-2 mt-4">
                        <Button onClick={github} className="flex justify-between w-full group border-gray-300" variant={"outline"} size={"lg"}>
                            <div className="flex items-center">
                                <Image className="mr-2" src={githubIcon} alt="" height={25} width={25} priority />
                                Continue with Github
                            </div>
                            <MoveRight className="text-gray-600 -translate-x-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition" />
                        </Button>
                    </div>
                    <div className="space-y-2 mt-4">
                        <Button onClick={discord} className="flex justify-between w-full group border-gray-300" variant={"outline"} size={"lg"}>
                            <div className="flex items-center">
                                <Image className="mr-2" src={discordIcon} alt="" height={25} width={25} priority />
                                Continue with Discord
                            </div>
                            <MoveRight className="text-gray-600 -translate-x-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition" />
                        </Button>
                    </div>
                    <SigninForm />
                </div>
            </div>
        </Suspense>
    )
}

export default SignIn;