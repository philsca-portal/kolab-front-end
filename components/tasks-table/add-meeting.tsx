"use client"
 
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Plus, X } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea";
import CalendarStartDate from "./calendar-start-date";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { Label } from "../ui/label";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import { Session } from "next-auth";

const formSchema = z.object({
    meetingName: z.string().min(5).max(50),
    description: z.string().min(10),
    startDate: z.date(),
    endDate: z.date(),
    invitedMembers: z.array(z.object({
        email: z.string().email(),
    }))
});

interface AddMeetingProps{
    teamDataTeamId: string;
    setOpenTable: Dispatch<SetStateAction<boolean>>;
    session: Session | null
}
const emailSchema = z.string().email();

const AddMeeting: React.FC<AddMeetingProps> = ({
    teamDataTeamId,
    setOpenTable,
    session
}) => {

    const { theme } = useTheme();
    const router = useRouter();
    const [date, setDate] = useState<Date>();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState<{email: string;}[]>([]);
    const [isAddEmail, setIsAddEmail] = useState('');
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            meetingName: "",
            description: "",
            startDate: undefined,
            endDate: undefined,
            invitedMembers: []
        },
    });

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputSkill = event.target.value;
        setIsAddEmail(inputSkill);
    }

    const handleDeleteEmail = useCallback((index: number) => {
        email.splice(index, 1);
        form.setValue("invitedMembers", email);
        router.refresh();
    }, [email, form, router]);
    
    const handleOpenChange = (open: boolean) => {
        if(!open){
            setOpen(false);
        }
    }

    const handleValueOnChange1 = (e: any) => {
        if (date) {

            const time = e.target.value;
            const [hours, minutes] = time.split(":");
            
            const newDate = new Date(date);
            newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
            form.setValue('startDate', newDate);
        }
    }

    const handleValueOnChange2 = (e: any) => {
        if (date) {
            const time = e.target.value;
            const [hours, minutes] = time.split(":");
            
            const newDate = new Date(date);
            newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
            form.setValue('endDate', newDate);     
        }   
    }
    
    const openDialog = () => {
        setOpen(true);
    }

    const hideDialog = () => {
        setOpen(false);
    }

    const addEmail = useCallback(async() => {
        try {
            setLoading(true);
            emailSchema.parse(isAddEmail);
                try {
                    if(email.map((item) => item.email).includes(isAddEmail)){
                        toast.error('Email is already added.');
                    }else{
                        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkEmailExistence`, {
                            email: isAddEmail
                        });

                        if(response.data.extractedData.email !== session?.user.email){
                            if(response.data.success === false){
                                toast.error('Email does not exist.');
                            }else{

                                const extractedData = response.data.extractedDataonlyEmail
                                setEmail((prevArray) => {
                                    const newArray = [...prevArray, ...extractedData];
                                    form.setValue("invitedMembers", newArray);
                                    return newArray;
                                });
                            }
                        }else{
                            toast.error('You cannot add your email.');
                        }
                    }

                    setIsAddEmail('');

                } catch (error) {
                    toast.error('Something went wrong.');
                } finally{
                    setLoading(false);
                } 
        } catch (error) {
            toast.error("Invalid email.");
        }

    }, [isAddEmail, setEmail, setIsAddEmail, email, form, session?.user.email]);

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        const currentDate = new Date();

        if(values.startDate < currentDate){
            form.setError("startDate", {
                type: "manual",
                message: "Unable to add meeting: The selected start date is in the past. Please choose a future date for the meeting.",
            });
        }else if (values.endDate < values.startDate) {
            // If endDate is lower than date, set an error in the form
            form.setError("endDate", {
                type: "manual",
                message: "End date must be greater than start date.",
            });
        }else if(values.invitedMembers.length === 0){
            form.setError("invitedMembers", {
                type: "manual",
                message: "Invite one or more Members.",
            });
        }else{
            try {
                setLoading(true);
                const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/addMeeting`, {
                    values,
                    teamDataTeamId
                });

                if(response.data.success === true){
                    const members = values.invitedMembers;
                    const addToMeetingNotification = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/addToMeetingNotification`, { members, teamDataTeamId });
                    
                    if(addToMeetingNotification.data.success){
                        toast.success("Meeting created.");
                        form.reset();
                        setOpen(false);
                        setOpenTable(false);
                    }else{
                        toast.error('Something went wrong. (Notification)');
                    }
                }else{
                    toast.error("Invited Member/s is not part of a team.");
                }
                
            } catch (error) {
                toast.error("Something went wrong.");
                console.log(error);
            } finally{
                setLoading(false);
            }
        }
    }
    
    return(
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <div className="flex justify-end">
                <Button onClick={openDialog} className={`border-dashed border-2 ${theme === 'dark' ? 'border-white' : 'border-black'} `} variant={"outline"} size={"sm"}><Plus className="h-4 w-4 mr-1" />Add</Button>
            </div>
            <DialogContent className=" min-w-max">
                <DialogHeader>
                    <DialogTitle className="font-bold">Add a Meeting</DialogTitle>
                    <DialogDescription>
                        Get the squad together! Easily add a meeting with your pals for some good times ahead.
                    </DialogDescription>
                </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                            control={form.control}
                            name="meetingName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Meeting name" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea className="h-20 ml-1" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <div className="flex w-full space-x-2">
                                <div className="flex flex-col w-1/3">
                                    <Label className="mb-2">Date</Label>
                                    <CalendarStartDate date={date} setDate={setDate} />
                                </div>
                                <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col w-1/3">
                                        <FormLabel>Start-time</FormLabel>
                                        <FormControl>
                                            <div className="flex">
                                                <Input onChange={handleValueOnChange1} type="time" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                                    <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col w-1/3">
                                        <FormLabel>End-time</FormLabel>
                                        <FormControl>
                                            <div>
                                                <Input onChange={handleValueOnChange2} type="time" />
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
                                    name="invitedMembers"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="flex items-center flex-wrap">
                                                    {email.map((email,index) => (
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
                                                            <DialogTitle>Add a Member</DialogTitle>
                                                            <DialogDescription>
                                                                Bring someone on board: Add a member in the meeting.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                            <Input type="text" value={isAddEmail} onChange={handleEmailChange} />
                                                        <DialogFooter>
                                                            <DialogClose asChild>
                                                                <Button onClick={addEmail} >Add</Button>
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
                            <div className="flex justify-end space-x-4">
                                <Button disabled={loading} onClick={hideDialog} variant={"secondary"} type="button">Cancel</Button>
                                <Button disabled={loading} type="submit">Submit</Button>
                            </div>
                        </form>
                    </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddMeeting;