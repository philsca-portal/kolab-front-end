"use client";

import { useTheme } from "next-themes";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { PlusCircle } from "lucide-react";

import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface SpreadMemberProps {
    teamData: {
        adminName: string;
        members: {
            TeamId: string;
            name: string;
            email: string;
            image: string;
            status: string;
        }[];
    } & {
        userId: string;
        teamName: string;
        teamIcon: string;
    }
}

const formSchema = z.object({
    email: z.string().email(),
});

const SpreadMember: React.FC<SpreadMemberProps> = ({
    teamData
}) => {

    const { theme } = useTheme();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values);
    }

    const filterMember = teamData.members.filter((data) => data.status === "MEMBER");

    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="addMember">
                <AccordionTrigger className="hover:underline">
                    <div className={`${theme === 'dark' ? 'hover:text-white' : 'hover:text-black'} flex items-center text-gray-500 und`}>
                        <PlusCircle className="h-4 w-4 mr-1" /> Add Member
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex items-center space-x-2 p-1">
                                                <Input placeholder="Enter email..." {...field} />
                                                <Button type="submit">Invite</Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </AccordionContent>
            </AccordionItem>
            {filterMember.map((data, index) => (
                <AccordionItem key={index} value={data.TeamId}>
                    <AccordionTrigger className="hover:underline">
                        <div className="flex items-center">
                            <Avatar className={`${theme === 'dark' ? 'border-white' : 'border-black'} h-8 w-8 border mr-4`}>
                                <AvatarImage src={data.image} />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className={`${theme === 'dark' ? 'text-white' : 'text-black'} flex flex-col`}>
                                <div className="w-fit">{data.name}</div>
                                <span className="w-fit text-xs text-gray-500">{data.email}</span>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        Yes. It adheres to the WAI-ARIA design pattern.
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    )
}

export default SpreadMember;