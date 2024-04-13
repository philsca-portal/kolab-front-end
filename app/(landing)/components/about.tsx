"use client";

import Image from "next/image";
import ExplainAbout from "./explain-about";
import { useInView } from "react-intersection-observer";

import lowerleftlight from "@/public/images/Light-pictures/lower-left-light.png";
import lowerrightlight from "@/public/images/Light-pictures/lower-right-light.png";
import upperleftlight from "@/public/images/Light-pictures/upper-left-light.png";
import upperrightlight from "@/public/images/Light-pictures/upper-right-light.png";

import lowerleftdark from "@/public/images/Dark-pictures/lower-left-dark.png";
import lowerrightdark from "@/public/images/Dark-pictures/lower-right-dark.png";
import upperleftdark from "@/public/images/Dark-pictures/upper-left-dark.png";
import upperrightdark from "@/public/images/Dark-pictures/upper-right-dark.png";
import { useTheme } from "next-themes";

const About = () => {

    const { theme } = useTheme();

    const [firstImageRef, firstImageInView] = useInView({
        triggerOnce: true
    });

    const [secondImageRef, secondImageInView] = useInView({
        triggerOnce: true
    });

    const [thirdImageRef, thirdImageInView] = useInView({
        triggerOnce: true
    });

    const [fourthImageRef, fourthImageInView] = useInView({
        triggerOnce: true
    });

    const [browserRef, browserInView] = useInView({
        triggerOnce: true
    });

    return(
        <section id="about" className="mt-[26rem] mb-[5rem] sm:mt-[32rem] md:mt-[38rem] md:mb-[9rem] lg:mt-[8rem] lg:mb-[12rem]">
            <div className="mt-[35rem] mb-[0rem] sm:mt-[43rem] sm:mb-[0rem] md:mt-[45rem] md:mb-[8rem] lg:mt-[5rem] lg:mb-[10rem]">
                <ExplainAbout />
            </div>
            <div id="purpose" className="my-[8rem] sm:h-[45rem] flex justify-center items-center">
                <div ref={firstImageRef} className={`${firstImageInView ? 'animate-opacity-translate-from-left-transition-mobile sm:animate-opacity-translate-from-left-transition-small md:animate-opacity-translate-from-left-transition-medium lg:animate-opacity-translate-from-left-transition-large' : ''} absolute z-10 aspect-square h-[90px] w-[150px] -translate-x-[6.5rem] translate-y-[8rem] sm:h-[125px] sm:w-[200px] md:h-[200px] sm:-translate-x-[12rem] sm:translate-y-[11rem] md:w-[300px] lg:h-[300px] lg:w-[400px] md:-translate-x-[19rem] md:translate-y-[15rem] lg:-translate-x-[26rem] lg:translate-y-[18rem]`}>
                    <Image className="object-cover object-center rounded-2xl shadow-md shadow-[#5B7553]" src={theme === 'dark'? lowerleftdark : lowerleftlight } alt="" fill sizes="icon" />
                </div>
                <div ref={thirdImageRef} className={`${thirdImageInView ? 'animate-opacity-translate-from-top-transition-mobile sm:animate-opacity-translate-from-top-transition-small md:animate-opacity-translate-from-top-transition-medium lg:animate-opacity-translate-from-top-transition-large' : ''} absolute z-10 aspect-square h-[75px] w-[125px] -translate-x-10 -translate-y-28 sm:h-[100px] sm:w-[150px] sm:-translate-x-12 sm:-translate-y-40 md:h-[150px] md:w-[250px] md:-translate-x-16 md:-translate-y-56 lg:h-[250px] lg:w-[350px] lg:-translate-x-20 lg:-translate-y-72 shadow-2xl`}>
                    <Image className="object-cover object-center rounded-2xl shadow-md shadow-[#5B7553]" src={theme === 'dark'? upperleftdark : upperleftlight } alt="" fill sizes="icon" />
                </div>
                <div ref={fourthImageRef} className={`${fourthImageInView ? 'animate-opacity-translate-from-bottom-transition-mobile sm:animate-opacity-translate-from-bottom-transition-small md:animate-opacity-translate-from-bottom-transition-medium lg:animate-opacity-translate-from-bottom-transition-large' : ''} absolute z-10 aspect-square h-[100px] w-[170px] translate-x-[6rem] translate-y-[6rem] sm:h-[175px] sm:w-[275px] sm:translate-x-[10rem] sm:translate-y-[7rem] md:h-[275px] md:w-[375px] md:translate-x-[13rem] md:translate-y-[10rem] lg:h-[375px] lg:w-[475px] lg:translate-x-[15rem] lg:translate-y-[12rem] shadow-2xl`}>
                    <Image className="object-cover object-center rounded-2xl shadow-md shadow-[#5B7553]" src={theme === 'dark'? lowerrightdark : lowerrightlight } alt="" fill sizes="icon" />
                </div>   
                <div ref={secondImageRef} className={`${secondImageInView ? 'animate-opacity-translate-from-right-transition-mobile sm:animate-opacity-translate-from-right-transition-small md:animate-opacity-translate-from-right-transition-medium lg:animate-opacity-translate-from-right-transition-large' : ''} absolute z-10 aspect-square h-[65px] w-[110px] translate-x-[7.5rem] -translate-y-[6rem] sm:h-[100px] sm:w-[150px] sm:translate-x-[14rem] sm:-translate-y-[9rem] md:h-[125px] md:w-[200px] md:translate-x-[18rem] md:-translate-y-[13rem] lg:h-[175px] lg:w-[275px] lg:translate-x-[24rem] lg:-translate-y-[13rem] shadow-2xl`}>
                    <Image className="object-cover object-center rounded-2xl shadow-md shadow-[#5B7553]" src={theme === 'dark'? upperrightdark : upperrightlight } alt="" fill sizes="icon" />
                </div> 
                <div ref={browserRef} className={`${browserInView ? 'animate-opacity-scale-transition' : ''} relative aspect-square h-[15rem] w-[20rem] sm:h-3/6 sm:w-4/6 md:h-4/6 md:w-4/6 lg:h-5/6 lg:w-4/6`}>
                    <div className="flex flex-col h-full w-full">
                        <div className="flex w-full h-[10%] bg-[#5B7553] items-center px-4 space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-4 rounded-t-xl shadow-2xl shadow-[#5B7553]">
                            <div className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 bg-[#fb3c45] rounded-full"/>
                            <div className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 bg-[#fad13e] rounded-full"/>
                            <div className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 bg-[#8ae849] rounded-full"/>
                        </div>
                        <div className="h-[90%] w-full bg-white rounded-b-xl shadow-2xl shadow-[#5B7553]">
                            <div className="p-6 grid grid-cols-12 space-x-6 sm:space-x-8 md:space-x-10 lg:space-x-12">
                                <div className="col-span-2 animate-pulse">
                                    <div className="flex flex-col space-y-1 sm:space-y-2 md:space-y-3 lg:space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="h-4 w-8 sm:h-6 sm:w-10 md:h-8 md:w-12 lg:h-10 lg:w-14 bg-gray-400 rounded-full"/>
                                            <div className="w-full space-y-1">
                                                <div className="w-full h-1 md:h-2 lg:h-3 bg-gray-400 rounded-lg" />
                                                <div className="w-1/2 h-1 md:h-2 lg:h-3 bg-gray-400 rounded-lg" />
                                            </div>
                                        </div>
                                        <div className="w-full h-2 sm:h-4 md:h-6 lg:h-8 bg-gray-400 rounded-lg" />
                                        <div className="w-full h-2 sm:h-4 md:h-6 lg:h-8 bg-gray-400 rounded-lg" />
                                        <div className="w-full h-2 sm:h-4 md:h-6 lg:h-8 bg-gray-400 rounded-lg" />
                                        <div className="w-full h-2 sm:h-4 md:h-6 lg:h-8 bg-gray-400 rounded-lg" />
                                    </div>
                                    <div className="flex flex-col space-y-1 sm:space-y-2 md:space-y-3 lg:space-y-4 mt-4 sm:mt-6 md:mt-8 lg:mt-10">
                                        <div className="w-4/5 h-2 sm:h-3 md:h-4 lg:h-5 bg-gray-400 rounded-lg" />
                                        <div className="w-4/5 h-2 sm:h-3 md:h-4 lg:h-5 bg-gray-400 rounded-lg" />
                                        <div className="w-4/5 h-2 sm:h-3 md:h-4 lg:h-5 bg-gray-400 rounded-lg" />
                                        <div className="w-4/5 h-2 sm:h-3 md:h-4 lg:h-5 bg-gray-400 rounded-lg" />
                                    </div>
                                </div>
                                <div className="col-span-10 animate-pulse">
                                    <div className="grid grid-cols-10 space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-4">
                                        <div className="col-span-7">
                                            <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-14 space-y-5">
                                                <div className="w-full h-16 sm:h-24 md:h-32 lg:h-40 bg-gray-400 rounded-lg"/>
                                            </div>
                                        </div>
                                        <div className="col-span-3 space-y-2">
                                            <div className="flex justify-end">
                                                <div className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 bg-gray-400 rounded-full"/>
                                            </div>
                                            <div className="w-full h-16 sm:h-24 md:h-32 lg:h-40 bg-gray-400  rounded-lg"/>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-10 mt-1 sm:mt-6 md:mt-8 lg:mt-10">
                                        <div className="col-span-10">
                                            <div className="w-full h-20 sm:h-28 md:h-44 lg:h-52 bg-gray-400 rounded-lg"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About;