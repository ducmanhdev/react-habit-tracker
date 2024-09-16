import Toolbar, {FilteredData} from "./Toolbar.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {useEffect, useState, Dispatch, SetStateAction} from "react";
import {useQuery} from "convex/react";
import {api} from "@convex/_generated/api";
import {Doc, Id} from "@convex/_generated/dataModel";
import {useParams} from "react-router-dom";
import List from "./List.tsx";

type IndexProps = {
    onCreate: (groupId?: string) => void;
    onEdit: (habit: Doc<"habitItems">) => void;
    currentHabit: Doc<"habitItems"> | null;
    setCurrentHabit: Dispatch<SetStateAction<Doc<"habitItems"> | null>>;
}

const Index = ({onCreate, onEdit, currentHabit, setCurrentHabit}: IndexProps) => {
    const {habitGroupId} = useParams();
    const [filteredHabits, setFilteredHabits] = useState<FilteredData>();
    const habitItems = useQuery(api.habitItems.getItems, {
        search: filteredHabits?.search,
        date: filteredHabits?.date?.valueOf(),
        order: filteredHabits?.order,
        groupId: habitGroupId as Id<"habitGroups">,
    });

    useEffect(() => {
        if (!habitItems || !habitItems.length) setCurrentHabit(null);
        if ((habitItems || []).findIndex(habit => currentHabit?._id === habit._id) === -1) setCurrentHabit(null);
    }, [habitItems, currentHabit, setCurrentHabit]);

    return (
        <section className="border-r">
            <Toolbar
                onFilter={setFilteredHabits}
                onCreateHabit={() => onCreate(habitGroupId)}
            />
            <Separator/>
            <List
                habitItems={habitItems}
                currentHabit={currentHabit}
                onClick={habit => setCurrentHabit(habit)}
                onEdit={onEdit}
            />
        </section>
    );
};

export default Index;