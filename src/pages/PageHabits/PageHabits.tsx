import {Separator} from "@/components/ui/separator.tsx"
import LeftBar, {IFilteredData} from "@/pages/PageHabits/LeftBar.tsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import RightBar from "@/pages/PageHabits/RightBar.tsx";
import HabitBoard from "@/pages/PageHabits/HabitBoard.tsx";
import HabitList from "@/pages/PageHabits/HabitList.tsx";
import {IHabitItem} from "@/types/habits"

const PageHabits = () => {
    const {habitGroupId} = useParams();
    const [filteredHabits, setFilteredHabits] = useState<IFilteredData>();
    const [habits, setHabits] = useState<IHabitItem[]>([]);
    const handleGetListHabits = () => {
        const list = [
            {
                id: 1,
                title: "Drink 8 glasses of water",
                dueDate: "2024-08-03",
                completed: true,
                groupId: 1,
            },
            {
                id: 2,
                title: "Drink 8 glasses of water",
                dueDate: "2024-08-03",
                completed: false,
                groupId: 1,
            },
            {
                id: 3,
                title: "Exercise for 30 minutes",
                dueDate: "2024-08-04",
                completed: false,
                groupId: 2,
            },
            {
                id: 4,
                title: "Read 10 pages of a book",
                dueDate: "2024-08-08",
                completed: false,
                groupId: 2,
            },
            {
                id: 5,
                title: "Meditate for 15 minutes",
                dueDate: "2024-08-15",
                completed: false,
                groupId: 2,
            },
        ].filter(item => habitGroupId ? item.groupId === Number(habitGroupId) : true)
        setHabits(list);
    }
    useEffect(() => {
        handleGetListHabits()
    }, [
        habitGroupId,
        filteredHabits?.search,
        filteredHabits?.order,
        filteredHabits?.date,
    ]);

    const [currentHabit, setCurrentHabit] = useState<IHabitItem>();

    return (
        <div className="grid grid-cols-2 h-full">
            <section className="border-r">
                <LeftBar
                    habitGroupId={habitGroupId}
                    onFilter={setFilteredHabits}
                />
                <Separator/>
                <HabitList
                    items={habits}
                    currentHabitId={currentHabit?.id}
                    onSelectHabit={setCurrentHabit}
                />
            </section>
            {
                currentHabit?.id && (
                    <section>
                        <RightBar
                            currentHabit={currentHabit}
                        />
                        <Separator/>
                        <HabitBoard
                            currentHabit={currentHabit}
                        />
                    </section>
                )
            }
        </div>
    );
};

export default PageHabits;