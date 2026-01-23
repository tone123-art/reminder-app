import type { movie} from "~/lib/types/movies"
import type { LoaderFunctionArgs } from "react-router";

export default async function loader({request}:LoaderFunctionArgs){

    const cookieHeader = request.headers.get('Cookie');

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/movies/`, {
    credentials: "include",
    headers: {
            ...(cookieHeader ? { Cookie: cookieHeader } : {})
    }
  });
    if (!res.ok) {
    throw new Response("Failed to load movies", { status: 500 });
    }

    const movies = (await res.json()) as movie[];
  return {movies}
  }