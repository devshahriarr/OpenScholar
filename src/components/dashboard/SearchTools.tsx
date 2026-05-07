"use client";

import { useCallback, useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

const YEAR_OPTIONS = ["2026", "2025", "2024", "2023", "2022"];

export default function SearchTools() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  
  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  // Local state for debounced search
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");

  // Debounce search term changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm) {
        params.set("q", searchTerm);
      } else {
        params.delete("q");
      }
      params.set("page", "1");
      // Only push if the q param actually changed
      if (searchParams.get("q") !== searchTerm && (searchParams.get("q") !== null || searchTerm !== "")) {
        router.push(`${pathname}?${params.toString()}`);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, searchParams, pathname, router]);

  const handleSelectChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    setSearchTerm("");
    router.push(pathname);
  };

  const hasFilters = searchParams.toString().length > 0;

  return (
    <div className="rounded-xl border border-border bg-background p-4 shadow-sm space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-text-secondary" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title, author, tags, or keywords..."
          className="block w-full rounded-md border border-border bg-transparent py-2.5 pl-10 pr-3 text-sm text-text-primary placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
        {/* Category Dropdown */}
        <div className="w-full sm:w-1/3 space-y-1.5">
          <label htmlFor="category-select" className="text-xs font-medium text-text-secondary">
            Category
          </label>
          <select
            id="category-select"
            value={searchParams.get("categoryId") ?? ""}
            onChange={(e) => handleSelectChange("categoryId", e.target.value)}
            className="block w-full rounded-md border border-border bg-transparent py-2 px-3 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
          >
            <option value="">Select Category</option>
            {categories.map((opt) => (
              <option key={opt.id} value={opt.id.toString()}>
                {opt.name}
              </option>
            ))}
          </select>
        </div>

        {/* Year Dropdown */}
        <div className="w-full sm:w-1/3 space-y-1.5">
          <label htmlFor="year-select" className="text-xs font-medium text-text-secondary">
            Year
          </label>
          <select
            id="year-select"
            value={searchParams.get("year") ?? ""}
            onChange={(e) => handleSelectChange("year", e.target.value)}
            className="block w-full rounded-md border border-border bg-transparent py-2 px-3 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
          >
            <option value="">Select Year</option>
            {YEAR_OPTIONS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Button */}
        <div className="w-full sm:w-1/3 mt-2 sm:mt-0">
          <Button
            variant="outline"
            className="w-full font-medium"
            onClick={handleClear}
            disabled={!hasFilters && !searchTerm}
          >
            Clear All
          </Button>
        </div>
      </div>
    </div>
  );
}
