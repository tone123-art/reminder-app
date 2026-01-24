import { type LoaderFunctionArgs } from "react-router";
import type { User } from "~/lib/types/users";

export default async function loader({ request }: LoaderFunctionArgs) {
  const cookie = request.headers.get("Cookie") ?? "";
  const apiBase = import.meta.env.VITE_API_URL;

  const res = await fetch(`${apiBase}/api/books/`, {
  headers: cookie ? { Cookie: cookie } : undefined,
});
  if (!res.ok) throw new Response("Failed to load users", { status: 500 });
  const users = (await res.json()) as User[];
  return { users };
}
