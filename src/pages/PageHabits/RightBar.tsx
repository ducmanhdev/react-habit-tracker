import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Pencil, Trash} from "lucide-react";
import DatePicker from "@/components/DatePicker.tsx";
import {Habit} from "@/types/habits.ts";

interface IRightBar {
    currentHabit: Habit
}

const RightBar = ({currentHabit}: IRightBar) => {
    const [date, setDate] = useState<Date>();

    return (
        <nav className="p-4 flex gap-2 justify-between items-center">
            <h2>{currentHabit.title}</h2>
            <div className="flex gap-2">
                <Button variant="outline">
                    <Pencil className="h-4 w-4"/>
                </Button>
                <Button variant="outline">
                    <Trash className="h-4 w-4"/>
                </Button>
                <DatePicker value={date} onChange={setDate}/>
            </div>
        </nav>
    )
}

export default RightBar