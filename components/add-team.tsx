"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useTheme } from "next-themes";
import { Badge } from "./ui/badge";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { HeartHandshake, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useCallback, useState } from "react";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { Session } from "next-auth";
import TeamIconUpload from "./ui/team-icon-upload";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { imageDatabase } from "@/firebase/firebase-sdk";
import { v4 } from "uuid";

interface AddTeamProps {
    session: Session | null
}

const formSchema = z.object({
    teamIcon: z.string(),
    teamName: z.string().min(1),
    members: z.array(z.object({
        name: z.string(),
        email: z.string().email(),
        image: z.string(),
    }))
});

const emailSchema = z.string().email();

const AddTeam: React.FC<AddTeamProps> = ({
    session
}) => {

    const { theme } = useTheme();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<Blob | null>(null);
    const [isAddEmail, setIsAddEmail] = useState('');
    const [email, setEmail] = useState<{ name: string; email: string; image: string; }[]>([]);
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            teamIcon: '',
            teamName: '',
            members: [],
        },
    });

    const handleFileChange = (event: any) => {
        const file = event.target.files[0];

        if (file) {
            setSelectedFile(file);
        }
    };

    const openDialog = () => {
        setOpen(true);
    }

    const hideDialog = () => {
        setOpen(false);
    }

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputSkill = event.target.value;
        setIsAddEmail(inputSkill);
    }

    const handleDeleteEmail = useCallback((index: number) => {
        email.splice(index, 1);
        form.setValue("members", email);
        router.refresh();
    }, [email, form, router]);

    const addEmail = useCallback(async () => {
        try {
            setLoading(true);
            emailSchema.parse(isAddEmail);

            try {
                if (email.map((item) => item.email).includes(isAddEmail)) {
                    toast.error('Email is already added.');
                } else {
                    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkEmailExistence`, {
                        email: isAddEmail
                    });

                    if (response.data.extractedData.email !== session?.user.email) {
                        if (response.data.success === false) {
                            toast.error('Email does not exist.');
                        } else {

                            const extractedData = response.data.extractedData1
                            setEmail((prevArray) => {
                                const newArray = [...prevArray, ...extractedData];
                                form.setValue("members", newArray);
                                return newArray;
                            });
                        }
                    } else {
                        toast.error('You cannot add your email.');
                    }
                }

                setIsAddEmail('');

            } catch (error) {
                toast.error('Something went wrong.');
            } finally {
                setLoading(false);
            }
        } catch (error) {
            toast.error("Invalid email.");
            setLoading(false);
        }

    }, [isAddEmail, setEmail, setIsAddEmail, email, session?.user.email, form]);

    const handleOnOpenChange = (open: boolean) => {
        if (!open) {
            setOpen(false);
        }
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const UploadImage = async () => {
                let url = '';
                if (selectedFile) {
                    const imgRef = ref(imageDatabase, v4());
                    const uploadFile = await uploadBytes(imgRef, selectedFile);

                    if (uploadFile) {
                        const downloadUrl = await getDownloadURL(imgRef);
                        url = downloadUrl;
                    }
                }

                form.setValue("teamIcon", url);
            }

            await UploadImage();

            try {
                const formData = form.getValues();
                console.log(formData);
                const userId = session?.user.userId;
                const teamName = formData.teamName;
                const teamIcon = formData.teamIcon;
                const members = formData.members;

                const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/addTeam`, { teamName, teamIcon, members, userId });

                if (response.data.success) {
                    const teamId = response.data.createdTeam.id;
                    
                    const addToTeamNotification = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/addToTeamNotification`, { teamId, members, userId });

                    if (addToTeamNotification.data.success) {
                        toast.success('Team has been created.');
                        setOpen(false);
                        form.reset();
                        setEmail([]);
                        setSelectedFile(null);
                    } else {
                        toast.error('Something went wrong.(Notification)');
                    }
                }
                else {
                    toast.error('Something went wrong.');
                }
            } catch (error: unknown) {
                const { message } = error as Error;
                if (message) {
                    toast.error('Team name already taken.');
                }
                else {
                    toast.error('Something went wrong.');
                }
            }
        } catch (error) {
            toast.error('Something went wrong.(image)');
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOnOpenChange}>
            <div onClick={openDialog} className="cursor-pointer">
                <Badge className={`w-full bg-transparent border border-dashed ${theme === "dark" ? 'border-white hover:bg-slate-800' : 'border-black hover:bg-slate-200'}`}>
                    <span className="w-full text-center text-primary">+</span>
                </Badge>
            </div>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex justify-center items-center">
                        <HeartHandshake className="h-8 w-8 mr-2" />
                        Create a team
                    </DialogTitle>
                    <DialogDescription className="flex justify-center items-center">
                        Build and manage teams easily with role assignments.
                    </DialogDescription>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="w-full py-2 space-y-4">
                                <div className="flex flex-col space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="teamIcon"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="flex justify-center">
                                                        <label htmlFor="fileInput">
                                                            <Avatar className="mx-2 h-40 w-40 hover:ring cursor-pointer transition-all">
                                                                <AvatarImage className="aspect-square object-cover" src={selectedFile ? URL.createObjectURL(selectedFile) : ""} />
                                                                <AvatarFallback className="text-xs">Add icon</AvatarFallback>
                                                            </Avatar>
                                                            <TeamIconUpload handleFileChange={handleFileChange} />
                                                        </label>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex-col space-y-2">
                                        <FormField
                                            control={form.control}
                                            name="teamName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div>
                                                            <Label htmlFor="teamName">
                                                                Team Name:
                                                            </Label>
                                                            <Input
                                                                id="teamName"
                                                                placeholder="Enter a team name"
                                                                className="italic text-xs"
                                                                {...field}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="flex-col space-y-2 max-h-36">
                                        <Label>
                                            Invite Members:
                                        </Label>
                                        <FormField
                                            control={form.control}
                                            name="members"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="flex items-center flex-wrap">
                                                            {email.map((email, index) => (
                                                                <div key={index} className="relative py-2 pr-4 w-fit">
                                                                    <Badge className="w-fit">{email.email}</Badge>
                                                                    <button onClick={() => handleDeleteEmail(index)} type="button" className={`${theme === 'dark' ? 'text-black' : 'text-white'} flex justify-center items-center absolute top-1 right-2 text-xs px-1 bg-primary font-extrabold hover:bg-primary/90 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border-gray-500 border rounded-full`}>
                                                                        <X className="h-4 w-2" />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                            <div className={`${loading ? 'block' : 'hidden'} h-5 w-5 mr-4 border-4 border-gray-500 rounded-full border-l-transparent animate-loader-spin`}></div>
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <div className="py-2 pr-2 cursor-pointer">
                                                                        <Badge className={`w-32 bg-transparent border border-dashed ${theme === "dark" ? 'border-white hover:bg-slate-800' : 'border-black hover:bg-slate-200'}`}>
                                                                            <span className="w-full text-center text-primary">+</span>
                                                                        </Badge>
                                                                    </div>
                                                                </DialogTrigger>
                                                                <DialogContent className="sm:max-w-[425px]">
                                                                    <DialogHeader>
                                                                        <DialogTitle>Create a Team</DialogTitle>
                                                                        <DialogDescription>
                                                                            Build something together: Create a new team for collaboration.
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <Input type="text" value={isAddEmail} onChange={handleEmailChange} />
                                                                    <DialogFooter>
                                                                        <DialogClose asChild>
                                                                            <Button onClick={addEmail}>Add</Button>
                                                                        </DialogClose>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <Button disabled={loading} onClick={hideDialog} type="button" variant={"secondary"}>
                                        Cancel
                                    </Button>
                                    <Button disabled={loading} type="submit" variant={"default"}>
                                        Create
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default AddTeam;