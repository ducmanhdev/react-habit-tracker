import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Pencil, Trash} from "lucide-react";
import DatePicker from "@/components/DatePicker.tsx";
import {Doc} from "../../../convex/_generated/dataModel";

type RightBarProps = {
    currentHabit: Doc<"habitItems">
}

const RightBar = ({currentHabit}: RightBarProps) => {
    const [date, setDate] = useState<Date>();

    return (
        <nav className="p-4 flex gap-2 justify-between items-center">
            <h2>{currentHabit.name}</h2>
            <div className="flex gap-2">
                <Button variant="outline">
                    <Pencil />
                </Button>
                <Button variant="outline">
                    <Trash />
                </Button>
                <DatePicker value={date} onChange={setDate}/>
            </div>
        </nav>
    )
}

export default RightBar