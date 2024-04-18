
import { Outlet } from "react-router-dom"
import NavMenu from "@/components/private/NavMenu"

export default function PrivateLayout() {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <NavMenu />
            <div className="flex flex-col">
                <main className="flex flex-1 flex-col gap-3 p-4 lg:gap-5 lg:p-5">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
