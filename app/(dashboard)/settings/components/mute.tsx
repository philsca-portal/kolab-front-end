"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import useMutedStore from "@/hook/use-muted";
import axios from "axios";
import { BellOff, BellRing } from "lucide-react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { UseFormReturn } from "react-hook-form";
import toast from "react-hot-toast";

interface MuteProps{
    session: Session | null;
    existingSettingsData: {
        id: string;
        userId: string;
        notificationSound: string | null;
        muteDuration: string | null;
    } | null;
    form: UseFormReturn<{
        sounds: string;
        mute: string;
    }, any, undefined>;
    isMuted: boolean;
    isSwitch: boolean;
    removeMuteDialog: boolean;
    setIsMuted: Dispatch<SetStateAction<boolean>>
    setIsSwitch: Dispatch<SetStateAction<boolean>>
    setRemoveMuteDialog: Dispatch<SetStateAction<boolean>>
}

const Mute: React.FC<MuteProps> = ({
    session,
    existingSettingsData,
    form,
    isMuted,
    isSwitch,
    removeMuteDialog,
    setIsMuted,
    setIsSwitch,
    setRemoveMuteDialog
}) => {

    const { getValues, setValue } = form;

    const router = useRouter();

    const { onMuted } = useMutedStore();

    const onSubmit = async () => {
        const formData = getValues();
        const userId = session?.user.userId;
            
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/muteDuration`, { userId, mute: formData.mute });
            if (response.data.success) {
                toast.success("Mute duration changed.");
                onMuted(true);
                if (formData.mute === "infinite") {
                    setIsSwitch(false);
                    setIsMuted(true);
                    return;
                }

                setIsSwitch(false);
                setIsMuted(true);

                (async () => {
                    try {
                        const response1 = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getMuteDuration`, { userId });
                        const muteDuration = response1.data;
                        
                        setTimeout(async () => {
                            router.refresh();
                            setIsMuted(true);
                            const response2 = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/deleteMuteDuration`, { userId });
                            
                            if (response2.data.success) {
                                toast.success("Mute duration expired.");
                                setIsMuted(false);
                                onMuted(false);
                            }
                        }, muteDuration * 60 * 1000);
                    } catch (error) {
                        toast.error("Something went wrong.");
                        console.log(error);
                    }
                })();
            }
        } catch (error) {
            toast.error("Something went wrong.");
            console.log(error);
         }
    };

    const onRemoveMute = async() => {
        const userId = session?.user.userId;
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/deleteMuteDuration`, { userId });
            
            if(response.data.success){
                toast.success("notification unmuted.");
                onMuted(false);
                setRemoveMuteDialog(false);
                setIsMuted(false);
                setValue('mute', '');
            }
        } catch (error) {
            toast.error("Something went wrong.");
            console.log(error);
        }
    }

    const handleOnclickRemoveMuteDialog = () => {
        setRemoveMuteDialog(true);
    }
    
    const handleNullOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setIsSwitch(false);
        }
    }

    const handleNotNullOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setRemoveMuteDialog(false);
        }
    }

    const handleOnClose = () => {
        setIsSwitch(false);
    }

    const handleOnCloseRemoveDialog = () => {
        setRemoveMuteDialog(false);
    }
    
    return(
        <>
            <div className="flex items-center space-x-2 mt-2">
                <Switch onClick={existingSettingsData?.muteDuration !== undefined ? isMuted === true ? handleOnclickRemoveMuteDialog : undefined : undefined} checked={existingSettingsData?.muteDuration !== undefined ? isMuted : isSwitch} onCheckedChange={existingSettingsData?.muteDuration !== undefined && null ? setIsMuted : setIsSwitch} />
                {isMuted ? <BellOff className="h-4 w-4" /> : <BellRing className="h-4 w-4" />}
            </div>
            <Dialog open={isSwitch} onOpenChange={handleNullOpenChange}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Mute Notifications</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                        <FormField
                            control={form.control}
                            name="mute"
                            render={({ field }) => (
                            <FormItem>
                                <RadioGroup className="mt-4 space-y-2" onValueChange={field.onChange}
                                value={field.value}
                                defaultValue={field.value}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="15" id="r1" />
                                        <Label htmlFor="r1">For 15 minutes</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="60" id="r2" />
                                        <Label htmlFor="r2">for 1 hour</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="480" id="r3" />
                                        <Label htmlFor="r3">for 8 hours</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="1440" id="r4" />
                                        <Label htmlFor="r4">for 24 hours</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="infinite" id="r5" />
                                        <Label htmlFor="r5">Until I turn it back on</Label>
                                    </div>
                                </RadioGroup>
                            </FormItem>
                            )}
                        />
                        </Form>
                        <DialogFooter>
                        <div className="flex justify-end space-x-4">
                            <Button onClick={handleOnClose} variant={"secondary"}>Cancel</Button>
                            <Button onClick={onSubmit} type="submit">Mute</Button>
                        </div>
                        </DialogFooter>
                    </DialogContent>
        </Dialog>
        <Dialog open={removeMuteDialog} onOpenChange={handleNotNullOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Mute Notifications</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove the mute?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                    <div className="flex justify-end space-x-4">
                        <Button onClick={handleOnCloseRemoveDialog} variant={"secondary"}>Cancel</Button>
                        <Button onClick={onRemoveMute} type="button">Remove</Button>
                    </div>
                    </DialogFooter>
                </DialogContent>
        </Dialog>
    </>
    )
}

export default Mute;