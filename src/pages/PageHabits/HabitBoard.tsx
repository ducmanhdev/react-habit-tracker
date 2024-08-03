import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {ChartConfig, ChartContainer} from "@/components/ui/chart.tsx";
import {Bar, BarChart} from "recharts";
import {IHabitItem} from "@/types/habits.ts";

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#2563eb",
    },
    mobile: {
        label: "Mobile",
        color: "#60a5fa",
    },
} satisfies ChartConfig

interface HabitBoardProps {
    currentHabit: IHabitItem
}

const HabitBoard = ({currentHabit}: HabitBoardProps) => {
    console.log(currentHabit.id)
    const chartData = [
        {month: "January", desktop: 186, mobile: 80},
        {month: "February", desktop: 305, mobile: 200},
        {month: "March", desktop: 237, mobile: 120},
        {month: "April", desktop: 73, mobile: 190},
        {month: "May", desktop: 209, mobile: 130},
        {month: "June", desktop: 214, mobile: 140},
    ]
    return (
        <div className="p-4 grid grid-cols-2 content-start gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Create project</CardTitle>
                    <CardDescription>Deploy your new project in one-click.</CardDescription>
                </CardHeader>
                <CardContent>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem corporis ex pariatur porro
                    quas repellat. Alias aliquam animi aperiam consectetur corporis culpa doloribus enim eos
                    explicabo ipsam molestiae nam necessitatibus odio officia possimus provident quos,
                    reiciendis vero? At beatae blanditiis consequuntur deserunt dignissimos, ex fuga, fugit
                    laudantium optio quisquam, velit?
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Create project</CardTitle>
                    <CardDescription>Deploy your new project in one-click.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                        <BarChart accessibilityLayer data={chartData}>
                            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4}/>
                            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4}/>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Create project</CardTitle>
                    <CardDescription>Deploy your new project in one-click.</CardDescription>
                </CardHeader>
                <CardContent>

                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Create project</CardTitle>
                    <CardDescription>Deploy your new project in one-click.</CardDescription>
                </CardHeader>
                <CardContent>

                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Create project</CardTitle>
                    <CardDescription>Deploy your new project in one-click.</CardDescription>
                </CardHeader>
                <CardContent>

                </CardContent>
            </Card>
        </div>
    )
}

export default HabitBoard