import Toolbar from "./Toolbar.tsx";
import Board from "./Board.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Doc} from "@convex/_generated/dataModel";

type DashboardProps = {
    currentHabit: Doc<"habitItems">;
    onEdit: () => void;
}

const Dashboard = ({currentHabit, onEdit}: DashboardProps) => {
    return (
        <section>
            <Toolbar
                currentHabit={currentHabit}
                onEdit={onEdit}
            />
            <Separator/>
            <Board currentHabit={currentHabit}/>
        </section>
    );
};

export default Dashboard;