"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod"
 
interface DeleteSectionProps{
    session: Session | null
}

const formSchema = z.object({
    confirmation: z.string().refine((data) => data === "DELETE ACCOUNT", {
      message: "Confirmation must be 'DELETE ACCOUNT'",
    }),
});

const DeleteSection: React.FC<DeleteSectionProps> = ({
    session
}) => {

    const router = useRouter();

    const [openDelete, setOpenDelete] = useState(false);

    const openDialogDelete = () => {
        setOpenDelete(true);
    }

    const closeDialogDelete = () => {
        setOpenDelete(false);
    }

    const handleOnOpenChange = (open: boolean) => {
        if(!open){
            setOpenDelete(false);
        }
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          confirmation: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if(values.confirmation === 'DELETE ACCOUNT'){
            try {
                const userId = session?.user.userId;
            
                const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/deleteAccount`,{
                    userId
                });

                if(response.data.success){
                    toast.success('Account deleted.');
                    form.reset();
                    router.refresh();
                }
            } catch (error) {
                toast.error('Something went wrong.');
                console.log(error);
            }
        }
    }

    return(
        <Dialog open={openDelete} onOpenChange={handleOnOpenChange}>
            <Button className="text-xs md:text-sm" onClick={openDialogDelete} variant={"destructive"}>DELETE ACCOUNT</Button>
        <DialogContent className="sm:max-w-[425px]">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <DialogHeader>
                    <DialogTitle>Delete account</DialogTitle>
                    <DialogDescription>
                        <p>Are you sure you want to delete your account?</p>
                        <p>
                            Type 
                            <span className="font-extrabold uppercase text-destructive italic px-2">Delete account</span> 
                            below to continue.
                        </p>
                    </DialogDescription>
                    </DialogHeader>
                        <FormField
                            control={form.control}
                            name="confirmation"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <FormLabel htmlFor="confirmation" className="text-right">
                                            Confirmation
                                        </FormLabel>
                                        <FormControl>                                     
                                            <Input
                                            id="confirmation"
                                            placeholder="DELETE ACCOUNT"
                                            className="col-span-3"
                                            {...field}
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage className="flex justify-end" />
                                </FormItem>
                            )}
                        />
                    <DialogFooter>
                        <Button onClick={closeDialogDelete} variant={"secondary"} type="submit">Cancel</Button>
                        <Button variant={"destructive"} type="submit">Delete account</Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
        </Dialog>
    )
}

export default DeleteSection;