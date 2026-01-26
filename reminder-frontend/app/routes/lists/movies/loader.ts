import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import type { movie } from "~/lib/types/movies";

export default async function loader({ request }: LoaderFunctionArgs) {
  const cookie = request.headers.get("Cookie") ?? "";
  const apiBase = import.meta.env.VITE_API_URL;

  const res = await fetch(`${apiBase}/api/movies/`, {
    headers: cookie ? { Cookie: cookie } : undefined,
    credentials: "include",
  });

  // ✅ handle auth separately
  if (res.status === 401) {
    throw redirect("/login?redirectTo=/movies");
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Response(`Movies failed: ${res.status}\n${body}`, {
      status: res.status,
    });
  }

  const movies = (await res.json()) as movie[];
  return { movies };
}
