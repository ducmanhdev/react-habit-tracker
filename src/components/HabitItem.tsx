import {useEffect, useRef, useState} from "react";
import {
    ChartNoAxesColumn,
    Check,
    EllipsisVertical,
    Keyboard,
    Pencil,
    Plus,
    Timer,
    Undo,
    X,
    Archive, Trash2, ArchiveRestore
} from "lucide-react"
import {Button} from "@/components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {toast} from "sonner";
import {Doc} from "@convex/_generated/dataModel";
import Icon from "@/components/Icon.tsx";
import dayjs from "@/lib/dayjs";
import {Input} from "@/components/ui/input.tsx";
import {
    useArchiveHabit,
    useDeleteHabit, useResetCompletedCount,
    useRestoreArchiveHabit,
    useRestoreDeleteHabit,
    useUpdateCountHabit
} from "@/hooks/useHabitItems.ts";

type HabitItemProps = {
    habit: Doc<"habitItems">;
    isActive?: boolean;
    isMinimalist?: boolean;
    onClick?: () => void;
    onEdit?: () => void;
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
                       isMinimalist = false,
                       onClick,
                       onEdit
                   }: HabitItemProps) => {
    const {handleDelete, deleteLoading} = useDeleteHabit();
    const {handleRestoreDelete} = useRestoreDeleteHabit();
    const {handleArchive} = useArchiveHabit();
    const {handleRestoreArchive} = useRestoreArchiveHabit();
    const {handleUpdateCount, updateCountLoading} = useUpdateCountHabit();
    const {handleResetCompletedCount} = useResetCompletedCount();

    const isCompleted = habit?.lastCompleted && dayjs(habit.lastCompleted).isValid() && dayjs(habit.lastCompleted).isToday()
    const isCanLogProgress = !isCompleted && !isMinimalist;

    const logProgressActionItems = isCompleted
        ? [{icon: <Undo/>, label: 'Undo complete', action: () => handleResetCompletedCount(habit._id)}]
        : [
            {icon: <Check/>, label: 'Check-in', action: () => handleUpdateCount({id: habit._id, increment: 1})},
            {icon: <Keyboard/>, label: 'Log Progress', action: () => setLogging(true)},
        ];

    const archiveActionItem = habit.isArchived
        ? {icon: <ArchiveRestore/>, label: 'Restore archive', action: () => handleRestoreArchive(habit._id)}
        : {icon: <Archive/>, label: 'Archive', action: () => handleArchive(habit._id)};

    const deleteActionItem = habit.isDeleted
        ? {icon: <Trash2/>, label: 'Restore delete', action: () => handleRestoreDelete(habit._id)}
        : {icon: <Trash2/>, label: 'Delete', action: () => handleDelete(habit._id)}

    const menuItemsMinimalist = habit.isDeleted
        ? [
            deleteActionItem,
        ]
        : [
            archiveActionItem,
            deleteActionItem,
        ]

    const menuItemsUndeleted = habit.isDeleted
        ? []
        : [
            ...logProgressActionItems,
            {icon: <Pencil/>, label: 'Edit', action: onEdit},
            {icon: <ChartNoAxesColumn/>, label: 'View Progress', action: onClick},
            archiveActionItem,
        ]

    const menuItemsFull = [
        ...menuItemsUndeleted,
        deleteActionItem,
    ]

    const menuItems = isMinimalist ? menuItemsMinimalist : menuItemsFull;

    const [logging, setLogging] = useState(false);
    const handleLogging = async (value: number) => {
        try {
            if (value !== 0) {
                await handleUpdateCount({id: habit._id, increment: value});
            }
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
                        handleUpdateCount({
                            id: habit._id,
                            increment: 1
                        });
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
                ${isCompleted && "opacity-80"}
                `
            }
            onClick={() => onClick?.()}
        >
            <div className="border rounded p-2 w-10 h-10 flex justify-center items-center">
                <Icon
                    name={habit.icon}
                    width={20}
                    height={20}
                />
            </div>
            <div className="flex-grow">
                <p className={`${isCompleted ? 'line-through' : ''}`}>{habit.name}</p>
                <p className={`text-sm text-muted-foreground ${isCompleted ? 'line-through' : ''}`}>
                    {
                        `${habit.goal.completedCount}/${habit.goal.target} ${habit.goal.unit}`
                    }
                </p>
            </div>
            <div className="flex gap-2">
                {
                    isCanLogProgress && (
                        logging
                            ? <LogInput
                                unit={habit.goal.unit}
                                onAccept={handleLogging}
                                onCancel={() => setLogging(false)}
                            />
                            : actionButton
                    )
                }
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
                                    item.action?.();
                                }}
                                className="flex items-center gap-2 cursor-pointer [&_.lucide]:w-4 [&_.lucide]:h-4"
                            >
                                {item.icon}
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