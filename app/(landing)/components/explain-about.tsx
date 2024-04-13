"use client";

import { useTheme } from "next-themes";
import { useInView } from "react-intersection-observer";

const ExplainAbout = () => {

    const { theme } = useTheme();

    const [titleRef, titleInView] = useInView({
        triggerOnce: true
    });

    const [boxesRef, boxesInView] = useInView({
        triggerOnce: true
    });

    return(
        <div className="flex flex-col justify-center items-center space-y-10 lg:space-y-20">
            <p ref={titleRef} className={`text-4xl sm:text-5xl font-extrabold uppercase ${theme === 'dark' ? 'green-white-stroke' : 'green-black-stroke'} ${titleInView ? 'animate-opacity-translate-from-left-transition' : ''}`}>Why Kolab?</p>
            <div ref={boxesRef} className={`grid grid-cols-1 lg:grid-cols-3 space-y-8 lg:space-y-0 lg:space-x-8 ${boxesInView ? 'animate-opacity-translate-from-bottom-transition' : ''}`}>
                <div className={`p-8 space-y-4 max-w-[50rem] ${theme === 'dark' ? 'green-gradient-dark': 'green-gradient'} rounded-lg shadow-xl`}>
                    <h1 className="text-2xl font-semibold">Efficiency Redefined</h1>
                    <p className={`${theme === 'dark' ? 'text-[white]' : 'text-gray-500'} leading-loose text-gray-500 text-lg`}>We redefine efficiency by combining powerful features with a user-centric design. Experience task management like never before.</p>   
                </div>
                <div className={`p-8 space-y-4 max-w-[50rem] ${theme === 'dark' ? 'green-gradient-dark': 'green-gradient'} rounded-lg shadow-xl`}>
                    <h1 className="text-2xl font-semibold">Innovative Collaboration</h1>
                    <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-500'} leading-loose text-gray-500 text-lg`}>Our project thrives on fostering innovation through collaborative tools. Connect and work seamlessly with your team members.</p>   
                </div>
                <div className={`p-8 space-y-4 max-w-[50rem] ${theme === 'dark' ? 'green-gradient-dark': 'green-gradient'} rounded-lg shadow-xl`}>
                    <h1 className="text-2xl font-semibold">Your Success, Our Mission</h1>
                    <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-500'} leading-loose text-gray-500 text-lg`}>Your success is our mission. We continuously strive to enhance and improve our platform based on your feedback and evolving industry needs.</p>   
                </div>         
            </div>
        </div>
    )
}

export default ExplainAbout;