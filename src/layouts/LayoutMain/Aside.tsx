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
import {Plus} from "lucide-react";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar.tsx";

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

    currentUser?.name
    return (
        <aside className="border-r flex flex-col">
            <div className="p-4 flex-grow text-muted-foreground space-y-4">
                {
                    navGroups.map(group => (
                        <nav key={group.name}>
                            {
                                group.name &&
                                (
                                    <p className="px-4 py-2 text-sm font-semibold">{group.name}</p>
                                )
                            }
                            {
                                group.children.map(child => (
                                    <Button
                                        key={child.id}
                                        asChild
                                        variant="ghost"
                                        className="w-full justify-start"
                                    >
                                        <NavLink
                                            end
                                            to={child.route}
                                            className={({isActive}) => `${isActive ? "text-white" : ""}`}
                                        >
                                            <Icon
                                                key={child.id}
                                                name={child.icon as IconProps['name']}
                                            />
                                            {child.label}
                                        </NavLink>
                                    </Button>
                                ))
                            }
                            {
                                group.name === "GROUPS" &&
                                (
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start"
                                    >
                                        <Plus/>
                                        Add new item
                                    </Button>
                                )
                            }
                        </nav>
                    ))
                }
            </div>
            <Separator/>
            <div className="p-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full">
                            <Avatar className="w-6 h-6">
                                <AvatarImage src={currentUser?.image} alt="User avatar"/>
                                <AvatarFallback>
                                    {
                                        currentUser?.name
                                            ?.split(" ")
                                            .map(item => item[0])
                                            .slice(0, 2)
                                            .join("")
                                            .toUpperCase()
                                    }
                                </AvatarFallback>
                            </Avatar>
                            {currentUser?.name}
                        </Button>
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