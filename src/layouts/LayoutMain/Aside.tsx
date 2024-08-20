import {useRef, cloneElement, ReactElement} from "react";
import {NavLink, Link, NavLinkProps} from "react-router-dom";
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
import {icons, Pencil} from "lucide-react";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar.tsx";
import ModalAddHabitGroup, {ModalAddHabitGroupRef} from "@/components/ModalAddHabitGroup.tsx";

type AsideMenuItemProps = {
    id?: number | string;
    route?: NavLinkProps['to'];
    onClick?: () => void;
    icon: keyof typeof icons;
    label: string;
    suffixIcon?: ReactElement;
}

const AsideMenuItem = ({id, icon, label, route, onClick, suffixIcon}: AsideMenuItemProps) => {
    const Icon = icons[icon];
    const content = (
        <>
            <Icon className="flex-shrink-0"/>
            <span className="flex-grow overflow-hidden text-ellipsis">{label}</span>
            {suffixIcon && cloneElement(suffixIcon, {className: "flex-shrink-0"})}
        </>
    );

    return (
        <Button
            key={id}
            asChild
            variant="ghost"
            className="w-full justify-start inline-flex cursor-pointer text-ellipsis"
            onClick={onClick}
        >
            {route ? (
                <NavLink
                    to={route}
                    end
                    className={({isActive}) => isActive ? "text-white" : ""}
                >
                    {content}
                </NavLink>
            ) : (
                <span>
                    {content}
                </span>
            )}
        </Button>
    );
};

const Aside = () => {
    const {signOut} = useAuthActions();
    const currentUser = useQuery(api.users.currentUser);
    const habitGroups = useQuery(api.habits.getHabitGroups);

    const main: AsideMenuItemProps[] = [
        {id: 1, label: "All habits", icon: "SquareLibrary", route: "/habits"},
    ]

    const modalAddHabitGroupRef = useRef<ModalAddHabitGroupRef>(null);
    const groups: AsideMenuItemProps[] = [
        ...(habitGroups || []).map(group => ({
            id: group._id,
            label: group.name,
            icon: group.icon as AsideMenuItemProps["icon"],
            route: `/habits/${group._id}`,
            suffixIcon: <Pencil
                onClick={() => modalAddHabitGroupRef?.current?.open({
                    id: group._id,
                    icon: group.icon as AsideMenuItemProps["icon"],
                    name: group.name
                })}/>,
        })),
        {
            id: '',
            label: 'Add new group',
            icon: 'Plus',
            onClick: () => modalAddHabitGroupRef?.current?.open(),
        }
    ]

    const settings: AsideMenuItemProps[] = [
        {id: 1, label: "Manage habits", icon: "List", route: "/manage-habits"},
        {id: 2, label: "App settings", icon: "Settings", route: "/settings"},
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
        <>
            <ModalAddHabitGroup ref={modalAddHabitGroupRef}/>
            <aside className="border-r flex flex-col">
                <div className="p-4 flex-grow text-muted-foreground space-y-4">
                    {
                        navGroups.map(group => (
                            <nav key={group.name}>
                                {
                                    group.name && <p className="px-4 py-2 text-sm font-semibold">{group.name}</p>
                                }
                                {
                                    group.children.map(child => (
                                        <AsideMenuItem
                                            key={child.id}
                                            id={child.id}
                                            route={child.route}
                                            icon={child.icon}
                                            label={child.label}
                                            suffixIcon={child.suffixIcon}
                                            onClick={child.onClick}
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