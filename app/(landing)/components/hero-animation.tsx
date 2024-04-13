"use client";

import Spline from '@splinetool/react-spline';

const HeroAnimation = () => {

    return(
        <div className="hidden lg:block h-[32rem]">
            <Spline  className=" -translate-x-16" scene={`${process.env.NEXT_PUBLIC_SPLINE_URL}`} />
        </div>
    )
}

export default HeroAnimation;