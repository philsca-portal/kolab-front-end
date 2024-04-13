"use client";

import { Session } from "next-auth";
import ProfileContent from "./components/profile-content";
import ProfileSection from "./components/profile-section";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";

interface ProfileProps {
    session: Session | null;
    profileData: any
}

const formSchema = z.object({
    imageUrl: z.string().min(1, { message: 'Please upload a profile image to complete your account setup.' }),
    bio: z.string(),
    skill: z.string()
});

const Profile: React.FC<ProfileProps> = ({
    session,
    profileData
}) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [activityData, setActivityData] = useState<{
            action: string;
            title: string | null;
            date: Date;
        }[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            imageUrl: profileData.image,
            bio: profileData.bio || '',
            skill: ''
        }
    });

    useEffect(() => {
        const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);

        socket.emit('profileActivityData', session?.user.userId);

        socket.on('profileActivityData', (activityData) => {
            setActivityData(activityData);
        });

        return () => {
            socket.disconnect();
        }

    }, [session?.user.userId]);

    console.log(activityData);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            const userId = session?.user.userId;
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile`,
                {
                    data,
                    userId
                });

            if (response.data.success) {
                toast.success("Profile updated.");
                setIsEdit(false);
                router.refresh();
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    const saveEdit = () => {
        setIsEdit(true);
        router.refresh();
    }

    const cancelEdit = () => {
        setIsEdit(false);
        router.refresh();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col lg:grid lg:grid-cols-5 lg:col-span-7 h-full">
                <div className="lg:col-span-2 flex flex-col lg:sticky top-0 lg:h-screen justify-center space-y-8">
                    <div className="flex justify-end mb-6">
                        {isEdit ?
                            <div>
                                <button disabled={loading} type="submit" className="uppercase mr-16 h-10 px-4 py-2 translate-x-12 translate-y-6 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-extrabold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                                    <Save className="h-4 w-4 mr-1" />
                                    Save
                                </button>
                                <Button disabled={loading} onClick={cancelEdit} type="button" className="mr-16 uppercase translate-y-5 font-extrabold w-fit">
                                    Cancel
                                </Button>
                            </div>
                            :
                            <button disabled={loading} onClick={saveEdit} className="uppercase mr-16 h-10 px-4 py-2 translate-y-6 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-extrabold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                            </button>
                        }
                    </div>
                    <ProfileSection profileData={profileData} session={session} form={form} loading={loading} isEdit={isEdit} />
                </div>
                <div className="lg:col-span-3 flex flex-col max-h-screen py-8">
                    <ProfileContent profileData={profileData} activityData={activityData} form={form} isEdit={isEdit} />
                </div>
            </form>
        </Form>
    )
}

export default Profile;