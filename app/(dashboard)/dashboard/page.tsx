import Dashboard from "./dashboard";
import { getServerSession } from "next-auth/next";
import { AuthOptions } from "@/auth-file/auth-options";

export default async function Page() {
  const session = await getServerSession(AuthOptions);
  
  return (
    <div className="col-span-7 h-full p-8">   
        <Dashboard session={session} />
    </div>
  )
}
