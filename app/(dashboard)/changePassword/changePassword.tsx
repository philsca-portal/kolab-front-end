"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowRight, Check, Eye, EyeOff, Key, Lock, SendHorizontal, X } from "lucide-react";
import { Session } from "next-auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import MainChangePassword from "./components/main-change-password";

interface ChangePasswordProps {
    session: Session | null
}

const formSchema = z.object({
    currentPassword: z.string()
});

const ChangePassword: React.FC<ChangePasswordProps> = ({
    session
}) => {

    const [open, setOpen] = useState(false);
    const [validCurrentPassword, setValidCurrentPassword] = useState<boolean>();
    const [isbuttonClicked, setIsButtonClicked] = useState(false);
    const [isProceedClicked, setIsProceedClicked] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    }

    const handleMouseEnter = () => {
        setOpen(true);
    };

    const handleMouseLeave = () => {
        setOpen(false);
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currentPassword: ""
        }
    });

    const onCheckPassword = async (values: z.infer<typeof formSchema>) => {
        try {
            const userId = session?.user.userId;
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/checkCurrentPassword`, {
                values,
                userId
            });

            if (response.data.success) {
                setValidCurrentPassword(true);
            } else {
                setValidCurrentPassword(false);
            }
        } catch (error) {
            console.log(error);
            setValidCurrentPassword(false);
        }
    }

    const buttonClicked = () => {
        setIsButtonClicked(true);
    }

    const proceedButtonClicked = () => {
        setIsProceedClicked(true);
    }

    return (
        <div className="py-8 space-y-8 h-full">
            <div className="space-y-4">
                <div>
                    <h1 className="flex items-center text-3xl uppercase font-extrabold">
                        <Key className="h-8 w-8 mr-2" />
                        Change Password
                    </h1>
                    <p className="font-bold text-gray-400 ml-10">Manage your security</p>
                </div>
                <Separator orientation="horizontal" />
            </div>
            {isProceedClicked ?
                <MainChangePassword session={session} />
                :
                <div className="flex flex-col justify-center items-center">
                    <div className="flex flex-col items-center px-6 mt-4 space-y-4 lg:w-3/5">
                        <Lock className="h-24 w-24" />
                        <h1 className="flex items-center text-3xl font-extrabold">
                            Secure Password Update
                        </h1>
                        <p className="text-sm md:text-md font-semibold italic text-gray-600 text-center">
                            Use the form below to securely update your account password. Ensure that your new password adheres to the specified criteria for a strong and secure password. For assistance or inquiries, please reach out to our support team. Your account security is our top priority.
                        </p>
                        <div className="py-4">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onCheckPassword)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="currentPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-semibold">Current Password</FormLabel>
                                                <FormControl>
                                                    <div className="relative flex w-80">
                                                        <Input type={`${showPassword ? 'text' : 'password'}`} readOnly={validCurrentPassword} className={` ${validCurrentPassword ? 'border-green-500' : ''} ${validCurrentPassword === false ? 'border-red-500' : ''} read-only:text-gray-700`} {...field} />
                                                        <div className="flex items-center">
                                                            <div onClick={togglePassword} className="absolute right-9 top-[10px] text-gray-400 hover:scale-110 cursor-pointer transition">
                                                                {field.value.length === 0 ? '' : showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                                            </div>
                                                            <div className="absolute right-3 top-2 text-gray-400 hover:scale-110 cursor-pointer transition">
                                                                <Popover open={open} onOpenChange={setOpen}>
                                                                    <PopoverTrigger onMouseEnter={handleMouseEnter}
                                                                        onMouseLeave={handleMouseLeave} asChild>
                                                                        <button onClick={buttonClicked} disabled={validCurrentPassword} type="submit">
                                                                            {isbuttonClicked ? validCurrentPassword ? <Check className="h-5 w-5 text-green-500 animate-opacity-transition-1sec" /> : '' : <SendHorizontal className="h-5 w-5" />}
                                                                            {isbuttonClicked ? validCurrentPassword === false ? <X className="h-5 w-5 text-red-500" /> : '' : ''}
                                                                        </button>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent onMouseEnter={handleMouseEnter}
                                                                        onMouseLeave={handleMouseLeave} className="w-80">
                                                                        <p>
                                                                            &quot;For security verification, please provide your existing password. This step helps us ensure the authenticity of the account holder and safeguards your sensitive information.&quot;
                                                                        </p>
                                                                    </PopoverContent>
                                                                </Popover>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="w-80 text-center">
                                                    {validCurrentPassword ?
                                                        <span className="text-green-500 text-xs">Current password is correct. You can proceed with changing your password.</span>
                                                        :
                                                        ''}
                                                    {validCurrentPassword === false ? <span className="text-red-500 text-xs">Current password is invalid or incorrect. Please try again.</span>
                                                        :
                                                        ''}
                                                </FormMessage>
                                            </FormItem>
                                        )}
                                    />
                                </form>
                            </Form>
                        </div>
                    </div>
                    {validCurrentPassword ? <Button onClick={proceedButtonClicked} variant={"ghost"} type="button">Proceed <ArrowRight className="h-4 w-4 ml-2" /></Button> : ''}
                </div>}
        </div>
    )
}

export default ChangePassword;