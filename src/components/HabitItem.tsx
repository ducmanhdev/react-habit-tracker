import {cloneElement, useEffect, useRef, useState} from "react";
import {ChartNoAxesColumn, Check, EllipsisVertical, Keyboard, Pencil, Plus, Timer, Trash, Undo, X} from "lucide-react"
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
import {Input} from "@/components/ui/input.tsx";
import {convertToKebabCase} from "@/utils/text.ts";
import {isToday} from "@/utils/date.ts";

type HabitItemProps = {
    habit: Doc<"habitItems">;
    isActive?: boolean;
    onClick: () => void;
    onEdit: () => void;
}

type LogInputProps = {
    unit: string;
    onAccept: (value: number) => void;
    onCancel: () => void;
}

const LogInput = ({unit, onAccept, onCancel}: LogInputProps) => {
    const [value, setValue] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <div
            className="flex items-center gap-1 text-sm"
            onClick={e => e.stopPropagation()}
        >
            <Input
                type="number"
                className="w-20 h-9"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                ref={inputRef}
            />
            <div>{unit}</div>
            <Button size="icon" variant="secondary" className="flex-shrink-0 w-9 h-9" onClick={() => onAccept(value)}>
                <Check/>
            </Button>
            <Button size="icon" variant="secondary" className="flex-shrink-0 w-9 h-9" onClick={() => onCancel()}>
                <X/>
            </Button>
        </div>
    )
}

const HabitItem = ({
                       habit,
                       isActive = false,
                       onClick,
                       onEdit
                   }: HabitItemProps) => {
    const del = useMutation(api.habits.deleteHabitItem);
    const updateCompletedCount = useMutation(api.habits.updateCompletedCount);
    const resetCompletedCount = useMutation(api.habits.resetCompletedCount);

    const [completed, setCompleted] = useState(false);
    useEffect(() => {
        if (habit?.lastCompleted && dayjs(habit.lastCompleted).isValid()) {
            setCompleted(isToday(habit.lastCompleted));
        } else {
            setCompleted(false);
        }
    }, [habit.lastCompleted]);

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

    const handleUndoComplete = async () => {
        try {
            await resetCompletedCount({id: habit._id});
        } catch (error) {
            toast.error('Delete failed');
        }
    }

    const baseItems = [
        {icon: <Pencil/>, label: 'Edit', action: onEdit},
        {icon: <Keyboard/>, label: 'Log Progress', action: () => setLogging(true)},
        {icon: <ChartNoAxesColumn/>, label: 'View Progress', action: onClick},
        {icon: <Trash/>, label: 'Delete', action: handleDelete},
    ];

    const menuItems = completed
        ? [{icon: <Undo/>, label: 'Undo complete', action: handleUndoComplete}, ...baseItems]
        : [{icon: <Check/>, label: 'Check-in', action: () => handleUpdateCount(1)}, ...baseItems];

    const [logging, setLogging] = useState(false);
    const handleLogging = async (value: number) => {
        try {
            await updateCompletedCount({id: habit._id, increment: value})
            setLogging(false);
        } catch (error) {
            toast.error('Update failed');
        }
    }

    const actionButton = (() => {
        switch (habit.goal.unit) {
            case "times": {
                return <Button
                    size="sm"
                    variant="secondary"
                    disabled={updateCountLoading}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateCount(1);
                    }}
                >
                    <Plus/> 1
                </Button>
            }
            case "minutes":
            case "hours":
                return <Button
                    size="sm"
                    variant="secondary"
                    disabled
                    onClick={(e) => e.stopPropagation()}
                >
                    <Timer/> Timer
                </Button>
            default:
                return <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                        e.stopPropagation();
                        setLogging(true);
                    }}
                >
                    <Keyboard/> Log
                </Button>
        }
    })();

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
            <div className="border rounded p-2 w-10 h-10 flex justify-center items-center">
                <Icon
                    name={(habit.icon ? convertToKebabCase(habit.icon) : "") as IconProps["name"]}
                    width={20}
                    height={20}
                />
            </div>
            <div className="flex-grow">
                <p className={`${completed ? 'line-through' : ''}`}>{habit.name}</p>
                <p className={`text-sm text-muted-foreground ${completed ? 'line-through' : ''}`}>
                    {
                        `${habit.goal.completedCount}/${habit.goal.target} ${habit.goal.unit}`
                    }
                </p>
            </div>
            <div className="flex gap-2">
                {
                    !completed && (
                        logging
                            ? <LogInput
                                unit={habit.goal.unit}
                                onAccept={handleLogging}
                                onCancel={() => setLogging(false)}
                            />
                            : (
                                actionButton
                            )
                    )}
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
                                onClick={e => {
                                    e.stopPropagation();
                                    item.action()
                                }}
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