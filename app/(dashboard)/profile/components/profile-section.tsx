"use client";

import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import ImageUpload from "@/components/ui/image-upload";
import { Session } from "next-auth";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";

interface ProfileSectionProps{
  profileData: any;
  session: Session | null;
  form: UseFormReturn<{
      bio: string;
      skill: string;
      imageUrl: string;
  }, any, undefined>;
  loading: boolean;
  isEdit: boolean;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
    profileData,
    session,
    form,
    loading,
    isEdit
}) => {
    return(
        <>
          <div className="flex justify-center items-center">
            <div className="relative aspect-square h-72 w-72">
              {isEdit? <FormField
                control={form.control}
                name="imageUrl"
                render={({field}) => (
                  <FormItem>
                      <FormControl>
                          <ImageUpload session={session} 
                                      value={field.value ? field.value : ''}
                                      disabled={loading}
                                      onChange={(url => field.onChange(url))}
                                      onRemove={() => field.onChange("")}/>
                      </FormControl>
                      <FormMessage />
                  </FormItem> 
                  )}>
              </FormField>
              :
              <Image className="rounded-full object-cover object-center ring-1 ring-offset-1 ring-black" src={profileData.image ? profileData.image : 'https://gdurl.com/0pAF'} alt="" fill sizes="icon" quality={100} priority />
              }
            </div>
          </div>
          <div className="flex justify-center items-center">
            <div className="flex flex-col space-y-2">
              <h1 className="text-4xl font-bold">
                {session?.user.name}
              </h1>
              <p className="text-md text-gray-500">
                {session?.user.email}
              </p>
            </div>
          </div>
        </>
    )
}

export default ProfileSection;