import { AuthOptions } from "@/auth-file/auth-options";
import { getServerSession } from "next-auth";
import Profile from "./profile";
import axios from "axios";

export default async function Page() {

  const session = await getServerSession(AuthOptions);

  const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profileData`, {
      userId: session?.user.userId
  });

  if(response.data.success){
    return (
      <div className="col-span-7 h-full px-8">  
        <Profile session={session} profileData={response.data.user} />
      </div>
    )
  }
}
  