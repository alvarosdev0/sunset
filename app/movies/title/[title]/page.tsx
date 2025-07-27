// app/movies/title/[title]/page.tsx
import CommentBox from "@/components/comment-box";
import { searchMovieByTitle } from "@/lib/services/tmdb";
import { User } from "lucide-react";
import { notFound } from "next/navigation";

interface Props {
  params: { title: string };
}

export default async function MovieByTitlePage({ params }: Props) {
  const decodedTitle = decodeURIComponent(params.title);
  const movie = await searchMovieByTitle(decodedTitle);

  if (!movie) return notFound();

  return (
    <div className="flex flex-col justify-center items-center p-10">
      <div className="flex items-center justify-between max-w-4xl gap-[10vw]">
        <div className="flex flex-col gap-2 w-50">
          <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
          <p className="text-white/80">{movie.overview}</p>
          <p className="mt-4 text-sm text-white/60">
            Fecha de estreno: {movie.release_date} | Puntuación:{" "}
            {movie.vote_average}
          </p>
        </div>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="rounded shadow w-[400px]"
        />
      </div>
      <div className="mt-12 max-w-4xl w-full">
        <h2 className="text-2xl font-semibold mb-6">Reparto principal</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {movie.cast.map((actor) => (
            <div
              key={actor.id}
              className="flex flex-col items-center text-center"
            >
              {actor.profile_path !== null && (
                <img
                  src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                  alt={actor.name}
                  className="rounded-full w-24 h-24 object-cover mb-2"
                />
              )}
              {actor.profile_path === null && (
                <div className="w-24 h-24 rounded-full object-cover mb-2 flex justify-center items-center">
                  <User size={80} />
                </div>
              )}
              <p className="font-medium text-sm">{actor.name}</p>
              <p className="text-xs text-white/60">{actor.character}</p>
            </div>
          ))}
        </div>
      </div>
      {movie.id !== undefined && <CommentBox contentId={movie.id.toString()} />}
    </div>
  );
}
