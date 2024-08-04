import {NavLink, Link} from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import {Button} from "@/components/ui/button.tsx";
import {Separator} from "@/components/ui/separator.tsx"
import Icon, {IconProps} from "@/components/Icon.tsx"
import {useAuthActions} from "@convex-dev/auth/react";
import {useQuery} from "convex/react";
import {api} from "../../../convex/_generated/api";

export default function Aside() {
    const {signOut} = useAuthActions();
    const currentUser = useQuery(api.users.currentUser);
    const main = [
        {id: 1, label: "All habits", icon: "square-library", route: "/habits"},
    ]

    const groups = [
        {id: 1, label: "Study", icon: "book-copy", route: "/habits/1"},
        {id: 2, label: "Plans", icon: "sprout", route: "/habits/2"},
    ]

    const settings = [
        {id: 1, label: "Manage habits", icon: "list", route: "/manage-habits"},
        {id: 2, label: "App settings", icon: "settings", route: "/settings"},
    ]

    const navGroups = [
        {
            name: "",
            children: main
        },
        {
            name: "GROUPS",
            children: groups
        },
        {
            name: "PREFERENCES",
            children: settings
        }
    ]


    return (
        <aside className="border-r flex flex-col">
            <div className="p-4 flex-grow text-muted-foreground space-y-4">
                {
                    navGroups.map(group => (
                        <nav key={group.name}>
                            {group.name && <p className="px-3 py-2 text-xs font-semibold">{group.name}</p>}
                            {
                                group.children.map(child => (
                                    <NavLink
                                        key={child.id}
                                        end
                                        to={child.route}
                                        className={({isActive}) =>
                                            `flex items-center gap-3 px-3 py-2 hover:text-foreground ${isActive ? "text-white" : ""}`
                                        }
                                    >
                                        <Icon
                                            key={child.id}
                                            name={child.icon as IconProps['name']}
                                            className="h-5 w-5"
                                        />
                                        {child.label}
                                    </NavLink>
                                ))
                            }
                        </nav>
                    ))
                }
            </div>
            <Separator/>
            <div className="p-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full">{currentUser?.name}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                            <Link to="/profile">Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => void signOut()}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </aside>
    )
}