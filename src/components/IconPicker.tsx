import {useState, useEffect} from "react";
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

type IconName = keyof typeof icons;

const IconPicker = () => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [selectedIconName, setSelectedIconName] = useState<IconName>("Trash");

    const [search, setSearch] = useState("");
    const [iconsDisplayed, setIconsDisplayed] = useState<LucideIcon[]>([]);
    const [limit, setLimit] = useState(50);

    const iconNames = Object.keys(icons) as IconName[];

    const filteredIcons = iconNames
        .filter((name) => name.toLowerCase().includes(search.toLowerCase()))
        .map(name => icons[name]);

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
        setSelectedIconName(iconName as IconName);
        setPopoverOpen(false)
    }

    const SelectedIcon = icons[selectedIconName];
    return (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline">
                    <SelectedIcon/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 space-y-4">
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
