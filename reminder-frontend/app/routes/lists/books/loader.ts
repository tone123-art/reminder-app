import type { book} from "~/lib/types/books"
import type { LoaderFunctionArgs } from "react-router";

export default async function loader({request}:LoaderFunctionArgs){

    const cookieHeader = request.headers.get('Cookie');

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/books/`, {
    credentials: "include",
    headers: {
            ...(cookieHeader ? { Cookie: cookieHeader } : {})
    }
  });
    if (!res.ok) {
    throw new Response("Failed to load books", { status: 500 });
    }

    const books = (await res.json()) as book[];
  return {books}
  }