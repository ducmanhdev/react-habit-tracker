import {forwardRef, useImperativeHandle, useState} from "react";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useForm, useWatch} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Id} from "@convex/_generated/dataModel";
import {useQuery} from "convex/react";
import {api} from "@convex/_generated/api";
import IconPicker, {IconName} from "@/components/IconPicker.tsx";
import DatePicker from "@/components/DatePicker.tsx";
import {HABIT_SCHEDULE_TYPES, HABIT_GOAL_UNITS, HABIT_GOAL_TIME_UNITS} from "@/constants/habits.ts";
import dayjs from "@/lib/dayjs";
import {convertToCapitalCase} from "@/utils/string.ts";
import {DAYS_OF_WEEKS} from "@/constants/dates.ts";
import Combobox from "@/components/Combobox.tsx";
import {useAddHabit, useDeleteHabit, useUpdateHabit} from "@/hooks/useHabitItems.ts";

const SCHEDULE_TYPE_OPTIONS = HABIT_SCHEDULE_TYPES.map(item => ({
    label: convertToCapitalCase(item),
    value: item,
}));

const GOAL_UNIT_OPTIONS = HABIT_GOAL_UNITS.map(item => ({
    label: convertToCapitalCase(item),
    value: item,
}));

const GOAL_UNIT_TIME_OPTIONS = HABIT_GOAL_TIME_UNITS.map(item => ({
    label: convertToCapitalCase(item),
    value: item,
}));

const DAYS_OF_MONTH_OPTIONS = Array.from({length: 31}, (_, index) => ({
    label: (index + 1).toString(),
    value: index
}));

const DAYS_OF_WEEK_OPTIONS = DAYS_OF_WEEKS.map((item, index) => ({
    label: item,
    value: index
}));

const INTERVAL_OPTIONS = Array.from({length: 6}, (_, index) => index + 2).map(item => ({
    label: item.toString(),
    value: item
}));

const scheduleSchema = z.object({
    type: z.enum(HABIT_SCHEDULE_TYPES),
    daysOfWeek: z.optional(z.array(z.number())),
    daysOfMonth: z.optional(z.array(z.number())),
    interval: z.optional(z.number()),
}).superRefine((data, ctx) => {
    const {type, daysOfWeek, daysOfMonth, interval} = data;

    if (type === "daily" && (!daysOfWeek || !daysOfWeek.length)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["daysOfWeek"],
            message: "Days of week is required for daily schedule.",
        });
    }

    if (type === "monthly" && (!daysOfMonth || !daysOfMonth.length)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["daysOfMonth"],
            message: "Days of month is required for monthly schedule.",
        });
    }

    if (type === "custom" && (interval === undefined || interval <= 0)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["interval"],
            message: "Interval is required and should be greater than 0 for custom schedule.",
        });
    }
});

const formSchema = z.object({
    id: z.optional(z.string()),
    groupId: z.optional(z.string()),
    name: z.string().min(1, {message: "Please enter the name of the habit"}),
    icon: z.optional(z.string()),
    schedule: scheduleSchema,
    goal: z.object({
        target: z.number().min(1, {message: "Target must be at least 1"}),
        unit: z.enum(HABIT_GOAL_UNITS, {invalid_type_error: "Invalid goal unit"}),
        timeUnit: z.enum(HABIT_GOAL_TIME_UNITS, {invalid_type_error: "Invalid goal time unit"}),
    }),
    startDate: z.number().min(1, {message: "Start date must be a valid number"})
});

type FormData = z.infer<typeof formSchema>;

const INITIAL_VALUE_MODAL_HABIT_ITEM: FormData = {
    name: '',
    icon: undefined,
    schedule: {
        type: "daily",
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        daysOfMonth: [0],
        interval: 2,
    },
    goal: {
        target: 1,
        unit: 'times',
        timeUnit: 'day',
    },
    startDate: dayjs().valueOf(),
    groupId: undefined,
};

type ModalOpenInputUpdateProps = FormData & {
    _id: Id<"habitItems">
}

type ModalOpenInputCreateProps = { groupId?: string }

type ModalOpenInputProps = ModalOpenInputUpdateProps | ModalOpenInputCreateProps

export type ModalAddHabitItemRef = {
    open: (initialValue?: ModalOpenInputProps) => void
}

const ModalAddHabitItem = forwardRef<ModalAddHabitItemRef>((_props, ref) => {
    useImperativeHandle(ref, () => ({
        open: (initialValue) => {
            if (initialValue && "_id" in initialValue) {
                const {_id, ...rest} = initialValue;
                form.reset({
                    ...rest,
                    id: _id,
                });
            } else {
                form.reset({
                    ...INITIAL_VALUE_MODAL_HABIT_ITEM,
                    groupId: initialValue?.groupId
                });
            }
            setOpen(true);
        }
    }));

    const [open, setOpen] = useState(false);
    const {handleDelete, deleteLoading} = useDeleteHabit();
    const {handleAdd} = useAddHabit();
    const {handleUpdate} = useUpdateHabit();

    const habitGroups = useQuery(api.habitGroups.getGroups);
    const habitGroupOptions = (habitGroups || []).map(group => ({
        label: group.name,
        value: group._id,
    }))

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const [submitLoading, setSubmitLoading] = useState(false);
    const onSubmit = async (values: FormData) => {
        setSubmitLoading(true);
        const {id, groupId, ...rest} = values;

        if (id) {
            await handleUpdate({
                ...rest,
                id: id as Id<"habitItems">,
                groupId: groupId as Id<"habitGroups">,
            });
        } else {
            await handleAdd({
                ...rest,
                groupId: groupId as Id<"habitGroups">,
            });
        }

        setSubmitLoading(false);
        setOpen(false);
    };

    const scheduleType = useWatch({
        control: form.control,
        name: "schedule.type",
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{form.getValues("id") ? "Update" : "Create"} Habit Item</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="groupId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Group</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            buttonClassName="w-full"
                                            options={habitGroupOptions}
                                            value={field.value}
                                            // TODO temporary
                                            onChange={value => field.onChange(value ?? "")}
                                            clearable
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
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
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
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
                                            <Combobox
                                                buttonClassName="w-full"
                                                options={GOAL_UNIT_OPTIONS}
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
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
                                            <Combobox
                                                buttonClassName="w-full"
                                                options={GOAL_UNIT_TIME_OPTIONS}
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
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
                                        <Combobox
                                            buttonClassName="w-full"
                                            options={SCHEDULE_TYPE_OPTIONS}
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        {
                            scheduleType === "daily" &&
                            (
                                <FormField
                                    control={form.control}
                                    name="schedule.daysOfWeek"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Days of week</FormLabel>
                                            <FormControl>
                                                <Combobox
                                                    multiple
                                                    buttonClassName="w-full"
                                                    options={DAYS_OF_WEEK_OPTIONS}
                                                    value={field.value || []}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            )
                        }
                        {
                            scheduleType === "monthly" &&
                            (
                                <FormField
                                    control={form.control}
                                    name="schedule.daysOfMonth"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Days of month</FormLabel>
                                            <FormControl>
                                                <Combobox
                                                    buttonClassName="w-full"
                                                    multiple
                                                    options={DAYS_OF_MONTH_OPTIONS}
                                                    value={field.value || []}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            )
                        }
                        {
                            scheduleType === "custom" &&
                            (
                                <FormField
                                    control={form.control}
                                    name="schedule.interval"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Interval</FormLabel>
                                            <FormControl>
                                                <Combobox
                                                    buttonClassName="w-full"
                                                    options={INTERVAL_OPTIONS}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            )
                        }
                        <FormField
                            control={form.control}
                            name="startDate"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Start date</FormLabel>
                                    <FormControl>
                                        <DatePicker
                                            buttonClasses="w-full"
                                            value={dayjs(field.value).toDate()}
                                            onChange={date => form.setValue('startDate', dayjs(date).valueOf())}
                                        />
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
                            {form.getValues("id") ? "Update" : "Create"}
                        </Button>
                        {form.getValues("id") && (
                            <Button
                                type="button"
                                variant="destructive"
                                className="w-full"
                                disabled={deleteLoading}
                                onClick={() => handleDelete(
                                    form.getValues("id") as Id<"habitItems">,
                                    () => setOpen(false))
                            }
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

export default ModalAddHabitItem;
