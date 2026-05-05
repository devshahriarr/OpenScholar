"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";

const CATEGORIES = [
  { id: "1", label: "Science & Technology" },
  { id: "2", label: "Arts & Humanities" },
  { id: "3", label: "Business & Economics" },
  { id: "4", label: "Health & Medicine" },
];

export default function FilterPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");

  function handleCategoryClick(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (currentCategoryId === id) {
      params.delete("categoryId"); // toggle off
    } else {
      params.set("categoryId", id);
      params.set("page", "1"); // reset to page 1 on filter change
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <aside className="hidden md:block w-64 flex-shrink-0 border-r border-border bg-background py-6">
      <div className="px-4 mb-4 flex items-center gap-2 text-xs font-bold tracking-wider text-text-primary uppercase">
        <BookOpen className="h-4 w-4" />
        Browse By Category
      </div>

      <nav className="flex flex-col gap-1 mt-4">
        {CATEGORIES.map((category) => {
          const isActive = currentCategoryId === category.id;
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={cn(
                "flex items-center w-full px-4 py-2.5 text-sm font-semibold transition-colors text-left",
                isActive
                  ? "text-text-primary bg-surface border-l-4 border-primary pl-3" // pl-3 to compensate for 4px border (px-4 = 16px. 16 - 4 = 12px = pl-3)
                  : "text-text-secondary hover:text-text-primary hover:bg-surface border-l-4 border-transparent pl-3"
              )}
            >
              {category.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
