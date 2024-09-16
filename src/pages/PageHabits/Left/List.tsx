import HabitItemSkeleton from "@/components/HabitItemSkeleton.tsx";
import CardHabitsEmpty from "@/components/CardHabitsEmpty.tsx";
import HabitItem from "@/components/HabitItem.tsx";
import {Doc, Id} from "@convex/_generated/dataModel";

type ToolbarProps = {
    habitItems: Doc<"habitItems">[] | undefined,
    currentHabitId: Id<"habitItems"> | null,
    onClick: (habitId: Id<"habitItems">) => void;
    onEdit: (habit: Doc<"habitItems">) => void;
}

const Toolbar = ({habitItems, currentHabitId, onClick, onEdit}: ToolbarProps) => {
    return (
        <div className="p-4 space-y-4">
            {
                habitItems === undefined ? (
                    Array.from({length: 4}).map((_, index) => (
                        <HabitItemSkeleton key={index}/>
                    ))
                ) : habitItems.length === 0 ? (
                    <CardHabitsEmpty/>
                ) : (
                    habitItems.map(habit => (
                        <HabitItem
                            key={habit._id}
                            habit={habit}
                            isActive={habit._id === currentHabitId}
                            onClick={() => onClick(habit._id)}
                            onEdit={() => onEdit(habit)}
                        />
                    ))
                )
            }
        </div>
    )
}

export default Toolbar