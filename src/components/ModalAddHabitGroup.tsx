import {forwardRef, useImperativeHandle, useState} from "react";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Id} from "../../convex/_generated/dataModel";
import {useMutation} from "convex/react";
import {api} from "../../convex/_generated/api";
import {toast} from "sonner";
import IconPicker, {IconName} from "@/components/IconPicker.tsx"

const formSchema = z.object({
    name: z.string().min(1, "Please enter name of habit group"),
    icon: z.string()
})

type InitialModalAddGroupValue = {
    id?: Id<"habitGroups">,
    name: string,
    icon?: IconName,
}

const INITIAL_VALUE_MODAL_ADD_GROUP: InitialModalAddGroupValue = {
    name: '',
    icon: undefined,
}

export type ModalAddHabitGroupRef = {
    open: (initialValue?: InitialModalAddGroupValue) => void
}

const ModalAddHabitGroup = forwardRef((_props, ref) => {
    useImperativeHandle(ref, () => ({
        open: (initialValue?: InitialModalAddGroupValue) => {
            if (initialValue) {
                setGroupId(initialValue?.id)
                form.reset({
                    icon: initialValue?.icon,
                    name: initialValue?.name,
                });
            } else {
                setGroupId(undefined)
                form.reset({
                    icon: INITIAL_VALUE_MODAL_ADD_GROUP?.icon,
                    name: INITIAL_VALUE_MODAL_ADD_GROUP?.name,
                });
            }
            setOpen(true);
        }
    }));

    const add = useMutation(api.habits.addHabitGroup);
    const update = useMutation(api.habits.updateHabitGroup);
    const del = useMutation(api.habits.deleteHabitGroup);

    const [open, setOpen] = useState(false);
    const [groupId, setGroupId] = useState<InitialModalAddGroupValue["id"]>();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })
    const [submitLoading, setSubmitLoading] = useState(false);
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setSubmitLoading(true)
            if (groupId) {
                await update({
                    id: groupId,
                    name: values.name,
                    icon: values.icon
                })
                toast.success("Update successfully");
            } else {
                await add({
                    name: values.name,
                    icon: values.icon
                })
                toast.success("Create successfully");
            }
            setOpen(false)
        } catch (error) {
            toast.error("Somethings went wrong!")
        } finally {
            setSubmitLoading(false)
        }
    };

    const [deleteLoading, setDeleteLoading] = useState(false);
    const handleDelete = async () => {
        try {
            setDeleteLoading(true)
            await del({
                id: groupId!,
            })
            toast.success('Delete successfully');
            setOpen(false);
        } catch (error) {
            toast.success('Delete failed');
        } finally {
            setDeleteLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{groupId ? "Update" : "Create"} new habit group</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="icon"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Icon</FormLabel>
                                    <FormControl>
                                        <IconPicker
                                            currentIcon={field.value as IconName}
                                            onIconSelect={(iconName) => form.setValue('icon', iconName)}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={submitLoading}
                        >{groupId ? "Update" : "Create"}</Button>
                        {
                            groupId &&
                            <Button
                                variant="destructive"
                                className="w-full"
                                disabled={deleteLoading}
                                onClick={handleDelete}
                            >Delete</Button>
                        }
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
})

export default ModalAddHabitGroup;