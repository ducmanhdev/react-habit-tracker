import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Pencil, Trash} from "lucide-react";
import {Doc} from "../../../convex/_generated/dataModel";
import {useMutation} from "convex/react";
import {api} from "../../../convex/_generated/api";
import {toast} from "sonner";
import {useModalConfirm} from "@/contexts/modal-confirm-provider.tsx";

type RightBarProps = {
    currentHabit: Doc<"habitItems">;
    onEdit: () => void;
}

const RightBar = ({currentHabit, onEdit}: RightBarProps) => {
    const modalConfirm = useModalConfirm();
    const del = useMutation(api.habitItems.deleteItem);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const handleDelete = () => {
        modalConfirm.confirm(async () => {
            try {
                setDeleteLoading(true);
                await del({id: currentHabit._id});
                toast.success('Deleted successfully');
            } catch (error) {
                toast.error('Delete failed');
            } finally {
                setDeleteLoading(false);
            }
        })
    }
    return (
        <nav className="p-4 flex gap-2 justify-between items-center">
            <h2>{currentHabit.name}</h2>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => onEdit()}>
                    <Pencil/>
                </Button>
                <Button variant="outline" onClick={() => handleDelete()} disabled={deleteLoading}>
                    <Trash/>
                </Button>
            </div>
        </nav>
    )
}

export default RightBar