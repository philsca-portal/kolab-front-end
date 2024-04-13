"use client";

import { useTheme } from "next-themes";
import HeroAnimation from "./hero-animation";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import VideoPlayer from "@/components/video-player";

const MainSection = () => {

    const { theme } = useTheme();

    const stylesLight = {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        opacity: 0.2,
        backgroundImage:
          'linear-gradient(#000000 1px, transparent 1px), linear-gradient(90deg, #000000 1px, transparent 1px), linear-gradient(#000000 0.5px, transparent 0.5px), linear-gradient(90deg, #000000 0.5px, rgba(255, 255, 255, 0) 0.5px)',
        backgroundSize: '25px 25px, 25px 25px, 5px 5px, 5px 5px',
        backgroundPosition: '-1px -1px, -1px -1px, -0.5px -0.5px, -0.5px -0.5px',
      };
    
    const stylesDark = {
        backgroundColor: 'rgba(211, 214, 219, 0)',
        opacity: 0.1,
        backgroundImage:
        'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px), linear-gradient(#ffffff 0.5px, transparent 0.5px), linear-gradient(90deg, #ffffff 0.5px, rgba(255, 255, 255, 0) 0.5px)',
        backgroundSize: '25px 25px, 25px 25px, 5px 5px, 5px 5px',
        bbackgroundPosition: '-1px -1px, -1px -1px, -0.5px -0.5px, -0.5px -0.5px',
    };

    return(
        <>
        <div className={`absolute -z-10 top-[74px] left-8 right-10 h-[35rem] sm:h-[24rem] md:h-[24.5rem] lg:h-[34rem]`} style={theme === 'light' ? stylesLight : stylesDark} />
        <div className="gap-40 lg:gap-0 lg:grid lg:grid-cols-12">
                <div className="col-span-12 text-center space-y-5 py-6 lg:text-start lg:col-span-6 lg:py-20">
                    <p className="text-4xl lg:text-3xl font-semibold">Streamline. Communicate. Elevate.</p>
                    <div>
                        <p className={`text-4xl sm:text-6xl font-extrabold uppercase ${theme === 'dark' ? 'green-white-stroke' : 'green-black-stroke'}`}>Collaborate.</p>
                        <p className={`text-5xl lg:text-6xl font-extrabold uppercase ${theme === 'dark' ? 'green-white-stroke' : 'green-black-stroke'}`}>Achieve. Succeed. Kolab.</p>
                    </div>
                    <p className="text-lg font-medium lg:text-lg lg:max-w-lg">&quot;Transform your team&apos;s productivity with Kolab, where seamless collaboration meets efficient task management.&quot;</p>
                    <div className="flex py-4 justify-evenly">
                        <Button className={`sm:h-14 ring-2 ring-offset-2 group ${theme === 'dark'? 'ring-white' : 'ring-black'} bg-[#5B7553] hover:bg-[#346c30] transition`} variant={"default"}>
                            <div className="flex"></div>
                            <p className="text-white text-[11px] sm:text-sm">Start Collaborating</p>
                            <p className="text-white hidden sm:block text-[11px] sm:text-sm ml-[2px]">for free</p>
                            <ArrowUpRight className="text-white h-4 sm:h-10 group-hover:rotate-[220deg] transition" />
                        </Button>
                        <VideoPlayer />
                    </div>
                </div>
                <div className="lg:col-span-6">
                    <HeroAnimation />
                </div>
            </div>
        </>
    )
}

export default MainSection;