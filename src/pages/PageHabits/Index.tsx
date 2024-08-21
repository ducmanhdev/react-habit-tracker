import {Separator} from "@/components/ui/separator.tsx"
import LeftBar, {FilteredData} from "@/pages/PageHabits/LeftBar.tsx";
import {useParams} from "react-router-dom";
import {useRef, useState} from "react";
import RightBar from "@/pages/PageHabits/RightBar.tsx";
import HabitBoard from "@/pages/PageHabits/HabitBoard.tsx";
import HabitList from "@/pages/PageHabits/HabitList.tsx";
import ModalAddHabitItem from "@/components/ModalAddHabitItem.tsx";
import {useQuery} from "convex/react";
import {api} from "../../../convex/_generated/api";
import {Doc, Id} from "../../../convex/_generated/dataModel";
import {ModalAddHabitItemRef} from "@/components/ModalAddHabitItem.tsx";

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
                    <HabitList
                        items={habitItems || []}
                        currentHabitId={currentHabit?._id}
                        onSelectHabit={setCurrentHabit}
                    />
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