import Left from "./Left/Index.tsx";
import Right from "./Right/Index.tsx";
import {useParams} from "react-router-dom";
import {useRef, useState} from "react";
import ModalAddHabitItem, {ModalAddHabitItemRef} from "@/components/ModalAddHabitItem.tsx";
import {Doc, Id} from "@convex/_generated/dataModel";

const Index = () => {
    const {habitGroupId} = useParams();
    const [currentHabit, setCurrentHabit] = useState<Doc<"habitItems"> | null>(null);
    const modalAddHabitIemRef = useRef<ModalAddHabitItemRef>(null);
    return <>
        <div className="grid grid-cols-2 h-full">
            <Left
                currentGroupId={habitGroupId as Id<"habitGroups">}
                setCurrentHabit={setCurrentHabit}
                modalAddHabitIemRef={modalAddHabitIemRef}
            />
            <Right
                currentHabit={currentHabit}
                modalAddHabitIemRef={modalAddHabitIemRef}
            />
        </div>
        <ModalAddHabitItem ref={modalAddHabitIemRef}/>
    </>
};

export default Index;