"use client";

import { useTheme } from "next-themes";
import Image from "next/image";

type features = {
    firstWord: string
    secondWord: string
    thirdWord: string
    icon: string
    title: string
    firstDescription: string
    secondDescription: string
    firstImage: string
    secondImage: string
}

interface KeyFeaturesProps{
    item: features;
    isVisible: boolean
}

const KeyFeatures: React.FC<KeyFeaturesProps> = ({
    item,
    isVisible
}) => {

    const { theme } = useTheme();

    return(
        <div className={`absolute lg:top-0 lg:left-0 w-full h-full lg:pointer-events-none transition-opacity ease-in-out duration-1000 ${isVisible ? 'opacity-100': 'opacity-0'}`}>
            <div className='grid grid-cols-12'>
                <div className='col-span-6 hidden lg:block'>
                    <div className="p-8 font-extrabold italic space-y-10">
                        <div className="flex justify-start w-11/12 animate-bounce">
                            <p className="text-4xl">&quot;{item.firstWord}</p>
                        </div>
                        <div className="flex justify-center w-11/12 animate-bounce delay-100">
                            <p className="text-4xl">{item.secondWord}</p>
                        </div>
                        <div className="flex justify-end w-11/12 animate-bounce delay-200">
                            <p className="text-4xl">{item.thirdWord}&quot;</p>
                        </div>
                    </div>
                </div>
                <div className="col-span-12 lg:col-span-6">
                    <div className="flex items-center p-8">
                        <div className="relative h-8 w-12 sm:h-12 sm:w-16 lg:h-16 lg:w-24 bg-[#5B7553] rounded-full ring-2 ring-offset-2 ring-black">
                            <Image className="p-2" src={item.icon} alt="" fill sizes="icon" />
                        </div>
                        <p className={`ml-3 sm:ml-5 text-center text-2xl lg:text-6xl font-extrabold ${theme === 'dark' ? 'green-white-stroke' : 'green-black-stroke'}`}>{item.title}</p>
                    </div>
                    <div className="cols-span-6">
                        <div className="grid grid-cols-2 space-x-5 sm:space-x-10">
                            <div className={`${theme === 'dark' ? 'green-gradient-dark': 'green-gradient'} rounded-lg shadow-xl`}>
                                <p className={`text-sm sm:text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-500'} text-gray-500 text-center p-5`}>{item.firstDescription}</p>
                            </div>
                            <div className={`${theme === 'dark' ? 'green-gradient-dark': 'green-gradient'} rounded-lg shadow-xl`}>
                                <p className={`text-sm sm:text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-500'} text-gray-500 text-center p-5`}>{item.secondDescription}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-6 mt-10 mb-28 lg:mt-0 lg:mb-0">
                        <div className="flex">
                            <div className="relative translate-x-4 translate-y-16 md:translate-x-36 md:translate-y-18 lg:translate-x-14 lg:translate-y-20 z-10 aspect-square h-[150px] w-[250px] md:h-[240px] md:w-[340px] lg:h-[200px] lg:w-[300px]">
                                <Image className=" object-cover object-center rounded-2xl ring-2 ring-offset-8 ring-black" src={item.firstImage} alt="" fill sizes="icon"/>
                            </div>
                            <div className="relative z-10 -translate-x-4 translate-y-6 md:translate-x-20 md:translate-y-8 lg:translate-x-0 lg:translate-y-10 aspect-square h-[150px] w-[250px] md:h-[240px] md:w-[340px] lg:h-[200px] lg:w-[300px]">
                                <Image className=" object-cover object-center rounded-2xl ring-2 ring-offset-8 ring-black" src={item.secondImage} alt="" fill sizes="icon"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default KeyFeatures;