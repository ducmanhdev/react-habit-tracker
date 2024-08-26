import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";

type CardHabitsEmptyProps = {
    onCreateHabit: () => void;
}
const CardHabitsEmpty = ({onCreateHabit}: CardHabitsEmptyProps) => {
    return (
        <Card className="text-center">
            <CardHeader>
                <CardTitle>Habits Empty</CardTitle>
            </CardHeader>
            <CardContent>
                <p>You don't have any habits yet. Let's create your first one!</p>
            </CardContent>
            <CardFooter className="justify-center">
                <Button onClick={onCreateHabit}>
                    Create Habit
                </Button>
            </CardFooter>
        </Card>
    );
};

export default CardHabitsEmpty