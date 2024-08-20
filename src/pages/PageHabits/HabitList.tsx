import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion.tsx";
import HabitItem from "@/components/HabitItem.tsx";
import {Doc} from "../../../convex/_generated/dataModel";
import dayjs from "dayjs";

type HabitListProps = {
    items: Doc<"habitItems">[];
    currentHabitId?: Doc<"habitItems">["_id"];
    onSelectHabit: (habit: Doc<"habitItems">) => void
}

type HabitGroup = {
    label: string;
    items: Doc<"habitItems">[];
}

const HabitList = ({items, currentHabitId, onSelectHabit}: HabitListProps) => {
    return (
        <pre>
            {JSON.stringify(items, null, "\t")}
        </pre>
    )


    // const defaultValue = ["this-date", "this-week"];
    //
    // const handleGroupItems = () => {
    //     const now = dayjs();
    //     const groups: Record<string, HabitGroup> = {
    //         thisDate: {
    //             label: 'This date',
    //             items: [],
    //         },
    //         thisWeek: {
    //             label: 'This week',
    //             items: [],
    //         },
    //         thisMonth: {
    //             label: 'This month',
    //             items: [],
    //         },
    //         overdue: {
    //             label: 'Overdue',
    //             items: [],
    //         },
    //     };
    //
    //     items?.forEach(item => {
    //         const lastCompletedDate = dayjs(item.lastCompleted);
    //         let dueDate;
    //
    //         if (item.frequency === 'daily') {
    //             dueDate = lastCompletedDate.add(1, 'day');
    //         } else if (item.frequency === 'weekly') {
    //             dueDate = lastCompletedDate.add(1, 'week');
    //         } else if (item.frequency === 'monthly') {
    //             dueDate = lastCompletedDate.add(1, 'month');
    //         }
    //
    //         if (dayjs(dueDate).isBefore(now, 'date')) {
    //             groups.overdue.items.push(item);
    //         } else if (dayjs(dueDate).isSame(now, 'date')) {
    //             groups.thisDate.items.push(item);
    //         } else if (dayjs(dueDate).isSame(now, 'week')) {
    //             groups.thisWeek.items.push(item);
    //         } else if (dayjs(dueDate).isSame(now, 'month')) {
    //             groups.thisMonth.items.push(item);
    //         }
    //     });
    //
    //     return groups;
    // };
    //
    // const groupedItems = handleGroupItems();
    //
    // return (
    //     <div className="p-4">
    //         <Accordion type="multiple" className="w-full" defaultValue={defaultValue}>
    //             {
    //                 Object.entries(groupedItems).map(([key, group]) => {
    //                     return group.items.length > 0 && (
    //                         <AccordionItem
    //                             key={key}
    //                             value={key}
    //                         >
    //                             <AccordionTrigger>{group.label}</AccordionTrigger>
    //                             <AccordionContent className="space-y-2">
    //                                 {
    //                                     group.items.map(item => {
    //                                         return (
    //                                             <HabitItem
    //                                                 key={item.id}
    //                                                 isComplete={item.completed}
    //                                                 isActive={item.id === currentHabitId}
    //                                                 onClick={() => onSelectHabit(item)}
    //                                             />
    //                                         )
    //                                     })
    //                                 }
    //                             </AccordionContent>
    //                         </AccordionItem>
    //                     )
    //                 })
    //             }
    //         </Accordion>
    //     </div>
    // );
};

export default HabitList;