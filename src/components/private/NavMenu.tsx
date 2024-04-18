import { Role, useAuth } from "@/auth/AuthProvider";
import { cn } from "@/lib/utils";
import {
    Home,
    Package2
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"

export const customerNavItems = [
    {
        icon: Home,
        name: "Transporters",
        to: "/"
    },
    {
        icon: Package2,
        name: "Cargos",
        to: "/customers/create-cargo"
    },
];


export const transporterNavItems = [
    {
        icon: Home,
        name: "Discounts",
        to: "/"
    },
];

export default function NavMenu() {

    const location = useLocation();

    let { user } = useAuth();

    return (
        <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link to="/" className="flex items-center gap-2 font-semibold">
                        <Package2 className="h-6 w-6" />
                        <span className="">TIRPORT</span>
                    </Link>
                </div>
                <div className="flex-1">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        {
                            user?.user?.role === Role.CUSTOMER &&
                            customerNavItems.map((item, index) => (
                                <Link
                                    key={index}
                                    to={item.to}
                                    className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary", {
                                        "!bg-muted !text-primary": item.to === location.pathname,
                                    })}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.name}
                                </Link>
                            ))
                        }

                        {
                            user?.user?.role === Role.TRANSPORTER &&
                            transporterNavItems.map((item, index) => (
                                <Link
                                    key={index}
                                    to={item.to}
                                    className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary", {
                                        "!bg-muted !text-primary": item.to === location.pathname,
                                    })}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.name}
                                </Link>
                            ))
                        }
                    </nav>
                </div>
            </div>
        </div>
    )
}
