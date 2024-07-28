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

interface HabitItemProps {
    isDone?: boolean
}

const HabitItem = ({isDone = false}: HabitItemProps) => {
    return (
        <div className="p-2 border rounded flex gap-4 items-center">
            <div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="icon">
                            <ArrowUpDown className="h-4 w-4"/>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit">
                        <div className="grid grid-cols-4 gap-2">
                            {Array.from(Array(10)).map((_, index) => (
                                <Button key={index} size="icon" variant="outline">
                                    <ArrowUpDown className="h-4 w-4"/>
                                </Button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex-grow">
                <p className={`mb-1 ${isDone ? 'line-through' : ''}`}>Stand up</p>
                <p className={`text-muted-foreground ${isDone ? 'line-through' : ''}`}>0 / 4 times</p>
            </div>
            <div className="flex gap-2">
                <Button size="sm" variant="secondary">
                    <Plus className="h-4 w-4 mr-2"/>
                    1
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="sm" className="w-full">
                            <EllipsisVertical className="w-4 h-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>
                            <Button variant="ghost" size="sm" className="w-full justify-start">
                                <Check className="w-4 h-4 mr-2"/>
                                Check-in
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Button variant="ghost" size="sm" className="w-full justify-start">
                                <SkipForward className="w-4 h-4 mr-2"/>
                                Skip
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Button variant="ghost" size="sm" className="w-full justify-start">
                                <X className="w-4 h-4 mr-2"/>
                                Fail
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Button variant="ghost" size="sm" className="w-full justify-start">
                                <Pencil className="w-4 h-4 mr-2"/>
                                Edit
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Button variant="ghost" size="sm" className="w-full justify-start">
                                <ChartNoAxesColumn className="w-4 h-4 mr-2"/>
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