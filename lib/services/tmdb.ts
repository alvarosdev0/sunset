export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}
export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface MovieWithCast extends Movie {
  cast: CastMember[];
}

export interface Show {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  genre_ids: number[];
  origin_country: string[];
  original_language: string;
  original_name: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
}

export interface ShowWithCast {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  first_air_date: string;
  vote_average: number;
  cast: CastMember[];
}

export async function getPopularMovies(page = 1): Promise<Movie[]> {
  const url = new URL("https://api.themoviedb.org/3/discover/movie");
  url.searchParams.append(
    "api_key",
    process.env.NEXT_PUBLIC_TMDB_API_KEY || ""
  );
  url.searchParams.append("language", "es-ES");
  url.searchParams.append("page", page.toString());
  url.searchParams.append("sort_by", "popularity.desc");
  url.searchParams.append("certification_country", "US");
  url.searchParams.append("certification.lte", "PG-13"); // Evita R, NC-17 y similares
  url.searchParams.append("include_adult", "false");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Error al consultar TMDB");
  const data = await res.json();
  return data.results;
}

export async function searchMovieByTitle(
  title: string
): Promise<MovieWithCast | null> {
  const searchUrl = new URL("https://api.themoviedb.org/3/search/movie");
  searchUrl.searchParams.append(
    "api_key",
    process.env.NEXT_PUBLIC_TMDB_API_KEY || ""
  );
  searchUrl.searchParams.append("language", "es-ES");
  searchUrl.searchParams.append("query", title);
  searchUrl.searchParams.append("page", "1");

  const res = await fetch(searchUrl.toString());
  if (!res.ok) throw new Error("Error al buscar película");
  const data = await res.json();

  const movie = data.results?.[0];
  if (!movie) return null;

  // Segunda llamada para obtener el elenco
  const creditsUrl = new URL(
    `https://api.themoviedb.org/3/movie/${movie.id}/credits`
  );
  creditsUrl.searchParams.append(
    "api_key",
    process.env.NEXT_PUBLIC_TMDB_API_KEY || ""
  );
  creditsUrl.searchParams.append("language", "es-ES");

  const creditsRes = await fetch(creditsUrl.toString());
  if (!creditsRes.ok) throw new Error("Error al obtener el reparto");
  const creditsData = await creditsRes.json();

  return {
    ...movie,
    cast: creditsData.cast.slice(0, 8), // 👈 puedes ajustar el límite
  };
}

export async function getPopularSeries(page = 1): Promise<Show[]> {
  const url = new URL("https://api.themoviedb.org/3/tv/popular");
  url.searchParams.append(
    "api_key",
    process.env.NEXT_PUBLIC_TMDB_API_KEY || ""
  );
  url.searchParams.append("language", "es-ES");
  url.searchParams.append("page", page.toString());

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Error al obtener series");
  const data = await res.json();
  return data.results as Show[]; // 👈 tipado explícito
}

// lib/services/tmdb.ts

export async function searchSeriesByTitle(
  title: string
): Promise<ShowWithCast | null> {
  const searchUrl = new URL("https://api.themoviedb.org/3/search/tv");
  searchUrl.searchParams.append(
    "api_key",
    process.env.NEXT_PUBLIC_TMDB_API_KEY || ""
  );
  searchUrl.searchParams.append("language", "es-ES");
  searchUrl.searchParams.append("query", title);

  const res = await fetch(searchUrl.toString());
  if (!res.ok) throw new Error("Error al buscar serie");
  const data = await res.json();
  const series = data.results?.[0];
  if (!series) return null;

  const creditsUrl = new URL(
    `https://api.themoviedb.org/3/tv/${series.id}/credits`
  );
  creditsUrl.searchParams.append(
    "api_key",
    process.env.NEXT_PUBLIC_TMDB_API_KEY || ""
  );
  creditsUrl.searchParams.append("language", "es-ES");
  const creditsRes = await fetch(creditsUrl.toString());
  if (!creditsRes.ok) throw new Error("Error al obtener el reparto");
  const creditsData = await creditsRes.json();

  return {
    ...series,
    cast: creditsData.cast.slice(0, 8),
  };
}
