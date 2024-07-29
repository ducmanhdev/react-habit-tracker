import {useState} from "react";
import {useParams} from 'react-router-dom';
import {Separator} from "@/components/ui/separator"
import {Button} from "@/components/ui/button"
import {Search, Plus, ArrowUpDown, Pencil, Trash} from "lucide-react"
import DatePicker from "@/components/DatePicker"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {Bar, BarChart} from "recharts"

import {ChartConfig, ChartContainer} from "@/components/ui/chart"

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

import HabitItem from "@/components/HabitItem"

const PageHabits = () => {
    const {habitGroupId} = useParams();

    const orderOptions = [
        {value: "created-date", label: "Created Date"},
        {value: "reminder-date", label: "Reminder Date"},
        {value: "a-z", label: "A-Z"},
        {value: "z-a", label: "Z-A"},
    ];
    const [order, setOrder] = useState<string>(orderOptions[0].value);
    const [date, setDate] = useState<Date>();

    const handleSetDate = (newDate: Date | undefined) => {
        setDate(newDate)
    }

    const chartData = [
        {month: "January", desktop: 186, mobile: 80},
        {month: "February", desktop: 305, mobile: 200},
        {month: "March", desktop: 237, mobile: 120},
        {month: "April", desktop: 73, mobile: 190},
        {month: "May", desktop: 209, mobile: 130},
        {month: "June", desktop: 214, mobile: 140},
    ]

    return (
        <div className="grid grid-cols-2 h-full">
            <section className="border-r">
                <nav className="p-4 flex gap-2 justify-between items-center">
                    <h2>All Habits - {habitGroupId}</h2>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Search className="h-4 w-4"/>
                        </Button>
                        <DatePicker value={date} onChange={handleSetDate}/>
                        <Select value={order} onValueChange={setOrder}>
                            <SelectTrigger className="w-[180px]">
                                <ArrowUpDown className="h-4 w-4"/>
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                {orderOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button variant="outline">
                            <Plus className="h-4 w-4 mr-2"/>
                            Add new habit
                        </Button>
                    </div>
                </nav>
                <Separator/>
                <div className="p-4">
                    <Accordion type="multiple" className="w-full" defaultValue={["this-date", "this-week"]}>
                        <AccordionItem value="this-date">
                            <AccordionTrigger>1 This Week</AccordionTrigger>
                            <AccordionContent>
                                <HabitItem/>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="this-week">
                            <AccordionTrigger>5 This Week</AccordionTrigger>
                            <AccordionContent className="space-y-2">
                                {Array.from(Array(5)).map((_, index) => (
                                    <HabitItem key={index}/>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="this-month">
                            <AccordionTrigger>1 This month</AccordionTrigger>
                            <AccordionContent>
                                <HabitItem/>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="completed">
                            <AccordionTrigger>Completed</AccordionTrigger>
                            <AccordionContent>
                                <HabitItem isDone/>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </section>
            <section>
                <nav className="p-4 flex gap-2 justify-between items-center">
                    <h2>Stand up</h2>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Pencil className="h-4 w-4"/>
                        </Button>
                        <Button variant="outline">
                            <Trash className="h-4 w-4"/>
                        </Button>
                        <DatePicker value={date} onChange={handleSetDate}/>
                    </div>
                </nav>
                <Separator/>
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
            </section>
        </div>
    );
};

export default PageHabits;