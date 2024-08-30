import {forwardRef, useImperativeHandle, useState} from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export type ModalConfirmRef = {
    open: (onConfirm: () => void) => void
}

export const ModalConfirm = forwardRef((_props, ref) => {
    const [open, setOpen] = useState(false);
    const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | null>(null);

    useImperativeHandle(ref, () => ({
        open: (onConfirm: () => void) => {
            setOnConfirmCallback(() => onConfirm);
            setOpen(true);
        }
    }));

    const handleConfirm = () => {
        if (onConfirmCallback) {
            onConfirmCallback();
        }
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
});

export default ModalConfirm;
