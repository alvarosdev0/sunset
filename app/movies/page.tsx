// app/movies/page.tsx
import Pagination from "@/components/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { getPopularMovies } from "@/lib/services/tmdb";
import Link from "next/link";

interface Props {
  searchParams?: { page?: string };
}

export default async function MoviesPage({ searchParams }: Props) {
  const page = Number(searchParams?.page || "1");
  const movies = await getPopularMovies(page);

  return (
    <div className="flex flex-col gap-5 px-10 py-10">
      <div className="flex flex-col gap-2 items-center justify-center">
        <h1 className="text-3xl font-bold">Películas disponibles</h1>
        <p className="font-normal text-md">
          Selección de las 20 películas más recientes.
        </p>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {movies.map((movie) => (
          <Link href={`/movies/title/${movie.title}`} key={movie.id}>
            <Card className="h-full flex items-center justify-center">
              <CardContent className="flex aspect-square items-center justify-center p-4">
                <div className="flex flex-col rounded max-h-[350px] gap-3 items-center justify-center overflow-hidden">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="flex rounded shadow w-[180px]"
                  />
                  <p className="text-[15px] text-center font-bold mb-0">
                    {movie.title}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Pagination basePath="movies" totalPages={20} />
    </div>
  );
}
