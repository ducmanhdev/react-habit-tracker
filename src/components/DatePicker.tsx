import {useState} from "react"
import {addDays, format} from "date-fns"
import {Calendar as CalendarIcon, CircleX} from "lucide-react"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type DatePickerProps = {
    value?: Date;
    onChange: (date: Date | undefined) => void;
    buttonClasses?: string;
}

const DatePicker = ({value, onChange, buttonClasses}: DatePickerProps) => {
    const [open, setOpen] = useState(false);
    const handleOnChange = (date: Parameters<typeof onChange>[number]) => {
        onChange(date);
        setOpen(false);
    }
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !value && "text-muted-foreground",
                        buttonClasses
                    )}
                >
                    <CalendarIcon />
                    {value ? format(value, "PPP") : <span>Pick a date</span>}
                    {value && (
                        <CircleX
                            className="ml-auto"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleOnChange(undefined);
                            }}
                        />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                <Select
                    onValueChange={(value) =>
                        handleOnChange(addDays(new Date(), parseInt(value)))
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select"/>
                    </SelectTrigger>
                    <SelectContent position="popper">
                        <SelectItem value="0">Today</SelectItem>
                        <SelectItem value="1">Tomorrow</SelectItem>
                        <SelectItem value="3">In 3 days</SelectItem>
                        <SelectItem value="7">In a week</SelectItem>
                    </SelectContent>
                </Select>
                <div className="rounded-md border">
                    <Calendar mode="single" selected={value} onSelect={handleOnChange}/>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default DatePicker
