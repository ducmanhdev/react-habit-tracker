import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion.tsx";
import HabitItem from "@/components/HabitItem.tsx";
import dayjs from "dayjs";
import {IHabitItem} from "@/types/habits"
import {DATE_FORMAT} from "@/constants";

interface IHabitListProps {
    items: IHabitItem[];
    currentHabitId: number | undefined;
    onSelectHabit: (habit: IHabitItem) => void
}

interface HabitGroup {
    label: string;
    items: IHabitItem[];
}

const HabitList = ({items, currentHabitId, onSelectHabit}: IHabitListProps) => {
    const defaultValue = ["this-date", "this-week"]

    const handleGroupItems = () => {
        const now = dayjs();
        const groups: Record<string, HabitGroup> = {
            thisDate: {
                label: 'This date',
                items: [],
            },
            thisWeek: {
                label: 'This week',
                items: [],
            },
            thisMonth: {
                label: 'This month',
                items: [],
            },
            completed: {
                label: 'Completed',
                items: [],
            },
        };

        items.forEach(item => {
            if (item.completed) {
                groups.completed.items.push(item);
            } else if (dayjs(item.dueDate, DATE_FORMAT).isSame(now, 'date')) {
                groups.thisDate.items.push(item);
            } else if (dayjs(item.dueDate, DATE_FORMAT).isSame(now, 'week')) {
                groups.thisWeek.items.push(item);
            } else if (dayjs(item.dueDate, DATE_FORMAT).isSame(now, 'month')) {
                groups.thisMonth.items.push(item);
            }
        });

        return groups;
    };

    const groupedItems = handleGroupItems();

    return (
        <div className="p-4">
            <Accordion type="multiple" className="w-full" defaultValue={defaultValue}>
                {
                    Object.entries(groupedItems).map(([key, group]) => {
                        return group.items.length > 0 && (
                            <AccordionItem
                                key={key}
                                value={key}
                            >
                                <AccordionTrigger>{group.label}</AccordionTrigger>
                                <AccordionContent className="space-y-2">
                                    {
                                        group.items.map((item: IHabitItem) => {
                                            return (
                                                <HabitItem
                                                    key={item.id}
                                                    isComplete={item.completed}
                                                    isActive={item.id === currentHabitId}
                                                    onClick={() => onSelectHabit(item)}
                                                />
                                            )
                                        })
                                    }
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })
                }
            </Accordion>
        </div>
    );
};

export default HabitList;