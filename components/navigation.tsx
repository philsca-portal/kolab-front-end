"use client";

import useDashboardMenuModal from "@/hook/use-dashboardmenu-modal";
import { LayoutDashboard, MessagesSquare, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const Navigation = () => {

    const { theme } = useTheme();
    
    const dashboardMenuModal = useDashboardMenuModal();

    const pathname = usePathname();
    const params = useParams();

    const routes = [
        {
            href: '/dashboard',
            label: 'Dashboard',
            icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
            active: pathname === '/dashboard'
        },
        {
            href: '/settings',
            label: 'Settings',
            icon: <Settings className="mr-2 h-4 w-4" />,
            active: pathname === '/settings'
        }
    ];

    return(
        <div>
            <h1 className="text-[12px] text-gray-500 font-extrabold uppercase ml-2">Menu</h1>
            <nav className="flex flex-col item-center mt-2">
                {routes.map((route) => (
                    <Link onClick={() => dashboardMenuModal.onClose()} key={route.href} href={route.href}
                        className={`${route.active ? `bg-[#5B7553] ${theme === 'dark'? 'text-[#020817]' : 'text-white'} ` : 'hover:text-primary text-muted-foreground'} text-xs font-semibold transition-colors flex items-center py-4 px-2 rounded-xl`}>
                        {route.icon}
                        {route.label}
                    </Link>
                ))}
            </nav>
        </div>
    )
}

export default Navigation;