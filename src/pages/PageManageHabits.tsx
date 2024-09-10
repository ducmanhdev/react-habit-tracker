import MenuItem from "@/components/MenuItem.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Archive, Trash2, FolderOpenDot} from "lucide-react";
import {useMatch, useNavigate} from "react-router-dom";
import {useQuery} from "convex/react";
import {api} from "@convex/_generated/api";
import HabitItemSkeleton from "@/components/HabitItemSkeleton.tsx";
import CardHabitsEmpty from "@/components/CardHabitsEmpty.tsx";
import HabitItem from "@/components/HabitItem.tsx";
import {useEffect, useMemo} from "react";

const PARENT_PATH = "/manage-habits";
const USE_MATH_PATTERN = `${PARENT_PATH}/:category?`;
const MENU = [
    {
        label: "Active",
        icon: <FolderOpenDot/>,
        category: "active",
    },
    {
        label: "Archived",
        icon: <Archive/>,
        category: "archived",
    },
    {
        label: "Deleted",
        icon: <Trash2/>,
        category: "deleted",
    }
]

const PageManageHabits = () => {
    const match = useMatch(USE_MATH_PATTERN);
    const category = match?.params?.category;
    const navigate = useNavigate();
    const habitItems = useQuery(api.habitItems.getItems, {
        includeArchived: true,
        includeDeleted: true,
    });
    const habitItemsFiltered = useMemo(() => {
        if (!habitItems) return [];
        return habitItems.filter(habit => {
            if (category === "deleted") return habit.isDeleted;
            if (category === "archived") return habit.isArchived;
            return !habit.isArchived && !habit.isDeleted;
        });
    }, [habitItems, category]);

    useEffect(() => {
        if (!category) {
            navigate(`${PARENT_PATH}/${MENU[0].category}`, {replace: true});
        }
    }, [category, navigate]);

    return (
        <div className="grid grid-cols-[300px_1fr] h-full">
            <aside className="border-r flex flex-col">
                <div className="p-4">
                    <h2>Manage habits</h2>
                </div>
                <Separator/>
                <div className="p-4 flex-grow text-muted-foreground space-y-1">
                    {
                        MENU.map(item => (
                            <MenuItem
                                key={item.label}
                                route={`${PARENT_PATH}/${item.category}`}
                                icon={item.icon}
                                label={item.label}
                                isActive={category === item.category}
                            />
                        ))
                    }
                </div>
            </aside>
            <section>
                <div className="p-4">
                    <h2>Habits</h2>
                </div>
                <Separator/>
                <div className="p-4 space-y-4">
                    {
                        habitItemsFiltered === undefined ? (
                            Array.from({length: 4}).map((_, index) => (
                                <HabitItemSkeleton key={index}/>
                            ))
                        ) : habitItemsFiltered?.length === 0 ? (
                            <CardHabitsEmpty/>
                        ) : (
                            habitItemsFiltered?.map(habit => (
                                <HabitItem
                                    key={habit._id}
                                    habit={habit}
                                    isMinimalist
                                />
                            ))
                        )
                    }
                </div>
            </section>
        </div>
    );
};

export default PageManageHabits;