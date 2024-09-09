import {useMemo, useRef} from "react";
import {Link, useLocation} from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import {Button} from "@/components/ui/button.tsx";
import {Separator} from "@/components/ui/separator.tsx"
import {useAuthActions} from "@convex-dev/auth/react";
import {useQuery} from "convex/react";
import {api} from "../../../convex/_generated/api";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar.tsx";
import ModalAddHabitGroup, {ModalAddHabitGroupRef} from "@/components/ModalAddHabitGroup.tsx";
import MenuItem, {MenuItemProps} from "@/components/MenuItem.tsx";
import {List, SquareLibrary, Settings, Pencil, Plus} from "lucide-react";

type MenuItemWithId = MenuItemProps & { id: string };

const main: MenuItemWithId[] = [
    {id: "main-1", label: "All habits", icon: <SquareLibrary/>, route: "/habits"},
]

const settings: MenuItemWithId[] = [
    {id: "settings-1", label: "Manage habits", icon: <List/>, route: "/manage-habits"},
    {id: "settings-2", label: "App settings", icon: <Settings/>, route: "/settings"},
]

const Aside = () => {
    const location = useLocation();
    const {signOut} = useAuthActions();
    const currentUser = useQuery(api.users.currentUser);
    const habitGroups = useQuery(api.habitGroups.getGroups);

    const modalAddHabitGroupRef = useRef<ModalAddHabitGroupRef>(null);
    const groups: MenuItemWithId[] = useMemo(() => [
        ...(habitGroups || []).map(group => ({
            id: group._id,
            label: group.name,
            icon: group.icon as MenuItemWithId["icon"],
            route: `/habits/${group._id}`,
            suffixIcon: <Pencil/>,
            suffixIconAction: () => modalAddHabitGroupRef?.current?.open({
                id: group._id,
                icon: group.icon,
                name: group.name
            }),
        })),
        {
            id: '',
            label: 'Add new group',
            icon: <Plus/>,
            onClick: () => modalAddHabitGroupRef?.current?.open(),
        }
    ], [habitGroups]);
    const navGroups = useMemo(() => [
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
    ], [groups]);

    const handleCheckIsMenuActive = (route: MenuItemProps["route"]) => {
        if (route?.toString().startsWith("/habits")) {
            return location.pathname === route;
        } else {
            return route ? location.pathname.startsWith(route.toString()) : false;
        }
    }

    return (
        <>
            <ModalAddHabitGroup ref={modalAddHabitGroupRef}/>
            <aside className="border-r flex flex-col">
                <div className="p-4 flex-grow text-muted-foreground space-y-4">
                    {
                        navGroups.map(group => (
                            <nav key={group.name} className="space-y-1">
                                {
                                    group.name && <p className="px-4 py-2 text-sm font-semibold">{group.name}</p>
                                }
                                {
                                    group.children.map(child => (
                                        <MenuItem
                                            key={child.label}
                                            route={child.route}
                                            icon={child.icon}
                                            label={child.label}
                                            suffixIcon={child.suffixIcon}
                                            suffixIconAction={child.suffixIconAction}
                                            onClick={child.onClick}
                                            isActive={handleCheckIsMenuActive(child.route)}
                                        />
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
        </>
    )
};

export default Aside