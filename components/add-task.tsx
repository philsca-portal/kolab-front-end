"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { CalendarIcon, ClipboardList, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import FileUploader from "./file-uploader";
import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { imageDatabase } from '@/firebase/firebase-sdk';
import { v4 } from "uuid";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";

interface AddTaskProps {
    projectData: {
        adminName: string | null | undefined;
        members: {
            id: string;
            TeamId: string;
            name: string;
            email: string;
            image: string;
        }[] | undefined;
        userId: string | undefined;
        teamIcon: string | undefined;
        teamName: string | undefined;
        id: string;
        TeamId: string;
        projectName: string;
    };
    session: Session | null;
}

const formSchema = z.object({
    title: z.string().min(5),
    description: z.string().min(10),
    tag: z.string().min(1),
    assignedTo: z.string().min(1),
    priority: z.string().min(1),
    dueDate: z.date(),
    attachments: z.array(z.object({
        fileName: z.string(),
        url: z.string()
    }))
});

const AddTask: React.FC<AddTaskProps> = ({
    projectData,
    session
}) => {

    const router = useRouter();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const startDate = new Date();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            tag: '',
            assignedTo: '',
            priority: '',
            dueDate: undefined,
            attachments: []
        }
    });

    const onOpenDialog = () => {
        setOpen(true);
    }
    const onCloseDialog = () => {
        setOpen(false);
    }

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setOpen(false);
        }
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            const uploadFiles = async () => {
                const attachmentUrls: { fileName: string, url: string }[] = [];

                const uploadPromises = selectedFiles.map(async (file) => {
                    const storageRef = ref(imageDatabase, `uploads/${v4() + '_' + file.name}`);
                    const uploadTask = await uploadBytes(storageRef, file);

                    if (uploadTask) {
                        const fileName = file.name;
                        const url = await getDownloadURL(storageRef);
                        attachmentUrls.push({ fileName, url });
                    }
                });

                await Promise.all(uploadPromises);

                form.setValue("attachments", attachmentUrls);
            };

            await uploadFiles();

            const projectId = projectData.id;
            try {
                const formData = form.getValues();
                const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/addTask`, {
                    values: formData,
                    projectId
                });

                if (response.data.success) {

                    const userId = session?.user.userId;
                    const assignedTo = formData.assignedTo;

                    const addToTaskNotification = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/addToTaskNotification`, { userId, assignedTo });

                    if (addToTaskNotification.data.success) {
                        toast.success('Task has been added.');
                        form.reset();
                        setSelectedFiles([]);
                        setOpen(false);
                    }else{
                        toast.error("Task Notification hasn't been added.");
                    }
                } else {
                    toast.error("Task hasn't been added.");
                }

            } catch (error) {
                toast.error('Something went wrong.');
                console.log(error)
            } finally {
                setLoading(false);
            }
        } catch (error) {
            toast.error('Something went wrong.(File)');
            console.log(error);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger onClick={onOpenDialog} asChild>
                <Button size={"sm"}>
                    <Plus className="mr-1 h-4 w-4" />
                    Add new Task
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex justify-center items-center">
                        <ClipboardList className="h-8 w-8 mr-2" />
                        Add Task
                    </DialogTitle>
                    <DialogDescription className="flex justify-center items-center text-center">
                        Start a new task and get closer to your goals.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="w-full py-2 space-y-4">
                            <div className="flex flex-col space-y-4">
                                <div className="flex space-x-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter Task Title..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="tag"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tag</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter Task Tag..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Enter Task Description..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex space-x-4">
                                    <FormField
                                        control={form.control}
                                        name="assignedTo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Assigned To</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger className="w-[143px]">
                                                            <SelectValue placeholder="Pick a member" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {projectData.members?.map((item, index) => (
                                                                <SelectItem value={item.id} key={index}>
                                                                    <div className="flex justify-center items-center">
                                                                        <Avatar className="h-7 w-7 mr-2">
                                                                            <AvatarImage src={item.image} />
                                                                            <AvatarFallback>CN</AvatarFallback>
                                                                        </Avatar>
                                                                        <h1 className="text-xs">{item.name}</h1>
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="priority"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Priority</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger className="w-[143px]">
                                                            <SelectValue placeholder="Pick priority" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="LOW">LOW</SelectItem>
                                                            <SelectItem value="NORMAL">NORMAL</SelectItem>
                                                            <SelectItem value="HIGH">HIGH</SelectItem>
                                                            <SelectItem value="URGENT">URGENT</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="dueDate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col space-y-3">
                                                <FormLabel className="pointer-events-none pt-[0.42rem]">Due Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-[143px] pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            fromDate={startDate}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="attachments"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Attachments</FormLabel>
                                            <FormControl>
                                                <FileUploader setSelectedFiles={setSelectedFiles} selectedFiles={selectedFiles} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button onClick={onCloseDialog} disabled={loading} type="button" variant={"secondary"}>
                                    Cancel
                                </Button>
                                <Button disabled={loading} type="submit" variant={"default"}>
                                    {loading ?
                                        <div className={`${loading ? 'block' : 'hidden'} h-5 w-5 border-4 border-gray-500 rounded-full border-l-transparent animate-loader-spin`}>
                                        </div>
                                        :
                                        'Create'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddTask;