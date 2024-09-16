import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Doc} from "@convex/_generated/dataModel";
import {Flame} from "lucide-react";

type HabitBoardProps = {
    currentHabit: Doc<"habitItems">
}

const Board = ({currentHabit}: HabitBoardProps) => {
    return (
        <div className="p-4 grid grid-cols-2 content-start gap-4">
            <Card className="col-span-full">
                <CardHeader>
                    <CardDescription className="flex items-center gap-2 mb-2">
                        <Flame className="text-red-600"/>
                        Current streak
                    </CardDescription>
                    <CardTitle>
                        {currentHabit.streak} days
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardDescription>Completed</CardDescription>
                    <CardTitle>0 days</CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardDescription>Failed</CardDescription>
                    <CardTitle>0 days</CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardDescription>Total</CardDescription>
                    <CardTitle>0 {currentHabit.goal.unit}</CardTitle>
                </CardHeader>
            </Card>
        </div>
    )
}

export default Board