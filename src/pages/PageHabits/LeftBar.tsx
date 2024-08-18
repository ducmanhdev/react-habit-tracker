import {useEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {ArrowUpDown, Calendar, Plus, Search} from "lucide-react";
import DatePicker from "@/components/DatePicker.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useDebounce} from "@uidotdev/usehooks";

export type FilteredData = {
    search: string | undefined;
    order: string;
    date: Date | undefined;
}

type PageHabitsLeftBarProps = {
    habitGroupId: string | undefined;
    onFilter: (filteredData: FilteredData) => void;
}

const LeftBar = ({habitGroupId, onFilter}: PageHabitsLeftBarProps) => {
    const orderOptions = [
        {value: "created-date", label: "Created Date"},
        {value: "reminder-date", label: "Reminder Date"},
        {value: "a-z", label: "A-Z"},
        {value: "z-a", label: "Z-A"},
    ];
    const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const handleSearchBarBlur = () => {
        if (!search.trim()) {
            setIsSearchBarVisible(false);
        }
    }
    useEffect(() => {
        if (isSearchBarVisible && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isSearchBarVisible]);

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);
    const [order, setOrder] = useState(orderOptions[0].value);
    const [date, setDate] = useState<Date>();
    useEffect(() => {
        onFilter({search, order, date});
    }, [debouncedSearch, order, date]);

    return (
        <nav className="p-4 flex gap-2 justify-between items-center">
            <h2>All Habits</h2>
            <div className="flex gap-2">
                {
                    isSearchBarVisible ?
                        <Input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            ref={inputRef}
                            onChange={(e) => setSearch(e.target.value)}
                            onBlur={handleSearchBarBlur}
                        /> :
                        <Button
                            variant="outline"
                            onClick={() => setIsSearchBarVisible(true)}
                        >
                            <Search/>
                        </Button>
                }
                {
                    isSearchBarVisible ?
                        <Button
                            variant="outline"
                            onClick={() => setIsSearchBarVisible(false)}
                        >
                            <Calendar />
                        </Button> :
                        <DatePicker value={date} onChange={setDate}/>
                }
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
                <Button variant="default">
                    <Plus/>
                    Add new habit
                </Button>
            </div>
        </nav>
    )
}

export default LeftBar