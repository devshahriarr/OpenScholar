import { Suspense } from "react";
import FilterPanel from "@/components/dashboard/FilterPanel";
import SearchTools from "@/components/dashboard/SearchTools";
import UploadBanner from "@/components/dashboard/UploadBanner";
import PaperCardSkeleton from "@/components/landing/PaperCardSkeleton";
import ClientResultsGrid from "@/components/dashboard/ClientResultsGrid";

// Next.js 15+ searchParams is a promise
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="flex flex-1 w-full max-w-[1600px] mx-auto">
      {/* Left Sidebar */}
      <FilterPanel />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-8 bg-surface">
        <UploadBanner />
        
        <Suspense fallback={<SearchToolsFallback />}>
          <SearchTools />
        </Suspense>

        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Discovery</h1>
            <p className="text-sm text-text-secondary">Explore the latest research and thesis from our community</p>
          </div>

          <Suspense fallback={<ResultsGridSkeleton />} key={JSON.stringify(await searchParams)}>
            <ResultsGrid searchParamsPromise={searchParams} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

function SearchToolsFallback() {
  return <div className="h-[72px] rounded-xl border border-border bg-background animate-pulse" />;
}

function ResultsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <PaperCardSkeleton key={i} />
      ))}
    </div>
  );
}

async function ResultsGrid({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const paramsObj = await searchParamsPromise;
  
  // Convert object to URLSearchParams
  const params = new URLSearchParams();
  Object.entries(paramsObj).forEach(([key, value]) => {
    if (typeof value === "string") {
      params.set(key, value);
    } else if (Array.isArray(value)) {
      value.forEach(v => params.append(key, v));
    }
  });

  return <ClientResultsGrid searchParamsStr={params.toString()} />;
}

