import {useEffect, useRef, useState, useDeferredValue} from "react";
import {Button} from "@/components/ui/button.tsx";
import {ArrowUpDown, Calendar, Plus, Search} from "lucide-react";
import DatePicker from "@/components/DatePicker.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Input} from "@/components/ui/input.tsx";
import dayjs from "dayjs";
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
    console.log(habitGroupId)
    const orderOptions = [
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
    const deferredSearch = useDeferredValue(search);
    const [order, setOrder] = useState(orderOptions[0].value);
    const [date, setDate] = useState<Date>();
    useEffect(() => {
        onFilter({
            search: deferredSearch,
            order,
            date
        });
    }, [deferredSearch, order, date, onFilter]);

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
                            className="w-[190px]"
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
                            <Calendar/>
                        </Button> :
                        <DatePicker value={date} onChange={setDate} buttonClasses="w-[190px]"/>
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
                <Button variant="default" size="icon">
                    <Plus/>
                </Button>
            </div>
        </nav>
    )
}

export default LeftBar