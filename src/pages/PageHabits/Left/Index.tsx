import {Dispatch, RefObject, SetStateAction, useEffect, useState} from "react";
import Toolbar, {FilteredData} from "./Toolbar.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {useQuery} from "convex/react";
import {api} from "@convex/_generated/api";
import List from "./List.tsx";
import {Doc, Id} from "@convex/_generated/dataModel";
import {ModalAddHabitItemRef} from "@/components/ModalAddHabitItem.tsx";

type IndexProps = {
    currentGroupId: Id<"habitGroups">;
    setCurrentHabit: Dispatch<SetStateAction<Doc<"habitItems"> | null>>;
    modalAddHabitIemRef: RefObject<ModalAddHabitItemRef>;
}

const Index = ({currentGroupId, setCurrentHabit, modalAddHabitIemRef}: IndexProps) => {
    const [filteredHabits, setFilteredHabits] = useState<FilteredData>();
    const [currentHabitId, setCurrentHabitId] = useState<Id<"habitItems"> | null>(null);
    const habitItems = useQuery(api.habitItems.getItems, {
        search: filteredHabits?.search,
        date: filteredHabits?.date?.valueOf(),
        order: filteredHabits?.order,
        groupId: currentGroupId,
    });

    useEffect(() => {
        setCurrentHabit((habitItems || []).find(habit => habit._id === currentHabitId) || null);
    });

    return (
        <section className="border-r">
            <Toolbar
                onFilter={setFilteredHabits}
                onCreateHabit={() => modalAddHabitIemRef.current?.open({
                    groupId: currentGroupId
                })}
            />
            <Separator/>
            <List
                currentHabitId={currentHabitId}
                habitItems={habitItems}
                onEdit={habit => modalAddHabitIemRef.current?.open({...habit})}
                onClick={setCurrentHabitId}
            />
        </section>
    );
};

export default Index;