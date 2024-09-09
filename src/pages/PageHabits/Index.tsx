import {Separator} from "@/components/ui/separator.tsx"
import LeftBar, {FilteredData} from "@/pages/PageHabits/LeftBar.tsx";
import {useParams} from "react-router-dom";
import {useEffect, useMemo, useRef, useState} from "react";
import RightBar from "@/pages/PageHabits/RightBar.tsx";
import HabitBoard from "@/pages/PageHabits/HabitBoard.tsx";
import CardHabitsEmpty from "../../components/CardHabitsEmpty.tsx";
import ModalAddHabitItem from "@/components/ModalAddHabitItem.tsx";
import {useQuery} from "convex/react";
import {api} from "../../../convex/_generated/api";
import {Id} from "../../../convex/_generated/dataModel";
import {ModalAddHabitItemRef} from "@/components/ModalAddHabitItem.tsx";
import HabitItem from "@/components/HabitItem.tsx";
import HabitItemSkeleton from "@/components/HabitItemSkeleton.tsx";

const Index = () => {
    const {habitGroupId} = useParams();
    const [filteredHabits, setFilteredHabits] = useState<FilteredData>();
    const [currentHabitId, setCurrentHabitId] = useState<Id<"habitItems">>();
    const habitItems = useQuery(api.habitItems.getItems, {
        search: filteredHabits?.search,
        date: filteredHabits?.date?.valueOf(),
        order: filteredHabits?.order,
        groupId: habitGroupId as Id<"habitGroups">,
    });

    useEffect(() => {
        if (habitItems?.findIndex(habit => habit._id === currentHabitId) === -1) {
            setCurrentHabitId(undefined);
        }
    }, [currentHabitId, habitItems]);

    const currentHabit = useMemo(() => {
        if (currentHabitId === undefined) return undefined;
        return (habitItems || []).find(habit => habit._id === currentHabitId);
    }, [currentHabitId, habitItems])

    const modalAddHabitIemRef = useRef<ModalAddHabitItemRef>(null);
    return (
        <>
            <div className="grid grid-cols-2 h-full">
                <section className="border-r">
                    <LeftBar
                        onFilter={setFilteredHabits}
                        onCreateHabit={() => modalAddHabitIemRef?.current?.open({
                            groupId: habitGroupId,
                        })}
                    />
                    <Separator/>
                    <div className="p-4 space-y-4">
                        {
                            habitItems === undefined ? (
                                Array.from({length: 4}).map((_, index) => (
                                    <HabitItemSkeleton key={index}/>
                                ))
                            ) : habitItems.length === 0 ? (
                                <CardHabitsEmpty />
                            ) : (
                                habitItems.map(habit => (
                                    <HabitItem
                                        key={habit._id}
                                        habit={habit}
                                        isActive={habit._id === currentHabitId}
                                        onClick={() => setCurrentHabitId(habit._id)}
                                        onEdit={() => modalAddHabitIemRef?.current?.open(habit)}
                                    />
                                ))
                            )
                        }
                    </div>
                </section>
                {
                    currentHabit && (
                        <section>
                            <RightBar
                                currentHabit={currentHabit}
                                onEdit={() => modalAddHabitIemRef?.current?.open(currentHabit)}
                            />
                            <Separator/>
                            <HabitBoard currentHabit={currentHabit}/>
                        </section>
                    )
                }
            </div>
            <ModalAddHabitItem ref={modalAddHabitIemRef}/>
        </>
    );
};

export default Index;