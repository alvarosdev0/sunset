import Pagination from "@/components/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { getPopularSeries } from "@/lib/services/tmdb";
import Link from "next/link";

interface Props {
  searchParams?: { page?: string };
}

export default async function SeriesPage({ searchParams }: Props) {
  const page = Number(searchParams?.page || "1");
  const series = await getPopularSeries(page); // 👈 pásale el número de página

  return (
    <div className="flex flex-col gap-5 px-10 py-10">
      <div className="flex flex-col gap-2 items-center justify-center">
        <h1 className="text-3xl font-bold">Series disponibles</h1>
        <p className="font-normal text-md">
          Selección de las 20 series más recientes.
        </p>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {series.map((Show) => (
          <Link href={`/series/title/${Show.name}`} key={Show.id}>
            <Card className="h-full flex items-center justify-center">
              <CardContent className="flex aspect-square items-center justify-center p-4">
                <div className="flex flex-col rounded max-h-[350px] gap-3 items-center justify-center overflow-hidden">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${Show.poster_path}`}
                    alt={Show.name}
                    className="flex rounded shadow w-[180px]"
                  />
                  <p className="text-[15px] text-center font-bold mb-0">
                    {Show.name}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Pagination basePath="series" totalPages={20} />
    </div>
  );
}
