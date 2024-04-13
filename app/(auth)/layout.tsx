import { Suspense } from "react"

export default function authLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="h-full w-full">
            <Suspense>
                {children}
            </Suspense>
        </div>
    )
}