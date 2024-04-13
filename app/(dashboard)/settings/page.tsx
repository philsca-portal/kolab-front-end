import { getServerSession } from "next-auth/next";
import Settings from "./settings";
import { AuthOptions } from "@/auth-file/auth-options";

export default async function Page() {

  const session = await getServerSession(AuthOptions);

    return (
      <div className="col-span-7 h-full px-8">   
        <Settings session={session} />
      </div>
    )
  }
  