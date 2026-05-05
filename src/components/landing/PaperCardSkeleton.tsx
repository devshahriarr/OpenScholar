import { Skeleton } from "@/components/ui/Loader";

export default function PaperCardSkeleton() {
  return (
    <div className="flex flex-col rounded-lg border border-border bg-background shadow-card overflow-hidden">
      {/* Header skeleton */}
      <div className="bg-primary/20 px-4 py-4 min-h-[90px] space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
      </div>
      {/* Body skeleton */}
      <div className="p-4 space-y-3 flex-1">
        <Skeleton className="h-5 w-24 rounded-sm" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-7 rounded-full" />
          <div className="space-y-1 flex-1">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-2 w-20" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
        <div className="flex gap-1.5">
          <Skeleton className="h-4 w-8 rounded" />
          <Skeleton className="h-4 w-14 rounded" />
          <Skeleton className="h-4 w-10 rounded" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-3 w-16 ml-auto" />
        </div>
        <Skeleton className="h-8 w-full rounded-md" />
      </div>
    </div>
  );
}
