import {useRef, useState} from "react";
import ModalAddHabitItem, {ModalAddHabitItemRef} from "@/components/ModalAddHabitItem.tsx";
import Left from "./Left/Index.tsx";
import Right from "./Right/Index.tsx";
import {Doc} from "@convex/_generated/dataModel";

const Index = () => {
    const modalAddHabitIemRef = useRef<ModalAddHabitItemRef>(null);
    const [currentHabit, setCurrentHabit] = useState<Doc<"habitItems"> | null>(null);

    return (
        <>
            <div className="grid grid-cols-2 h-full">
                <Left
                    onCreate={groupId => modalAddHabitIemRef?.current?.open({groupId})}
                    onEdit={habit => modalAddHabitIemRef?.current?.open(habit)}
                    currentHabit={currentHabit}
                    setCurrentHabit={setCurrentHabit}
                />
                {
                    currentHabit && <Right
                        currentHabit={currentHabit}
                        onEdit={() => modalAddHabitIemRef?.current?.open(currentHabit)}
                    />
                }
            </div>
            <ModalAddHabitItem ref={modalAddHabitIemRef}/>
        </>
    );
};

export default Index;