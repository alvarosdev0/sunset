"use client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  totalPages: number;
  basePath?: string; // 👈 por defecto 'movies'
}

export default function Pagination({
  totalPages,
  basePath = "movies",
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") || "1");

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/${basePath}?${params.toString()}`);
  };

  const maxButtons = 5;
  const start = Math.max(
    1,
    Math.min(
      currentPage - Math.floor(maxButtons / 2),
      totalPages - maxButtons + 1
    )
  );
  const end = Math.min(totalPages, start + maxButtons - 1);
  const visiblePages = Array.from(
    { length: end - start + 1 },
    (_, i) => start + i
  );

  return (
    <div className="flex gap-2 mt-6 justify-center items-center">
      <button
        onClick={() => goToPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-50"
      >
        <ArrowLeft width={15} />
      </button>

      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`px-3 py-1 rounded hover:bg-white/20 hover:font-bold ${
            page === currentPage ? "bg-white/20 font-bold" : "bg-white/10"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-50"
      >
        <ArrowRight width={15} />
      </button>
    </div>
  );
}
