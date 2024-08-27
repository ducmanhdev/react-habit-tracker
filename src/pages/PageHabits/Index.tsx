import {Separator} from "@/components/ui/separator.tsx"
import LeftBar, {FilteredData} from "@/pages/PageHabits/LeftBar.tsx";
import {useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import RightBar from "@/pages/PageHabits/RightBar.tsx";
import HabitBoard from "@/pages/PageHabits/HabitBoard.tsx";
import CardHabitsEmpty from "./CardHabitsEmpty.tsx";
import ModalAddHabitItem from "@/components/ModalAddHabitItem.tsx";
import {useQuery} from "convex/react";
import {api} from "../../../convex/_generated/api";
import {Doc, Id} from "../../../convex/_generated/dataModel";
import {ModalAddHabitItemRef} from "@/components/ModalAddHabitItem.tsx";
import HabitItem from "@/components/HabitItem.tsx";
import HabitItemSkeleton from "@/components/HabitItemSkeleton.tsx";

const Index = () => {
    const {habitGroupId} = useParams();
    const [filteredHabits, setFilteredHabits] = useState<FilteredData>();
    const [currentHabit, setCurrentHabit] = useState<Doc<"habitItems">>();
    const habitItems = useQuery(api.habits.getHabitItems, {
        search: filteredHabits?.search,
        date: filteredHabits?.date?.valueOf(),
        order: filteredHabits?.order,
        groupId: habitGroupId as Id<"habitGroups">
    });

    useEffect(() => {
        if (habitItems?.findIndex(habit => habit._id === currentHabit?._id) !== -1) return;
        setCurrentHabit(undefined);
    }, [currentHabit?._id, habitItems]);

    const modalAddHabitIemRef = useRef<ModalAddHabitItemRef>(null);
    return (
        <>
            <div className="grid grid-cols-2 h-full">
                <section className="border-r">
                    <LeftBar
                        onFilter={setFilteredHabits}
                        onCreateHabit={() => modalAddHabitIemRef?.current?.open()}
                    />
                    <Separator/>
                    <div className="p-4 space-y-4">
                        {
                            habitItems === undefined ? (
                                Array.from({length: 4}).map((_, index) => (
                                    <HabitItemSkeleton key={index}/>
                                ))
                            ) : habitItems.length === 0 ? (
                                <CardHabitsEmpty
                                    onCreateHabit={() => modalAddHabitIemRef?.current?.open()}
                                />
                            ) : (
                                habitItems.map(habit => (
                                    <HabitItem
                                        key={habit._id}
                                        habit={habit}
                                        isActive={habit._id === currentHabit?._id}
                                        onClick={() => setCurrentHabit(habit)}
                                        onEdit={() => modalAddHabitIemRef?.current?.open(habit)}
                                    />
                                ))
                            )
                        }
                    </div>
                </section>
                {
                    currentHabit?._id && (
                        <section>
                            <RightBar currentHabit={currentHabit}/>
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