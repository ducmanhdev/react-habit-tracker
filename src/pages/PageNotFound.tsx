import {Link} from "react-router-dom"
import {Button} from "@/components/ui/button"
import {MoveLeft} from "lucide-react";

const PageNotFound = () => (
    <div className="p-4 flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-9xl font-black mb-2">404</h1>
        <h1 className="text-4xl font-semibold mb-2">PAGE NOT FOUND</h1>
        <p className="text-lg mb-4">Sorry, the page you requested does not exist.</p>
        <Button asChild>
            <Link to="/">
                <MoveLeft />
                Return home
            </Link>
        </Button>
    </div>
);

export default PageNotFound;
