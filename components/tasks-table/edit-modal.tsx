"use client";

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "../ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Modal } from "./modal";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Task } from "./columns";
import CalendarStartDateEdit from "./calendar-start-date-edit";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface EditModalProps{
    isopen: boolean;
    onclose: () => void;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>
    setOpenTable: Dispatch<SetStateAction<boolean>>
    data: Task
}

const formSchema = z.object({
    meetingName: z.string().min(5).max(50),
    description: z.string().min(10),
    startDate: z.date(),
    endDate: z.date(),
});

const EditModal: React.FC<EditModalProps> = ({
    isopen,
    onclose,
    loading,
    setLoading,
    setOpenTable,
    data
}) => {
    const [isMounted, setIsMounted] = useState(false);
    const [date, setDate] = useState<Date>();

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            meetingName: data.name,
            description: data.description,
            startDate: undefined,
            endDate: undefined
        },
    });

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

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        if (values.endDate < values.startDate) {
            form.setError("endDate", {
                type: "manual",
                message: "End date must be greater than start date",
            });
        }else{
            try {
                setLoading(true);
                const meetingId = data.id;
                const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/updateMeeting`, {
                    values,
                    meetingId
                });

                if(response.data.success){
                    toast.success("Meeting has been updated.");
                    router.refresh();
                    setOpenTable(false);
                }
                
            } catch (error) {
                toast.error("Something went wrong.");
            } finally{
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        setIsMounted(true);
    },[date]);

    if(!isMounted){
        return null;
    }

    return(
        <Modal title="Edit"
                description="Make changes to your data here. Please review your edits before saving. This action allows you to update information without affecting other related data."
                isOpen={isopen}
                onClose={onclose}>
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
                                    <CalendarStartDateEdit date={date} setDate={setDate} />
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
                            <div className="flex justify-end space-x-4">
                                <Button disabled={loading} onClick={onclose} variant={"secondary"} type="button">Cancel</Button>
                                <Button disabled={loading} type="submit">Save</Button>
                            </div>
                        </form>
                    </Form>
        </Modal>
    )
}

export default EditModal;