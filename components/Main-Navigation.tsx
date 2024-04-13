"use client";

const MainNavigation = () => {
    return(
        <nav className="mx-6 hidden lg:flex items-center space-x-6 lg:space-x-8 font-semibold">
            <a href="#features" className="hover:scale-110 cursor-pointer transition">Features</a>
            <a href="#about" className="hover:scale-110 cursor-pointer transition">About</a>
            <a href="#purpose" className="hover:scale-110 cursor-pointer transition">Purpose</a>
            <a href="#pricing" className="hover:scale-110 cursor-pointer transition">Pricing</a>
            <a href="#creator" className="hover:scale-110 cursor-pointer transition">Creator</a>
        </nav>
    )
}

export default MainNavigation;