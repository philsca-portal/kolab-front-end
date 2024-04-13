"use client";

import { ScrollText } from "lucide-react";
import { Button } from "./ui/button";
import { DialogHeader, Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Session } from "next-auth";

interface ViewAssignmentsProps{
    session: Session | null;
    teamData: string
}

const ViewAssignments: React.FC<ViewAssignmentsProps> = ({
    session,
    teamData
}) => {
    return(
        <Dialog>
            <DialogTrigger asChild>
                <Button className="text-xs" variant="secondary" size={"sm"}>
                    <ScrollText className="h-4 w-4 mr-1" />
                    View Assignments
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="font-bold">Tasks</DialogTitle>
                    <DialogDescription>
                        {session?.user.userId === teamData ? "Here's the list of tasks in your team!" :  "Here's the list of your tasks!"}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )  
}

export default ViewAssignments;