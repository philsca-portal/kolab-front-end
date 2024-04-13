"use client";

import Link from "next/link";

const SigninForm = () => {
    return(  
        <div className="flex justify-center mt-6">
            <Link href={"/sign-up"} className="text-sm hover:underline">Don&apos;t have an account? Sign-up</Link>
        </div>
    )
}

export default SigninForm;