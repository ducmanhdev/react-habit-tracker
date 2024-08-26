import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";

type CardHabitsEmptyProps = {
    onCreateHabit: () => void;
}
const CardHabitsEmpty = ({ onCreateHabit }: CardHabitsEmptyProps) => {
    return (
        <div className="p-4">
            <Card className="w-full max-w-sm mx-auto">
                <CardHeader>
                    <CardTitle>Habits Empty</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>You don't have any habits yet. Let's create your first one!</p>
                </CardContent>
                <CardFooter>
                    <Button onClick={onCreateHabit} className="w-full">
                        Create Habit
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default CardHabitsEmpty