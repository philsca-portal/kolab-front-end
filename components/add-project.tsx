"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTheme } from "next-themes";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Session } from "next-auth";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { FolderGit2 } from "lucide-react";

interface AddProjectProps {
    session: Session | null
}

const formSchema = z.object({
    teamId: z.string().min(1),
    projectName: z.string().min(1)
});

const AddProject: React.FC<AddProjectProps> = ({
    session
}) => {

    const { theme } = useTheme();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [teamData, setTeamData] = useState<{
        id: string;
        userId: string;
        teamName: string;
        teamIcon: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            teamId: "",
            projectName: ""
        },
    })

    const openDialog = async () => {

        try {
            setLoading(true);
            const userId = session?.user.userId;

            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/CheckUserIfHasTeam`, {
                userId
            });

            if (response.data.success === true) {
                setOpen(true);
                setTeamData(response.data.team);
            } else if (response.data.success === false) {
                setOpen(false);
                toast.error("You aren't an admin to a team.");
            }

        } catch (error) {
            toast.error('Something went wrong.')
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const closeDialog = () => {
        setOpen(false);
    }

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setOpen(false);
        }
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/addProject`, {
                values,
            });

            if (response.data.success === true) {

                const userId = session?.user.userId;
                const teamId = values.teamId;

                const addToProjectNotification = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/addToProjectNotification`, { userId, teamId });

                if (addToProjectNotification.data.success) {
                    toast.success('Project created.');
                    form.reset();
                    setOpen(false);
                } else {
                    toast.error('Something went wrong.(Notification)');
                }
            } else {
                toast.error('Project not created.');
            }

        } catch (error) {
            toast.error('Something went wrong.');
            console.log(error);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <div onClick={openDialog} className="cursor-pointer">
                <Badge className={`w-full bg-transparent border border-dashed ${theme === "dark" ? 'border-white hover:bg-slate-800' : 'border-black hover:bg-slate-200'}`}>
                    <span className="w-full text-center text-primary">+</span>
                </Badge>
            </div>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex justify-center items-center">
                        <FolderGit2 className="h-8 w-8 mr-2" />
                        Create a Project
                    </DialogTitle>
                    <DialogDescription className="flex justify-center items-center text-center">
                        Launch your idea: Bring your vision to life by starting a new project.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name="teamId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Team:</FormLabel>
                                            <FormControl>
                                                <Select disabled={loading} onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue placeholder="Select a team" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Team</SelectLabel>
                                                            {teamData?.map((item, index) => (
                                                                <SelectItem key={index} value={item.id}>
                                                                    <div className="flex items-center text-xs">
                                                                        <Avatar className="mr-2 h-4 w-4">
                                                                            <AvatarImage src={item.teamIcon} />
                                                                            <AvatarFallback>CN</AvatarFallback>
                                                                        </Avatar>
                                                                        {item.teamName}
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name="projectName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Project Name:</FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} placeholder="Enter project name..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button disabled={loading} onClick={closeDialog} variant={"secondary"} type="button">Cancel</Button>
                            <Button disabled={loading} type="submit">Submit</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddProject;