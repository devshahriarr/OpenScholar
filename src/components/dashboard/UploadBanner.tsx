import { Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function UploadBanner() {
  return (
    <div className="rounded-xl bg-primary px-6 py-8 sm:px-8 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden shadow-md">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] rounded-full bg-white blur-3xl" />
      </div>

      <div className="relative z-10 space-y-2">
        <h2 className="text-2xl font-semibold text-white">Share Your Research with the World</h2>
        <p className="text-sm text-white/80 max-w-lg">
          Upload your thesis and make it accessible to researchers globally
        </p>
      </div>

      <div className="relative z-10 flex-shrink-0">
        <Link href="/papers/upload">
          <Button variant="secondary" size="md" className="gap-2 font-semibold shadow-sm">
            <Upload className="h-4 w-4" />
            Upload Thesis
          </Button>
        </Link>
      </div>
    </div>
  );
}
