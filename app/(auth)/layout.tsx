export default function authLayout({
    children
}: {
    children: React.ReactNode
}){
    return(
        <div className="h-full w-full">
            {children}
        </div>
    )
}