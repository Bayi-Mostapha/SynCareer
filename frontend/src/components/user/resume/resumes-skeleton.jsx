import { Skeleton } from "@/components/ui/skeleton"

function ResumesSkeleton() {
    return (
        <>
            <Skeleton className="ml-auto w-[130px] h-[40px] rounded-md" />
            <div className="my-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                <Skeleton className=" col-span-1 h-[300px] rounded-md" />
                <Skeleton className=" col-span-1 h-[300px] rounded-md" />
                <Skeleton className=" col-span-1 h-[300px] rounded-md" />
                <Skeleton className=" col-span-1 h-[300px] rounded-md" />
                <Skeleton className=" col-span-1 h-[300px] rounded-md" />
            </div>
        </>
    );
}

export default ResumesSkeleton;