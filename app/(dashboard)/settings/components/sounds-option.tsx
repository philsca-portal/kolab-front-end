"use client"

import { Form, FormField, FormItem } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { FileAudio } from "lucide-react";
import { Session } from "next-auth";
import { UseFormReturn } from "react-hook-form";
import toast from "react-hot-toast";

interface SoundsOptionProps{
    session: Session | null
    form : UseFormReturn<{
        sounds: string;
        mute: string;
    }, any, undefined>
    handleSoundChange: (value: any) => void
}

const SoundsOption: React.FC<SoundsOptionProps> = ({
    session,
    form,
    handleSoundChange
}) => {

    const { handleSubmit, setValue, getValues } = form;

    const onSubmit = async () => {
        const formData = getValues();
        const userId = session?.user.userId;
        
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notificationSound`, { userId, sounds: formData.sounds });
            if (response.data.success) {
                toast.success("Notification Sound changed.");
            }
        } catch (error) {
            toast.error("Something went wrong.");
            console.log(error);
         }
    };

    return(
        <Form {...form}>
            <form>
                <FormField 
                    control={form.control}
                    name="sounds"
                    render={({field}) => (
                        <FormItem>
                            <Select value={field.value} defaultValue={field.value} onValueChange={(value) => {
                            setValue('sounds', value);
                            handleSoundChange(value);
                            
                             handleSubmit(onSubmit)();
                            }}>
                                <SelectTrigger className="w-64">
                                    <SelectValue defaultValue={field.value} placeholder="Select a sound" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="none">
                                            <span className="flex justify-center items-center">
                                                - none -
                                            </span>
                                        </SelectItem>
                                        <SelectItem value="shootingSoundFx">
                                            <span className="flex justify-center items-center">
                                                <FileAudio className="h-4 w-4 mr-2" /> 
                                                Shooting-sound-fx
                                            </span>
                                        </SelectItem>
                                        <SelectItem value="notificationSoundFx">
                                            <span className="flex justify-center items-center">
                                                <FileAudio className="h-4 w-4 mr-2" /> 
                                                Notification-sound-fx
                                            </span>
                                        </SelectItem>
                                        <SelectItem value="stopSoundFx">
                                            <span className="flex justify-center items-center">
                                                <FileAudio className="h-4 w-4 mr-2" /> 
                                                Stop-sound-fx
                                            </span>
                                        </SelectItem>
                                        <SelectItem value="notificationEmailFx">
                                            <span className="flex justify-center items-center">
                                                <FileAudio className="h-4 w-4 mr-2" /> 
                                                Email-sound-fx
                                            </span>
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}

export default SoundsOption;