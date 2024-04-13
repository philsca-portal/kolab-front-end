"use client";

import { useTheme } from 'next-themes';
import Image from 'next/image';
import KolabLogoDark from '@/public/images/kolab-logo-dark.png';
import KolabLogoLight from '@/public/images/kolab-logo-light.png';
import { useEffect, useState } from 'react';

const NoSchedule = () => {

    const { theme } = useTheme();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <div className='w-full flex justify-center items-center'>
            <div className='max-w-md flex flex-col justify-center items-center space-y-4 p-10'>
                <div className='relative h-28 w-28'>
                    {theme === 'dark' ?
                        <Image src={KolabLogoDark} sizes='100%' alt="alt Image" fill />
                        :
                        <></>
                    }

                    {theme === 'light' ?
                        <Image src={KolabLogoLight} sizes='100%' alt="alt Image" fill />
                        :
                        <></>
                    }
                </div>
                <div className='flex flex-col justify-center items-center space-y-1'>
                    <h1 className='text-md font-semibold'>
                        There is no scheduled meeting today.
                    </h1>
                    <p className='text-sm text-gray-500 text-center'>
                        &quot;Use this time to relax and rejuvenate before your next scheduled event or commitment.&quot;
                    </p>
                </div>
            </div>
        </div>
    )
}

export default NoSchedule;