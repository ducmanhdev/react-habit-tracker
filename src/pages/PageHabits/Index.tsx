import {Separator} from "@/components/ui/separator.tsx"
import LeftBar, {FilteredData} from "@/pages/PageHabits/LeftBar.tsx";
import {useParams} from "react-router-dom";
import {useState} from "react";
import RightBar from "@/pages/PageHabits/RightBar.tsx";
import HabitBoard from "@/pages/PageHabits/HabitBoard.tsx";
import HabitList from "@/pages/PageHabits/HabitList.tsx";
import {useQuery} from "convex/react";
import {api} from "../../../convex/_generated/api";
import {Doc} from "../../../convex/_generated/dataModel";

const Index = () => {
    const {habitGroupId} = useParams();
    const [filteredHabits, setFilteredHabits] = useState<FilteredData>();
    const [currentHabit, setCurrentHabit] = useState<Doc<"habitItems">>();

    const habitItems = useQuery(api.habits.getHabitItems, {
        search: filteredHabits?.search,
        date: filteredHabits?.date?.valueOf(),
        order: filteredHabits?.order,
    });

    return (
        <div className="grid grid-cols-2 h-full">
            <section className="border-r">
                <LeftBar
                    habitGroupId={habitGroupId}
                    onFilter={setFilteredHabits}
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
    );
};

export default Index;