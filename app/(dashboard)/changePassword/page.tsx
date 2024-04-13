import { getServerSession } from "next-auth";
import ChangePassword from "./changePassword";
import { AuthOptions } from "@/auth-file/auth-options";
import axios from "axios";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await getServerSession(AuthOptions);

    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/changePassword`, {
        userId: session?.user.userId
    });

    if(response.data.success === true){
        return (
            <div className="col-span-7 h-full px-8">  
                  <ChangePassword session={session} />
            </div>
          )
    }
    else{
        redirect('/dashboard?redirected=1');
    }
  }
  