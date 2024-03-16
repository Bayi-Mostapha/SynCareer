import { Skeleton } from "@/components/ui/skeleton"

function ResumesSkeleton() {
    return (
        <>
            <Skeleton className="ml-auto w-[130px] h-[40px] rounded-md" />
            <div className="my-5 grid grid-cols-4 gap-3">
                <Skeleton className=" col-span-1 h-[300px] rounded-md" />
                <Skeleton className=" col-span-1 h-[300px] rounded-md" />
                <Skeleton className=" col-span-1 h-[300px] rounded-md" />
                <Skeleton className=" col-span-1 h-[300px] rounded-md" />
            </div>
        </>
    );
}

export default ResumesSkeleton;