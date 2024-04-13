import { AuthOptions } from "@/auth-file/auth-options";
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/Dashboard-Navbar";
import axios from "axios";

export default async function dashboardLayout({ 
    children }: {
        children: React.ReactNode;
    }){
    const session = await getServerSession(AuthOptions);

    if(!session){
      redirect('/sign-in');
    }

    const getProfileData = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profileData`, {
      userId: session?.user.userId,
    });


    if(getProfileData.data.success && getProfileData.data.success){
    return(
        <div className="h-full w-full lg:grid lg:grid-cols-8">
            <div className="lg:col-span-1 border-r">
                <DashboardNavbar session={session} profileData={getProfileData.data.user} />
            </div>
            {children}
        </div>
    )
    }
}