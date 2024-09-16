import {useMutation} from "convex/react";
import {api} from "@convex/_generated/api";
import {useState} from "react";
import {toast} from "sonner";
import {useModalConfirmContext} from "@/contexts/modal-confirm-provider.tsx";
import {Id} from "@convex/_generated/dataModel";

export const useAddHabit = () => {
    const add = useMutation(api.habitItems.addItem);
    const [addLoading, setAddLoading] = useState(false);
    const handleAdd = async (args: Parameters<typeof add>[0]) => {
        try {
            setAddLoading(true);
            await add(args);
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

export const useUpdateHabit = () => {
    const update = useMutation(api.habitItems.updateItem);
    const [updateLoading, setUpdateLoading] = useState(false);
    const handleUpdate = async (args: Parameters<typeof update>[0]) => {
        try {
            setUpdateLoading(true);
            await update(args);
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

export const useDeleteHabit = () => {
    const modalConfirm = useModalConfirmContext();
    const del = useMutation(api.habitItems.deleteItem);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const handleDelete = (id: Id<"habitItems">, cb?: () => void) => {
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

export const useRestoreDeleteHabit = () => {
    const restoreDeleteItem = useMutation(api.habitItems.restoreDeleteItem);
    const [restoreDeleteLoading, setRestoreDeleteLoading] = useState(false);
    const handleRestoreDelete = async (id: Id<"habitItems">) => {
        try {
            setRestoreDeleteLoading(true);
            await restoreDeleteItem({id});
            toast.success('Restore delete successfully');
        } catch (error) {
            toast.error('Restore delete failed');
        } finally {
            setRestoreDeleteLoading(false);
        }
    }

    return {
        handleRestoreDelete,
        restoreDeleteLoading
    }
}

export const useArchiveHabit = () => {
    const archiveItem = useMutation(api.habitItems.archiveItem);
    const [archiveLoading, setArchiveLoading] = useState(false);
    const handleArchive = async (id: Id<"habitItems">) => {
        try {
            setArchiveLoading(false);
            await archiveItem({id});
            toast.success('Archive successfully');
        } catch (error) {
            toast.error('Archive failed');
        } finally {
            setArchiveLoading(true);
        }
    }

    return {
        handleArchive,
        archiveLoading
    }
}

export const useRestoreArchiveHabit = () => {
    const restoreArchiveItem = useMutation(api.habitItems.restoreArchiveItem);
    const [restoreArchiveLoading, setRestoreArchiveLoading] = useState(false);
    const handleRestoreArchive = async (id: Id<"habitItems">) => {
        try {
            setRestoreArchiveLoading(false);
            await restoreArchiveItem({id});
            toast.success('Restore archive successfully');
        } catch (error) {
            toast.error('Restore archive failed');
        } finally {
            setRestoreArchiveLoading(true);
        }
    }

    return {
        handleRestoreArchive,
        restoreArchiveLoading
    }
}

export const useUpdateCountHabit = () => {
    const updateCompletedCount = useMutation(api.habitItems.updateCompletedCount);
    const [updateCountLoading, setUpdateCountLoading] = useState(false);
    const handleUpdateCount = async ({id, increment}: { id: Id<"habitItems">, increment: number }) => {
        try {
            setUpdateCountLoading(true);
            await updateCompletedCount({id, increment});
        } catch (error) {
            toast.error('Update failed');
        } finally {
            setUpdateCountLoading(false);
        }
    }

    return {
        handleUpdateCount,
        updateCountLoading
    }
}

export const useResetCompletedCount = () => {
    const resetCompletedCount = useMutation(api.habitItems.resetCompletedCount);
    const [resetCompletedCountLoading, setResetCompletedCountLoading] = useState(false);
    const handleResetCompletedCount = async (id: Id<"habitItems">) => {
        try {
            setResetCompletedCountLoading(false);
            await resetCompletedCount({id});
        } catch (error) {
            toast.error('Delete failed');
        } finally {
            setResetCompletedCountLoading(true);
        }
    }
    return {
        handleResetCompletedCount,
        resetCompletedCountLoading
    }
}