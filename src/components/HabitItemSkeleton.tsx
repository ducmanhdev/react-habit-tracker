import {Skeleton} from "@/components/ui/skeleton.tsx";

const HabitItemSkeleton = () => {
    return (
        <div className="flex items-center gap-4 border rounded p-4">
            <Skeleton className="w-10 h-10 rounded flex-shrink-0"/>
            <div className="flex-grow space-y-2">
                <Skeleton className="h-4"/>
                <Skeleton className="h-4 "/>
            </div>
            <div className="flex gap-2 flex-shrink-0">
                <Skeleton className="w-9 h-9 rounded"/>
                <Skeleton className="w-9 h-9 rounded"/>
            </div>
        </div>
    )
}

export default HabitItemSkeleton