import { useTheme } from "next-themes";

const Loader = () => {

    const { theme } = useTheme();

    return(
        <div className={`fixed top-0 left-0 w-full h-full z-50 ${theme === 'light' ? 'bg-white' : ''} ${theme === 'dark' ? 'bg-[#020817]' : ''} px-4`}>
            <div className="flex w-full h-full justify-center items-center">
                <div className="loader">
                    <div className="bar1"></div>
                    <div className="bar2"></div>
                    <div className="bar3"></div>
                    <div className="bar4"></div>
                    <div className="bar5"></div>
                    <div className="bar6"></div>
                    <div className="bar7"></div>
                    <div className="bar8"></div>
                    <div className="bar9"></div>
                    <div className="bar10"></div>
                    <div className="bar11"></div>
                    <div className="bar12"></div>
                </div>
            </div>
        </div>
    )
}

export default Loader;