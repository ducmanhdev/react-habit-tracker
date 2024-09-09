import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";

const CardHabitsEmpty = () => {
    return (
        <Card className="text-center">
            <CardHeader>
                <CardTitle>Habits Empty</CardTitle>
            </CardHeader>
            <CardContent>
                <p>You don't have any habits yet. Let's create your first one!</p>
            </CardContent>
        </Card>
    );
};

export default CardHabitsEmpty