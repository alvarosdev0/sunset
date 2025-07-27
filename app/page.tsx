"use client";

import { useQuery } from "@tanstack/react-query";
import { getPopularMovies, Movie } from "@/lib/services/tmdb";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["popular-movies"],
    queryFn: () => getPopularMovies(6), // ahora decides cuántas mostrar
  });

  if (isLoading) return <p>Cargando películas...</p>;
  if (error) return <p>Error: {(error as Error).message}</p>;
  return (
    <div className="px-10 overflow-x-hidden pb-10">
      <div className="flex flex-col items-center justify-center h-[60vh] gap-2">
        <h1 className="font-black tracking-tighter text-5xl">SUNSET</h1>
        <p className="text-md">
          Tu sitio favorito para compartir con personas amantes del cine y tus
          series favoritas.
        </p>
        <div className="flex gap-2">
          <Link href={"/series"}>
            <Button variant="secondary">Series</Button>
          </Link>
          <Link href={"/movies"}>
            <Button variant="default">Películas</Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center font-bold text-xl p-5 gap-5">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-center text-2xl w-[30vw]">
            Selección popular de la semana
          </h2>
          <p className="font-normal text-[14px]">
            Películas destacadas por el público.
          </p>
        </div>
        <div className="">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full max-w-[80vw] h-full"
          >
            <CarouselContent>
              {data?.map((movie) => (
                <CarouselItem
                  key={movie.id}
                  className="md:basis-1/2 lg:basis-1/4 "
                >
                  <Link href={`/movies/title/${movie.title}`}>
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <div className="flex flex-col rounded p-4 bg-white/10 h-[400px] gap-3 overflow-y-scroll">
                          <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            className="rounded shadow"
                          />
                          <h2 className="text-[18px] font-bold mb-0">
                            {movie.title}
                          </h2>
                          <p className="font-normal text-[15px]">
                            {movie.overview}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </div>
  );
}

// <main className="min-h-screen flex flex-col items-center">
//   <div className="flex-1 w-full flex flex-col gap-20 items-center">
//     <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
//       <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
//         <div className="flex gap-5 items-center font-semibold">
//           <Link href={"/"} className="uppercase">
//             Sunset
//           </Link>
//         </div>
//         {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
//       </div>
//     </nav>
//     <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
//       <Hero />
//       <main className="flex-1 flex flex-col gap-6 px-4">
//         <h2 className="font-medium text-xl mb-4">Next steps</h2>
//         {hasEnvVars() ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
//       </main>
//     </div>

//     <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
//       <p>
//         Powered by{" "}
//         <a
//           href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
//           target="_blank"
//           className="font-bold hover:underline"
//           rel="noreferrer"
//         >
//           Supabase
//         </a>
//       </p>
//       <ThemeSwitcher />
//     </footer>
//   </div>
// </main>
