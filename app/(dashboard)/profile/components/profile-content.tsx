"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton"
import { useInView } from "react-intersection-observer";
import ActivityHistoryData from "./activity-history-data";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfileContentProps {
    profileData: any;
    isEdit: boolean;
    form: UseFormReturn<{
        bio: string;
        skill: string;
        imageUrl: string;
    }, any, undefined>;
    activityData: {
        action: string;
        title: string | null;
        date: Date;
    }[];
}

const ProfileContent: React.FC<ProfileContentProps> = ({
    profileData,
    isEdit,
    form,
    activityData
}) => {
    const skillData: string[] = profileData.skill ? JSON.parse(profileData.skill) : [];

    const { theme } = useTheme();
    const router = useRouter();
    const [skills, setSkills] = useState<string>('');
    const [editData, setEditData] = useState([...skillData]);
    const [isMounted, setIsMounted] = useState(false);
    const [isdata, setIsData] = useState<{
        action: string;
        title: string | null;
        date: Date;
    }[]>([]);
    const [visibleData, setVisibleData] = useState<number>(4);

    const [loadingRef, loadingInView] = useInView();


    const addSkill = useCallback(() => {
        if (skills) {
            setEditData((prevArray) => {
                const newArray = [...prevArray, skills];
                form.setValue("skill", JSON.stringify(newArray));
                return newArray;
            });

            setSkills('');
        }
    }, [skills, setEditData, setSkills, form]);

    const handleDeleteSkill = (index: number) => {
        editData.splice(index, 1);
        form.setValue("skill", JSON.stringify(editData));
        router.refresh();
    };

    const handleSkillsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputSkill = event.target.value;
        setSkills(inputSkill);
    }

    const loadMoreData = useCallback(() => {
        const newData = activityData.slice(
            isdata.length,
            isdata.length + visibleData
        );
        setIsData((prevData) => [...prevData, ...newData]);
    }, [activityData, isdata, visibleData]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setIsData(activityData.slice(0, visibleData));
    }, [visibleData, activityData]);

    useEffect(() => {
        if (loadingInView && isdata.length < activityData.length) {
            setTimeout(() => {
                loadMoreData();
            }, 1000);
        }
    }, [loadingInView, loadMoreData, isdata, activityData]);

    if (!isMounted) {
        return null;
    }

    return (
        <ScrollArea>
            <div className="mr-4 space-y-8">
                <div className="flex flex-col space-y-2 max-w-2xl">
                    <h1 className="text-sm font-extrabold uppercase">Bio</h1>
                    {isEdit ?
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea className="h-40 ml-1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        :
                        <span>{profileData.bio ? profileData.bio : <span className="italic text-sm text-gray-400">You don&apos;t have any bio...</span>}</span>
                    }
                </div>
                <div className="flex flex-col max-w-2xl space-y-2">
                    <h1 className="text-sm font-extrabold uppercase">Skill or Expertise</h1>
                    <div className="flex flex-wrap">
                        {isEdit ?
                            <>
                                {editData.map((skill, index) => (
                                    <div key={index} className="relative py-2 pr-4">
                                        <Badge className="w-fit">{skill}</Badge>
                                        <button onClick={() => handleDeleteSkill(index)} type="button" className={`${theme === 'dark' ? 'text-black' : 'text-white'} flex justify-center items-center absolute top-1 right-2 text-xs px-1 bg-primary font-extrabold hover:bg-primary/90 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border-gray-500 border rounded-full`}>
                                            <X className="h-4 w-2" />
                                        </button>
                                    </div>
                                ))}
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
                                            <DialogTitle>Add Skill or Expertise</DialogTitle>
                                            <DialogDescription>
                                                Add skill/s to determine who you are. Click Add when you&apos;re done.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <Input type="text" value={skills} onChange={handleSkillsChange} />
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button onClick={addSkill}>Add</Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </>
                            :
                            skillData.length !== 0 ?
                                <>
                                    {skillData.map((skill, index) => (
                                        <div key={index} className="py-2 pr-4">
                                            <Badge className="w-fit">{skill}</Badge>
                                        </div>
                                    ))}
                                </>
                                :
                                <span className="italic text-sm text-gray-400">You don&apos;t have any skill/expertise...</span>
                        }
                    </div>
                </div>
                <div className="flex flex-col space-y-2 max-w-2xl">
                    <h1 className="text-sm font-extrabold uppercase">Activity History</h1>
                    {isdata.map((data, index) => (
                        <ActivityHistoryData key={index} data={data} />
                    ))}
                    {activityData.length === 0 ? (
                        <div className="flex justify-center items-center">
                            <p className={`text-sm italic ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                You don&apos;t have any activity as of now..
                            </p>
                        </div>
                    ) : isdata.length === activityData.length ? (
                        <div className="flex justify-center items-center">
                            <p className={`text-sm italic ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                Yay! You have seen it all
                            </p>
                        </div>
                    ) : (
                        <div ref={loadingRef} className="flex flex-col">
                            <div className="p-4 space-y-2">
                                <Skeleton className={`${theme === 'light' ? 'bg-gray-400' : ''} h-4 w-3/4`} />
                                <Skeleton className={`${theme === 'light' ? 'bg-gray-400' : ''} h-4 w-1/4`} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ScrollArea>
    )
}

export default ProfileContent;