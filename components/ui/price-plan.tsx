"use client";

import { Check } from "lucide-react";
import { Button } from "./button";
import { useTheme } from "next-themes";

interface PricePlanProps{
    plan: string;
    price: string;
    description: string;
    featureOne: string;
    featureTwo: string;
    featureThree: string;
    featureFour: string;
}

const PricePlan: React.FC<PricePlanProps> = ({
    plan,
    price,
    description,
    featureOne,
    featureTwo,
    featureThree,
    featureFour
}) => {

    const { theme } = useTheme();

    return(
        <div className="p-2 h-full w-full rounded-xl z-10">
            <div className="flex flex-col p-2 sm:p-6 space-y-4">
                <div className="space-y-1 sm:space-y-4">
                    <h1 className="text-3xl sm:text-5xl font-extrabold">{plan}</h1>
                    <div className="flex">
                        <p className="text-sm sm:text-base">₱</p>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">{price}</h1>
                        <div className="flex items-end">
                            <p className="text-sm sm:text-base lg:text-base">/mo</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-3">
                    <p className="italic text-xs sm:text-sm md:text-base lg:text-sm">{description}</p>
                    <ul className="space-y-2">
                        <li className="flex items-center text-sm md:text-base">
                            <Check className="h-3 w-3 lg:h-4 lg:w-4 mr-1" /> 
                            {featureOne}
                        </li>
                        <li className="flex items-center text-sm sm:text-base">
                            <Check className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                            {featureTwo}
                        </li>
                        <li className="flex items-center text-sm sm:text-base">
                            <Check className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                            {featureThree}
                        </li>
                        <li className="flex items-center text-sm sm:text-base">
                            <Check className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                            {featureFour}
                        </li>
                    </ul>
                    <div className={`w-fit border rounded-lg ${theme === 'dark' ? 'border-white' : 'border-black'}`}>
                        <Button className={`group ${theme === 'dark' ? 'hover:bg-white' : 'hover:bg-black'}`} variant={"outline"}>
                            <p className={` ${theme === 'dark' ? 'group-hover:text-[#020817]' : 'group-hover:text-white'} transition-colors`}>Choose plan</p>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PricePlan;