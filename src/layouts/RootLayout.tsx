import {NavLink, Link, Outlet} from "react-router-dom";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button.tsx";
import {Separator} from "@/components/ui/separator"
import {Package} from "lucide-react"

export default function App() {
    return (
        <main className="grid grid-cols-[300px_1fr] h-screen">
            <aside className="border-r flex flex-col">
                <div className="p-4 flex-grow">
                    <nav className="">
                        <NavLink
                            to="/"
                            className={({isActive}) =>
                                `flex items-center gap-3 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground ${isActive ? "text-white" : ""}`
                            }
                        >
                            <Package className="h-5 w-5"/>
                            All habits
                        </NavLink>
                        <NavLink
                            to="/"
                            className={({isActive}) =>
                                `flex items-center gap-3 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground ${isActive ? "text-white" : ""}`
                            }
                        >
                            <Package className="h-5 w-5"/>
                            Manage habits
                        </NavLink>
                        <NavLink
                            to="/"
                            className={({isActive}) =>
                                `flex items-center gap-3 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground ${isActive ? "text-white" : ""}`
                            }
                        >
                            <Package className="h-5 w-5"/>
                            Settings
                        </NavLink>
                    </nav>
                </div>
                <Separator/>
                <div className="p-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full">work.ducmanh0323@gmail.com</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem asChild>
                                <Link to="/profile">Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </aside>
            <section>
                <Outlet/>
            </section>
        </main>
    )
}