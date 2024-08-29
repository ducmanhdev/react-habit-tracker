import {useState, useMemo} from "react";
import {Check, ChevronsUpDown} from "lucide-react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

type Option<T> = { label: string; value: T };

type ComboBoxPropsBase<T> = {
    options: Option<T>[];
    buttonClassName?: string;
    placeholder?: string;
};

type ComboboxPropsSingle<T> = ComboBoxPropsBase<T> & {
    value: T;
    onChange: (value: T) => void;
    multiple?: false;
};

type ComboboxPropsMultiple<T> = ComboBoxPropsBase<T> & {
    value: T[];
    onChange: (value: T[]) => void;
    multiple: true;
};

type ComboboxProps<T> = ComboboxPropsSingle<T> | ComboboxPropsMultiple<T>;

export const Combobox = <T,>({
                                 options,
                                 value,
                                 onChange,
                                 buttonClassName,
                                 placeholder = "Select...",
                                 multiple,
                             }: ComboboxProps<T>) => {
    const [open, setOpen] = useState(false);

    // Helper to handle selection logic
    const handleSelect = (currentValue: T) => {
        if (multiple) {
            const selectedValues = value as T[];
            const isSelected = selectedValues.includes(currentValue);
            const newValue = isSelected
                ? selectedValues.filter(item => item !== currentValue)
                : [...selectedValues, currentValue];
            onChange(newValue);
        } else {
            onChange(currentValue);
            setOpen(false);
        }
    };

    const buttonLabel = useMemo(() => {
        if (multiple) {
            const selectedValues = value as T[];
            if (selectedValues.length === 0) return placeholder;
            if (selectedValues.length === 1)
                return options.find(option => option.value === selectedValues[0])?.label || placeholder;
            return `${selectedValues.length} selected`;
        } else {
            const selectedOption = options.find(option => option.value === value);
            return selectedOption ? selectedOption.label : placeholder;
        }
    }, [value, options, multiple, placeholder]);

    const isOptionSelected = (optionValue: T): boolean => {
        return multiple ? (value as T[]).includes(optionValue) : value === optionValue;
    };

    return (
        <Popover open={open} onOpenChange={setOpen} modal>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("justify-between", buttonClassName)}
                >
                    {buttonLabel}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="popover-fw p-0">
                <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandList>
                        <CommandEmpty>No options found.</CommandEmpty>
                        <CommandGroup>
                            {options.map(option => (
                                <CommandItem
                                    key={String(option.value)}
                                    value={String(option.value)}
                                    onSelect={() => handleSelect(option.value)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            isOptionSelected(option.value) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default Combobox;
