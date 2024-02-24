import { Skeleton } from "@/components/ui/skeleton";

export default function MessageSkeleton() {
  return (
    <div className="flex flex-col space-y-12">
      <div className="flex-col flex space-y-2">
        <Skeleton className="h-3 bg-zinc-700 w-full" />
        <Skeleton className="h-3 bg-zinc-700 w-full" />
        <Skeleton className="h-3 bg-zinc-700 w-full" />
        <Skeleton className="h-3 bg-zinc-700 w-full" />
      </div>
      <div className="flex flex-col space-y-2">
        <Skeleton className="h-3 bg-zinc-700 w-full" />
        <Skeleton className="h-3 bg-zinc-700 w-full" />
        <Skeleton className="h-3 bg-zinc-700 w-[50%]" />
        <Skeleton className="h-3 bg-zinc-700 w-[50%]" />
      </div>
      <div className="flex space-x-2">
        <Skeleton className="flex-1 bg-zinc-700 h-20" />
        <Skeleton className="flex-1 bg-zinc-700 h-20" />
        <Skeleton className="flex-1 bg-zinc-700 h-20" />
      </div>
    </div>
  );
}
