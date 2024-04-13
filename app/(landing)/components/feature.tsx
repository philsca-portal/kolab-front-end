"use client";

import Spline from '@splinetool/react-spline';
import KeyFeatures from './key-features';
import features from '@/jsonfiles/feature.json';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useInView } from 'react-intersection-observer';

const Features= () => {

    const { theme } = useTheme();

    const [featuresRef, featuresInView] = useInView({
        triggerOnce: true
    });

    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const nextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % features.slides.length);
    };

    useEffect(() => {
        const intervalId = setInterval(nextSlide, 5000);

        return () => clearInterval(intervalId);
    },[]);

    return(

        <section id="features" ref={featuresRef} className={`relative ${featuresInView ? 'animate-opacity-scale-transition' : ''}`}>
            <div className='hidden lg:block h-[40rem]'>
                <Spline className='' scene={`${theme === 'dark' ? 'https://prod.spline.design/hAeFNCslYwc04jDZ/scene.splinecode' : 'https://prod.spline.design/C9iR3m8SjEwbO5E1/scene.splinecode'}`} />
            </div>
            {features.slides.map((item,index) => (
                <div key={index}>
                    <KeyFeatures item={item} isVisible={index === currentSlide} />
                </div>
            ))}
        </section>
    )
}

export default Features;