import {Plus, ArrowUpDown, EllipsisVertical, SkipForward, X, Pencil, Check, ChartNoAxesColumn} from "lucide-react"

import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

type HabitItemProps = {
    isComplete?: boolean,
    isActive?: boolean,
    onClick: () => void
}

const HabitItem = ({isComplete = false, isActive = false, onClick}: HabitItemProps) => {
    return (
        <div
            className={`p-2 border rounded flex gap-4 items-center cursor-pointer ${isActive && "border-primary"}`}
            onClick={onClick}
        >
            <div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="icon">
                            <ArrowUpDown />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit">
                        <div className="grid grid-cols-4 gap-2">
                            {Array.from(Array(10)).map((_, index) => (
                                <Button key={index} size="icon" variant="outline">
                                    <ArrowUpDown />
                                </Button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex-grow">
                <p className={`mb-1 ${isComplete ? 'line-through' : ''}`}>Stand up</p>
                <p className={`text-muted-foreground ${isComplete ? 'line-through' : ''}`}>0 / 4 times</p>
            </div>
            <div className="flex gap-2">
                <Button size="sm" variant="secondary">
                    <Plus />
                    1
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="sm" className="w-full">
                            <EllipsisVertical />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>
                            <Button variant="ghost" size="sm" className="w-full justify-start">
                                <Check />
                                Check-in
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Button variant="ghost" size="sm" className="w-full justify-start">
                                <SkipForward />
                                Skip
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Button variant="ghost" size="sm" className="w-full justify-start">
                                <X />
                                Fail
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Button variant="ghost" size="sm" className="w-full justify-start">
                                <Pencil />
                                Edit
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Button variant="ghost" size="sm" className="w-full justify-start">
                                <ChartNoAxesColumn />
                                View Progress
                            </Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default HabitItem;