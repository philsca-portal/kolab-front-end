"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import axios from "axios"
import toast from "react-hot-toast"
import { Dispatch, SetStateAction } from "react"
import { Session } from "next-auth"

const FormSchema = z.object({
    date: z.date({
        required_error: "This field is required.",
    }),
})

interface ReAssignCalendarProps {
    session: Session | null;
    taskId: string;
    setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const ReAssignCalendar: React.FC<ReAssignCalendarProps> = ({
    session,
    taskId,
    setOpenDialog
}) => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    const currentDate = new Date();

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {

            const date = data.date;
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/taskReAssign`, {
                date,
                taskId
            });

            if (response.data.success) {
                const reAssignNotification = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reAssignNotification`, {
                    
                    sendersId: session?.user.userId,
                    taskId
                });

                if (reAssignNotification.data.success) {
                    toast.success('Task Re-assigned.');
                    setOpenDialog(false);
                    form.reset();
                } else {
                    toast.error('Something went wrong.(Notification)');
                }
            } else {
                toast.error('Something went wrong.(task)')
            }
        } catch (error) {
            toast.error('Something went wrong.');
            console.log(error);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] pl-3 text-left font-normal",
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
                                        initialFocus
                                        fromDate={currentDate}
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end">
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </Form>
    )
}

export default ReAssignCalendar;