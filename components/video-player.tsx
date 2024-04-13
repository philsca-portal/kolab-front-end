"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { PlayCircle } from "lucide-react";

const VideoPlayer = () => {
    return(
        <Dialog>
            <DialogTrigger asChild>
                <Button className="sm:h-14 group hover:bg-transparent transition" variant={"ghost"}>
                    <div className="flex items-center">
                        <div className="rounded-full bg-[#5B7553] group-hover:bg-[#346c30] group-hover:rotate-[360deg] transition ring-2 ring-offset-2 ring-black">
                        <PlayCircle className="h-10 w-10 text-white p-2" />
                        </div>
                        <div className="flex flex-col ml-3">
                            <p className="text-[11px] sm:text-base font-bold text-[#5B7553] group-hover:text-[#346c30]">Watch this video</p>
                            <p className="text-[11px] sm:text-sm font-semibold">2min 5 sec</p>
                        </div>
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent className="flex justify-center items-center max-w-max">
            <DialogHeader>
            </DialogHeader>
                <iframe height={550} width={1250} src="https://www.youtube.com/embed/YLtZEHItpdw?autoplay=1">
                </iframe>
            </DialogContent>
        </Dialog>
    )
}

export default VideoPlayer;