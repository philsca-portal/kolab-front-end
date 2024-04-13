import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { formSchema } from "./main-change-password";
import * as z from "zod";

interface ChangePasswordFormProps{
    form: UseFormReturn<{
        newPassword: string;
        reEnterNewPassword: string;
    }, any, undefined>
    onSubmit: (values: z.infer<typeof formSchema>) => void
    handleNewPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    valid: boolean,
    loading: boolean
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
    form,
    onSubmit,
    handleNewPasswordChange,
    valid,
    loading
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    }
    
    return(
        <div className="h-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="h-full space-y-4 flex justify-center items-center">
                    <div className="flex flex-col space-y-8 w-3/4">
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold">New Password</FormLabel>
                                            <FormControl>
                                                <div className="relative flex">
                                                    <Input disabled={loading} type={`${showPassword ? 'text' : 'password'}`} {...field} onChange={(e) => {
                                                        field.onChange(e);
                                                        handleNewPasswordChange(e);
                                                    }} />
                                                    <div className="flex items-center">
                                                        <div onClick={togglePassword} className="absolute right-6 top-[10px] text-gray-400 hover:scale-110 cursor-pointer transition">
                                                            {field.value.length === 0 ? '' : showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                                        </div>
                                                    </div>
                                                </div>
                                            </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="reEnterNewPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold">re-Enter New Password</FormLabel>
                                            <FormControl>
                                                <div className="relative flex">
                                                    <Input disabled={loading} readOnly={!valid} className="read-only:opacity-30 read-only:pointer-events-none" type={`${showPassword ? 'text' : 'password'}`}  {...field} />
                                                    <div className="flex items-center">
                                                        <div onClick={togglePassword} className="absolute right-6 top-[10px] text-gray-400 hover:scale-110 cursor-pointer transition">
                                                            {field.value.length === 0 ? '' : showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                                        </div>
                                                    </div>
                                                </div>
                                            </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button className="font-extrabold uppercase" type="submit">Save</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default ChangePasswordForm;