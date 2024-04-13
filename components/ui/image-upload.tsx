"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2Icon, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary"
import { Session } from "next-auth";

interface ImageUploadProps{
    session: Session | null;
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    session,
    disabled,
    onChange,
    onRemove,
    value
}) => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [setIsMounted]);

    const onUpload = (result: any) => {
        onChange(result.info.secure_url);
    }

    if(!isMounted){
        return null;
    }

    return (
        <div>
            <div className="relative aspect-square h-72 w-72">
                <Image className="rounded-full object-cover object-center ring-1 ring-offset-1 ring-black" src={`${value ? value : session?.user.image ? session?.user.image : 'https://gdurl.com/0pAF'}`} alt="" fill sizes="icon" quality={100} />
            </div>
            <CldUploadWidget onUpload={onUpload} uploadPreset="t0r9btz1">
                {({ open }) => {
                   const onClick = () => {
                    open();
                   } 
                   return(
                    <div className=" absolute right-6 top-4">
                    <Button className="rounded-full" type="button" disabled={disabled} variant={'default'} onClick={onClick}>
                        <Edit2Icon className="h-5 w-3"/>
                    </Button>
                    </div>
                   )
                }}
            </CldUploadWidget>
        </div>
    )
}

export default ImageUpload;