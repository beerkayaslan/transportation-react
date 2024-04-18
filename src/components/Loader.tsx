
import { Loader2 } from "lucide-react";

export default function Loader() {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center px-4">
            <Loader2 className="h-10 w-10 animate-spin" />
            <h3>Loading...</h3>
        </div>
    )
}