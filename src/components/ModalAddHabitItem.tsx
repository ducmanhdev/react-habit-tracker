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
import IconPicker, {IconName} from "@/components/IconPicker.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import DatePicker from "@/components/DatePicker.tsx";
import dayjs from "dayjs";

const formSchema = z.object({
    name: z.string().min(1, "Please enter the name of the habit"),
    icon: z.optional(z.string()),
    schedule: z.object({
        type: z.enum(["daily", "weekly", "monthly", "custom"]),
        daysOfWeek: z.optional(z.array(z.number())),
        daysOfMonth: z.optional(z.array(z.number())),
        interval: z.optional(z.number()),
    }),
    goal: z.object({
        target: z.number().min(1, "Target must be at least 1"),
        unit: z.enum(["times", "minutes", "glasses"]),
        timeUnit: z.enum(["day", "week", "month"]),
    }),
    startDate: z.number().min(1)
});

type ScheduleType = "daily" | "weekly" | "monthly" | "custom";
type GoalUnit = "times" | "minutes" | "glasses";
type GoalTimeUnit = "day" | "week" | "month";

type InitialModalHabitItemValue = {
    id?: Id<"habitItems">,
    name: string,
    icon?: IconName,
    schedule: {
        type: ScheduleType,
        daysOfWeek?: number[],
        daysOfMonth?: number[],
        interval?: number,
    },
    goal: {
        target: number,
        unit: GoalUnit,
        timeUnit: GoalTimeUnit,
    },
    startDate: number,
};

const INITIAL_VALUE_MODAL_HABIT_ITEM: InitialModalHabitItemValue = {
    name: '',
    icon: undefined,
    schedule: {
        type: "daily",
        daysOfWeek: [0, 1, 2, 3, 4, 5],
        daysOfMonth: undefined,
        interval: undefined,
    },
    goal: {
        target: 1,
        unit: 'times',
        timeUnit: 'day',
    },
    startDate: dayjs().valueOf()
};

const SCHEDULE_TYPE_OPTIONS: { label: string; value: ScheduleType }[] = [
    {
        label: "Daily",
        value: "daily",
    },
    {
        label: "Weekly",
        value: "weekly",
    },
    {
        label: "Monthly",
        value: "monthly",
    },
    {
        label: "Custom",
        value: "custom",
    }
];

const GOAL_UNIT_OPTIONS: { label: string; value: GoalUnit }[] = [
    {
        label: "Times",
        value: "times",
    },
    {
        label: "Minutes",
        value: "minutes",
    },
    {
        label: "Glasses",
        value: "glasses",
    },
];

const GOAL_UNIT_TIME_OPTIONS: { label: string; value: GoalTimeUnit }[] = [
    {
        label: "Day",
        value: "day",
    },
    {
        label: "Week",
        value: "week",
    },
    {
        label: "Month",
        value: "month",
    },
];

export type ModalAddHabitItemRef = {
    open: (initialValue?: InitialModalHabitItemValue) => void
}

const ModalHabitItem = forwardRef((_props, ref) => {
    useImperativeHandle(ref, () => ({
        open: (initialValue?: InitialModalHabitItemValue) => {
            if (initialValue) {
                setItemId(initialValue?.id);
                form.reset({
                    ...initialValue,
                });
            } else {
                setItemId(undefined);
                form.reset({
                    ...INITIAL_VALUE_MODAL_HABIT_ITEM
                });
            }
            setOpen(true);
        }
    }));

    const add = useMutation(api.habits.addHabitItem);
    const update = useMutation(api.habits.updateHabitItem);
    const del = useMutation(api.habits.deleteHabitItem);

    const [open, setOpen] = useState(false);
    const [itemId, setItemId] = useState<InitialModalHabitItemValue["id"]>();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });
    const [submitLoading, setSubmitLoading] = useState(false);
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setSubmitLoading(true);
            if (itemId) {
                await update({
                    id: itemId,
                    ...values,
                });
                toast.success("Updated successfully");
            } else {
                await add({
                    ...values,
                });
                toast.success("Created successfully");
            }
            setOpen(false);
        } catch (error) {
            toast.error("Something went wrong!");
        } finally {
            setSubmitLoading(false);
        }
    };

    const [deleteLoading, setDeleteLoading] = useState(false);
    const handleDelete = async () => {
        try {
            setDeleteLoading(true);
            await del({
                id: itemId!,
            });
            toast.success('Deleted successfully');
            setOpen(false);
        } catch (error) {
            toast.error('Delete failed');
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{itemId ? "Update" : "Create"} Habit Item</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-[80px_1fr] gap-4">
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
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="goal.target"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Target</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="goal.unit"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Unit</FormLabel>
                                        <FormControl>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue {...field}/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {
                                                        GOAL_UNIT_OPTIONS.map(({label, value}) => (
                                                            <SelectItem value={value}>{label}</SelectItem>
                                                        ))
                                                    }
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="goal.timeUnit"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Time Unit</FormLabel>
                                        <FormControl>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue {...field}/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {
                                                        GOAL_UNIT_TIME_OPTIONS.map(({label, value}) => (
                                                            <SelectItem value={value}>{label}</SelectItem>
                                                        ))
                                                    }
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="schedule.type"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Repeat</FormLabel>
                                    <FormControl>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue {...field}/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {
                                                    SCHEDULE_TYPE_OPTIONS.map(({label, value}) => (
                                                        <SelectItem value={value}>{label}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="schedule.type"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Start date</FormLabel>
                                    <FormControl>
                                        {/*<DatePicker*/}
                                        {/*    value={dayjs(field.value).toDate()}*/}
                                        {/*    onChange={date => form.setValue('startDate', dayjs(date).valueOf())}*/}
                                        {/*/>*/}
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={submitLoading}
                        >
                            {itemId ? "Update" : "Create"}
                        </Button>
                        {itemId && (
                            <Button
                                variant="destructive"
                                className="w-full"
                                disabled={deleteLoading}
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                        )}
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
});

export default ModalHabitItem;
