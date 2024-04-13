"use client";

import Link from "next/link";

const SignupForm = () => {
    return(
        <div className="flex justify-center mt-6">
            <Link href={'/sign-in'} className="text-sm hover:underline">Have an account? Sign-in </Link>
        </div>
    )
}

export default SignupForm;