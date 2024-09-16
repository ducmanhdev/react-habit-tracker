import {useMutation} from "convex/react";
import {api} from "@convex/_generated/api";
import {useState} from "react";
import {toast} from "sonner";
import {useModalConfirmContext} from "@/contexts/modal-confirm-provider.tsx";
import {Id} from "@convex/_generated/dataModel";

export const useAddGroup = () => {
    const add = useMutation(api.habitGroups.addGroup);
    const [addLoading, setAddLoading] = useState(false);
    const handleAdd = async (args: Parameters<typeof add>[0]) => {
        try {
            setAddLoading(true);
            await add(args)
            toast.success('Add successfully');
        } catch (error) {
            toast.error('Add failed');
        } finally {
            setAddLoading(false);
        }
    }

    return {
        handleAdd,
        addLoading,
    }
}

export const useUpdateGroup = () => {
    const update = useMutation(api.habitGroups.updateGroup);
    const [updateLoading, setUpdateLoading] = useState(false);
    const handleUpdate = async (args: Parameters<typeof update>[0]) => {
        try {
            setUpdateLoading(true);
            await update(args)
            toast.success('Update successfully');
        } catch (error) {
            toast.error('Update failed');
        } finally {
            setUpdateLoading(false);
        }
    }

    return {
        handleUpdate,
        updateLoading,
    }
}

export const useDeleteGroup = () => {
    const modalConfirm = useModalConfirmContext();
    const del = useMutation(api.habitGroups.deleteGroup);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const handleDelete = (id: Id<"habitGroups">, cb?: () => void) => {
        modalConfirm.confirm(async () => {
            try {
                setDeleteLoading(true);
                await del({id});
                toast.success('Deleted successfully');
                cb?.();
            } catch (error) {
                toast.error('Delete failed');
            } finally {
                setDeleteLoading(false);
            }
        })
    }

    return {
        handleDelete,
        deleteLoading,
    }
}