import Toolbar from "./Toolbar.tsx";
import Board from "./Board.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Doc} from "@convex/_generated/dataModel";
import {RefObject} from "react";
import {ModalAddHabitItemRef} from "@/components/ModalAddHabitItem.tsx";

type IndexProps = {
    currentHabit: Doc<"habitItems"> | null;
    modalAddHabitIemRef: RefObject<ModalAddHabitItemRef>;
}

const Index = ({currentHabit, modalAddHabitIemRef}: IndexProps) => {
    if (currentHabit === null) {
        return <div className="grid place-content-center">No habits have been selected yet!</div>;
    }
    return (
        <section>
            <Toolbar
                currentHabit={currentHabit}
                onEdit={() => modalAddHabitIemRef.current?.open({...currentHabit})}
            />
            <Separator/>
            <Board
                currentHabit={currentHabit}
            />
        </section>
    );
};

export default Index;