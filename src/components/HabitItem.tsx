import {useEffect, useState, cloneElement, ReactElement} from "react";
import {
    Plus,
    EllipsisVertical,
    Undo,
    Pencil,
    Check,
    ChartNoAxesColumn,
    Trash
} from "lucide-react"
import {Button} from "@/components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {useMutation} from "convex/react";
import {api} from "../../convex/_generated/api";
import {toast} from "sonner";
import {Doc} from "../../convex/_generated/dataModel";
import Icon, {IconProps} from "@/components/Icon.tsx";
import dayjs from "dayjs";

type HabitItemProps = {
    habit: Doc<"habitItems">;
    isActive?: boolean;
    onClick: () => void;
    onEdit: () => void;
}

type MenuItem = {
    icon: ReactElement;
    label: string;
    action: () => void;
};

const HabitItem = ({
                       habit,
                       isActive = false,
                       onClick,
                       onEdit
                   }: HabitItemProps) => {
    const del = useMutation(api.habits.deleteHabitItem);
    const updateCompletedCount = useMutation(api.habits.updateCompletedCount);

    const [completed, setCompleted] = useState(false);
    useEffect(() => {
        if (habit && habit.lastCompleted) {
            const lastCompleted = dayjs(habit.lastCompleted);
            const today = dayjs();

            if (lastCompleted.isSame(today, 'date')) {
                setCompleted(true);
            } else {
                setCompleted(false);
            }
        }
    }, [habit]);

    const [deleteLoading, setDeleteLoading] = useState(false);
    const handleDelete = async () => {
        try {
            setDeleteLoading(true)
            await del({id: habit._id});
            toast.success('Deleted successfully');
        } catch (error) {
            toast.error('Delete failed');
        } finally {
            setDeleteLoading(true)
        }
    };

    const [updateCountLoading, setUpdateCountLoading] = useState(false);
    const handleUpdateCount = async (increment: number) => {
        try {
            setUpdateCountLoading(true);
            await updateCompletedCount({
                id: habit._id,
                increment: increment
            });
        } catch (error) {
            toast.error('Update failed');
        } finally {
            setUpdateCountLoading(false);
        }
    }

    const handleUndoComplete = () => {

    }

    const menuItems: MenuItem[] = [
        {icon: <Pencil/>, label: 'Edit', action: () => onEdit()},
        {icon: <ChartNoAxesColumn/>, label: 'View Progress', action: () => onClick()},
        {icon: <Trash/>, label: 'Delete', action: () => handleDelete()},
    ];

    if (completed) {
        menuItems.unshift({
            icon: <Undo/>,
            label: 'Undo complete',
            action: () => handleUndoComplete(),
        })
    } else {
        menuItems.unshift({
            icon: <Check/>,
            label: 'Check-in',
            action: () => handleUpdateCount(1)
        })
    }

    return (
        <div
            className={
                `p-2 border rounded flex gap-4 items-center cursor-pointer 
                ${isActive && "border-primary"} 
                ${completed && "opacity-80"}
                `
            }
            onClick={() => onClick()}
        >
            <div className="border rounded p-2">
                <Icon
                    name={habit.icon as IconProps["name"]}
                    width={20}
                    height={20}
                />
            </div>
            <div className="flex-grow">
                <p className={`${completed ? 'line-through' : ''}`}>{habit.name}</p>
                <p className={`text-muted-foreground ${completed ? 'line-through' : ''}`}>
                    {
                        `${habit.goal.completedCount}/${habit.goal.target} ${habit.goal.unit}`
                    }
                </p>
            </div>
            <div className="flex gap-2">
                <Button
                    size="sm"
                    variant="secondary"
                    disabled={updateCountLoading || completed}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateCount(1)
                    }}
                >
                    <Plus/>
                    1
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild disabled={deleteLoading}>
                        <Button variant="secondary" size="sm" className="w-full">
                            <EllipsisVertical/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {menuItems.map((item, index) => (
                            <DropdownMenuItem
                                key={index}
                                onClick={item.action}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                {/*TODO Optimize cloneElement*/}
                                {cloneElement(item.icon, {className: "w-4 h-4"})}
                                {item.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default HabitItem;