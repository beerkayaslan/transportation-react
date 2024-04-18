
import { CircleUser } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Role, useAuth } from "@/auth/AuthProvider";
import {
    PanelLeft,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Link } from "react-router-dom";
import { transporterNavItems, customerNavItems } from "./NavMenu";


export default function Header({ children }: { children: React.ReactNode }) {

    const { setUserCookie, user } = useAuth();

    const logOut = () => {
        setUserCookie('');
    }


    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background  sm:static sm:h-auto sm:border-0 sm:bg-transparent ">
            <Sheet>
                <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="sm:hidden">
                        <PanelLeft className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:max-w-xs">
                    <nav className="grid gap-6 text-lg font-medium">
                        {
                            user?.user?.role === Role.CUSTOMER &&
                            customerNavItems.map((item, index) => (
                                <Link
                                    key={index}
                                    to={item.to}
                                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                >
                                    <item.icon className="h-5 w-5" />
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
                                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            ))
                        }
                    </nav>
                </SheetContent>
            </Sheet>
            <div>
                {children}
            </div>
            <div className="relative ml-auto flex-1 md:grow-0">

            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full">
                        <CircleUser className="h-5 w-5" />
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuLabel>{user?.user?.email}</DropdownMenuLabel>
                    <DropdownMenuItem onClick={logOut}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}