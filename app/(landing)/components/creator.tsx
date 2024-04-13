"use client";

import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import Image from "next/image";
import { useInView } from "react-intersection-observer";

const Creator = () => {

    const [hiRef, hiInView] = useInView({
        triggerOnce: true
      });

    const [imRef, imInView] = useInView({
        triggerOnce: true
    });

    const [nameRef, nameInView] = useInView({
        triggerOnce: true
    });

    const [waveRef, waveInView] = useInView({
        triggerOnce: true
    });

    const [contentRef, contentInView] = useInView({
        triggerOnce: true
    });

    const [buttonRef, buttonInView] = useInView({
        triggerOnce: true
    });

    const [imageRef, imageInView] = useInView({
        triggerOnce: true
    });

    return(
        <section id="creator" className="p-4 lg:p-8 flex flex-col-reverse md:flex md:flex-col-reverse lg:grid lg:grid-cols-6">
            <div className="lg:col-span-3">
                <div className="flex w-full justify-center lg:justify-start space-x-1 lg:ml-8">
                    <p ref={hiRef} className={`${hiInView ? 'animate-opacity-translate-from-left-transition' : ''} text-2xl sm:text-3xl md:text-4xl lg:text-5xl`}>Hi</p>
                    <p ref={imRef} className={`${imInView ? 'animate-opacity-translate-from-left-transition1' : ''} text-2xl sm:text-3xl md:text-4xl lg:text-5xl`}>, I&apos;m</p>
                </div>
                <div className="flex w-full justify-center lg:justify-start lg:items-center space-x-2 lg:ml-8">
                    <h1 ref={nameRef} className={`${nameInView ? 'animate-opacity-translate-from-left-transition2' : ''} text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold`}>Bryan Tabajonda</h1>
                    <div ref={waveRef} className={`${waveInView ? 'animate-opacity-scale-transition1' : ''}`}>
                        <p className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold animate-wave`}>👋</p>
                    </div>
                </div>
                <div ref={contentRef} className={`${contentInView ? 'animate-opacity-scale-transition2' : ''} flex w-full justify-center lg:justify-start lg:items-center space-x-2 lg:ml-8 mt-5`}>
                    <p className="text-lg italic text-gray-500 font-extrabold">Let&apos;s Connect</p>
                    <span className="text-gray-500">━━━━━━━</span>
                </div>
                <div ref={contentRef} className={`${contentInView ? 'animate-opacity-scale-transition2' : ''} flex w-full justify-center lg:justify-start lg:items-center space-x-2 lg:ml-8 mt-2`}>
                    <p className="text-2xl text-center lg:text-start">I&apos;m always excited to meet new people. If you have any questions, ideas, or just want to say hi, feel free to reach out!</p>
                </div>
                <div ref={buttonRef} className={`${buttonInView ? 'animate-opacity-translate-from-top-transition1' : ''} flex w-full justify-center lg:justify-start lg:items-center space-x-2 lg:ml-8 mt-8`}>
                    <Button size={"lg"} className="h-16 group">
                        <p className="text-base">Say Hello</p>
                        <Send className="h-5 w-5 ml-2 group-hover:scale-110 transition" />
                    </Button>
                </div>
            </div>
            <div className="flex justify-center lg:col-span-3">
                <div ref={imageRef} className={`${imageInView ? 'animate-opacity-transition' : ''} relative aspect-square h-[24rem] w-[24rem] sm:h-[28rem] sm:w-[28rem] lg:-translate-y-20 md:h-[34rem] md:w-[34rem]`}>
                    <Image className="object-cover object-center rotate-90" src={"https://gdurl.com/inu5"} alt="" fill sizes="icon" priority />
                    <div className="relative top-[9.6rem] left-14 sm:top-[9.1rem] sm:left-14 md:top-[8.5rem] md:left-14 aspect-square -translate-y-20 h-[17rem] w-[17rem] sm:h-[21rem] sm:w-[21rem] md:h-[27rem] md:w-[27rem]">
                        <Image className="rounded-full object-cover object-center" src={"https://gdurl.com/n8BK"} alt="" fill sizes="icon" />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Creator;