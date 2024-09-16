import {Button} from "@/components/ui/button.tsx";
import {Pencil, Trash} from "lucide-react";
import {useDeleteHabit} from "@/hooks/useHabitItems.ts";
import {Doc} from "@convex/_generated/dataModel";

type ToolbarProps = {
    currentHabit: Doc<"habitItems">,
    onEdit: () => void;
}
const Toolbar = ({currentHabit, onEdit}: ToolbarProps) => {
    const {handleDelete, deleteLoading} = useDeleteHabit();
    return (
        <nav className="p-4 flex gap-2 justify-between items-center">
            <h2>{currentHabit?.name}</h2>
            <div className="flex gap-2">
                <Button variant="outline" onClick={onEdit}>
                    <Pencil/>
                </Button>
                <Button
                    variant="outline"
                    onClick={() => handleDelete(currentHabit?._id)}
                    disabled={deleteLoading}
                >
                    <Trash/>
                </Button>
            </div>
        </nav>
    )
}

export default Toolbar