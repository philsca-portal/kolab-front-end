import axios from "axios";
import ChangePasswordForm from "./change-password-form";
import PasswordValidation from "./password-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";

interface MainChangePasswordProps{
    session: Session | null
}

export const formSchema = z.object({
    newPassword: z.string().min(8).max(50)
        .refine((value) => /[A-Z]/.test(value), {
            message: "Password must contain at least one uppercase letter",
        })
        .refine((value) => /[a-z]/.test(value), {
            message: "Password must contain at least one lowercase letter",
        })
        .refine((value) => /\d/.test(value), {
            message: "Password must contain at least one digit",
        })
        .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
            message: "Password must contain at least one special character",
        }),
    reEnterNewPassword: z.string(),
});

const MainChangePassword: React.FC<MainChangePasswordProps> = ({
    session
}) => {
    const router = useRouter();
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [valid, setValid] = useState(false);

    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasDigit = /\d/.test(newPassword);
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);    
    const hasMinLength = newPassword.length >= 8;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {       
            newPassword: "",
            reEnterNewPassword: ""
        }
    });

    const handleNewPasswordChange= (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewPassword(value);
        form.setValue('newPassword', value);    
    }

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        try {
            if(values.newPassword !== values.reEnterNewPassword){
                toast.error("Password didn't match.");
            }
            else{
                const userId = session?.user.userId;
                setLoading(true);
                const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mainChangePassword`, {values, userId});
                
                if(response.data.success){
                    toast.success("Password updated.");
                    router.push('/dashboard');
                }
            }
        } catch (error) {
            console.log(error);
        } finally{
            setLoading(false);
        }
    }

    return(
        <div className="grid grid-cols-6 h-4/5">
            <div className="col-span-3 h-full w-full">
                <ChangePasswordForm loading={loading} valid={valid} form={form} onSubmit={onSubmit} handleNewPasswordChange={handleNewPasswordChange} />
            </div>
            <div className="col-span-3 h-full w-full">
                <PasswordValidation hasUppercase={hasUppercase} hasLowercase={hasLowercase} hasDigit={hasDigit} hasSpecialCharacter={hasSpecialCharacter} hasMinLength={hasMinLength} setValid={setValid} />
            </div>
        </div>
    )
}

export default MainChangePassword;