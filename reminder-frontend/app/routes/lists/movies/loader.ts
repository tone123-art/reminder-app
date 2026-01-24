import type { movie} from "~/lib/types/movies"
import type { LoaderFunctionArgs } from "react-router";

export default async function loader({request}:LoaderFunctionArgs){

   const cookie = request.headers.get("Cookie") ?? "";
const apiBase = import.meta.env.VITE_API_URL;

const res = await fetch(`${apiBase}/api/movies/`, {
  headers: cookie ? { Cookie: cookie } : undefined,
});
    if (!res.ok) {
    throw new Response("Failed to load movies", { status: 500 });
    }

    const movies = (await res.json()) as movie[];
  return {movies}
  }