import { type LoaderFunctionArgs } from "react-router";
import type { User } from "~/lib/types/users";

export default async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
    credentials: "include",
    headers: { ...(cookieHeader ? { Cookie: cookieHeader } : {}) },
  });
  if (!res.ok) throw new Response("Failed to load users", { status: 500 });
  const users = (await res.json()) as User[];
  return { users };
}
