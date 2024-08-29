import {useState} from "react";
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

type Option = { label: string; value: string };

type ComboBoxPropsBase = {
    options: Option[];
    buttonClassName?: string;
};

type ComboboxPropsSingle = ComboBoxPropsBase & {
    value: string | undefined;
    onChange: (value: string | undefined) => void;
    multiple?: false;
};

type ComboboxPropsMultiple = ComboBoxPropsBase & {
    value: string[];
    onChange: (value: string[]) => void;
    multiple: true;
};

type ComboboxProps = ComboboxPropsSingle | ComboboxPropsMultiple;

export const Combobox = ({
                             options,
                             value,
                             onChange,
                             buttonClassName,
                             multiple = false,
                         }: ComboboxProps) => {
    const [open, setOpen] = useState(false);

    const handleSelect = (currentValue: string) => {
        if (multiple) {
            const selectedValues = value as string[];
            const newValue = selectedValues.includes(currentValue)
                ? selectedValues.filter(item => item !== currentValue)
                : [...selectedValues, currentValue];
            (onChange as ComboboxPropsMultiple["onChange"])(newValue);
        } else {
            const selectedValue = value as string;
            const newValue = currentValue === selectedValue ? undefined : currentValue;
            (onChange as ComboboxPropsSingle["onChange"])(newValue);
            setOpen(false);
        }
    };

    const renderButtonLabel = () => {
        if (multiple) {
            const selectedValues = value as string[];
            if (selectedValues.length === 0) return "Select...";
            return selectedValues.length === 1
                ? options.find(option => option.value === selectedValues[0])?.label
                : `${selectedValues.length} selected`;
        } else {
            const selectedOption = options.find(option => option.value === value);
            return selectedOption ? selectedOption.label : "Select...";
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("justify-between", buttonClassName)}
                >
                    {renderButtonLabel()}
                    <ChevronsUpDown className="opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="popover-fw p-0">
                <Command>
                    <CommandInput placeholder="Search..."/>
                    <CommandList>
                        <CommandEmpty>No options found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={() => handleSelect(option.value)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === option.value ? "opacity-100" : "opacity-0"
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

export default Combobox
