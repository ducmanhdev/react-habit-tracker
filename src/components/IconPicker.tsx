import {useState, useEffect, useMemo} from "react";
import {Button} from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Input} from "@/components/ui/input.tsx";
import {icons, LucideIcon} from "lucide-react";
import {useInView} from "react-intersection-observer";

export type IconName = keyof typeof icons;

type IconPickerProps = {
    currentIcon?: IconName;
    onIconSelect?: (iconName: IconName) => void;
}

const iconNames = Object.keys(icons) as IconName[];

const IconPicker = ({currentIcon, onIconSelect}: IconPickerProps) => {
    currentIcon = currentIcon || "CircleAlert";

    const [popoverOpen, setPopoverOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [iconsDisplayed, setIconsDisplayed] = useState<LucideIcon[]>([]);
    const [limit, setLimit] = useState(50);

    const filteredIcons = useMemo(() => {
        return iconNames
            .filter((name) => name.toLowerCase().includes(search.toLowerCase()))
            .map(name => icons[name]);
    }, [search]);

    const loadMoreIcons = () => {
        const nextLimit = limit + 50;
        setIconsDisplayed(filteredIcons.slice(0, nextLimit));
        setLimit(nextLimit);
    };

    const {ref} = useInView({
        threshold: 0,
        onChange: (inView) => {
            if (inView && iconsDisplayed.length < filteredIcons.length) {
                loadMoreIcons();
            }
        },
    });

    useEffect(() => {
        setIconsDisplayed(filteredIcons.slice(0, limit));
    }, [search, limit]);

    const handleSelect = (iconName: string) => {
        if (onIconSelect) {
            onIconSelect(iconName as IconName);
        }
        setPopoverOpen(false);
    }

    const SelectedIcon = icons[currentIcon];
    return (
        <Popover modal open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full">
                    <SelectedIcon/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="popover-fw min-w-72 space-y-4">
                <Input
                    placeholder="Search icon name..."
                    onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
                />
                <ScrollArea className="h-72">
                    <div className="grid grid-cols-5 gap-2">
                        {iconsDisplayed.map((Icon, index) => (
                            <div
                                key={index}
                                className="border rounded p-2 flex justify-center items-center cursor-pointer hover:bg-white hover:text-black"
                                onClick={() => handleSelect(Icon.displayName!)}
                            >
                                <Icon
                                    width={20}
                                    height={20}
                                />
                            </div>
                        ))}
                        <div ref={ref}/>
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
};

export default IconPicker;
