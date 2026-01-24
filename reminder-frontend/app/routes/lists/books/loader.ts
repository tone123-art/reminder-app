import type { book} from "~/lib/types/books"
import type { LoaderFunctionArgs } from "react-router";

export default async function loader({request}:LoaderFunctionArgs){

const cookie = request.headers.get("Cookie") ?? "";
const apiBase = import.meta.env.VITE_API_URL;

const res = await fetch(`${apiBase}/api/books/`, {
  headers: cookie ? { Cookie: cookie } : undefined,
});
    if (res.status === 401) {
  throw new Response("Unauthorized", { status: 401 });
}
if (!res.ok) {
  const body = await res.text().catch(() => "");
  throw new Response(`Books failed: ${res.status}\n${body}`, { status: res.status });
}

    const books = (await res.json()) as book[];
  return {books}
  }