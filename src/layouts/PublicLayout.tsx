import { Outlet } from "react-router-dom";
export default function PublicLayout() {
    return (
        <div className="w-full h-screen flex items-center justify-center px-4 ">
            <Outlet />
        </div>
    )
}