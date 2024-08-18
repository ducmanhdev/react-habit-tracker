import {ReactNode, useRef} from "react";
import {NavLink, Link, NavLinkProps} from "react-router-dom";
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
import {Pencil} from "lucide-react";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar.tsx";
import ModalAddHabitGroup, {ModalAddHabitGroupRef} from "@/components/ModalAddHabitGroup.tsx";

type AsideMenuItemProps = {
    id?: number | string;
    route?: NavLinkProps['to'];
    onClick?: () => void;
    icon: string;
    label: string;
    suffixIcon?: ReactNode;
}

const AsideMenuItem = ({id, icon, label, route, onClick, suffixIcon}: AsideMenuItemProps) => {
    const ButtonInner = route ? NavLink : "span";
    return (
        <Button
            key={id}
            asChild
            variant="ghost"
            className="w-full justify-start inline-grid grid-cols-[auto_1fr_auto] cursor-pointer"
            onClick={onClick}
        >
            {/*TODO Fix Types of property to are incompatible. */}
            <ButtonInner
                {...(route && {
                    to: route,
                    end: true,
                    className: ({isActive}) => `${isActive ? "text-white" : ""}`
                })}
            >
                <Icon key={id} name={icon as IconProps['name']}/>
                {label}
                {suffixIcon}
            </ButtonInner>
        </Button>
    )
}

const Aside = () => {
    const {signOut} = useAuthActions();
    const currentUser = useQuery(api.users.currentUser);
    const habitGroups = useQuery(api.habits.getHabitGroups);

    const main: AsideMenuItemProps[] = [
        {id: 1, label: "All habits", icon: "square-library", route: "/habits"},
    ]

    const modalAddHabitGroupRef = useRef<ModalAddHabitGroupRef>(null);
    const groups: AsideMenuItemProps[] = [
        ...(habitGroups || []).map(group => ({
            id: group._id,
            label: group.name,
            icon: group.icon,
            route: `/habits/${group._id}`,
            suffixIcon: <Pencil
                onClick={() => modalAddHabitGroupRef?.current?.open({
                    id: group._id,
                    icon: group.icon,
                    name: group.name
                })}/>,
        })),
        {
            id: '',
            label: 'Add new group',
            icon: 'plus',
            onClick: () => modalAddHabitGroupRef?.current?.open(),
        }
    ]

    const settings: AsideMenuItemProps[] = [
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