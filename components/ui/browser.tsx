const Browser = () => {
    return (
        <div className={`relative aspect-square h-[30rem] w-[60rem] ml-12 border-white border-2 rounded-xl`}>
            <div className="flex flex-col h-full w-full">
                <div className="flex w-full h-[10%] bg-[#5B7553] items-center px-4 space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-4 rounded-t-xl shadow-2xl shadow-[#5B7553]">
                    <div className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 bg-[#fb3c45] rounded-full" />
                    <div className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 bg-[#fad13e] rounded-full" />
                    <div className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 bg-[#8ae849] rounded-full" />
                </div>
                <div className="h-[90%] w-full bg-white rounded-b-xl shadow-2xl shadow-[#5B7553]">
                    <div className="p-6 grid grid-cols-12 space-x-6 sm:space-x-8 md:space-x-10 lg:space-x-12">
                        <div className="col-span-2 animate-pulse">
                            <div className="flex flex-col space-y-1 sm:space-y-2 md:space-y-3 lg:space-y-4">
                                <div className="flex items-center space-x-2">
                                    <div className="h-4 w-8 sm:h-6 sm:w-10 md:h-8 md:w-12 lg:h-10 lg:w-14 bg-gray-400 rounded-full" />
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
                                        <div className="w-full h-16 sm:h-24 md:h-32 lg:h-40 bg-gray-400 rounded-lg" />
                                    </div>
                                </div>
                                <div className="col-span-3 space-y-2">
                                    <div className="flex justify-end">
                                        <div className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 bg-gray-400 rounded-full" />
                                    </div>
                                    <div className="w-full h-16 sm:h-24 md:h-32 lg:h-40 bg-gray-400  rounded-lg" />
                                </div>
                            </div>
                            <div className="grid grid-cols-10 mt-1 sm:mt-6 md:mt-8 lg:mt-10">
                                <div className="col-span-10">
                                    <div className="w-full h-20 sm:h-28 md:h-44 lg:h-52 bg-gray-400 rounded-lg" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Browser;