import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import type { shopping_item } from "~/lib/types/shopping";

export default async function loader({ request }: LoaderFunctionArgs) {
  const cookie = request.headers.get("Cookie") ?? "";
  const apiBase = import.meta.env.VITE_API_URL;

  if (!apiBase) throw new Response("VITE_API_URL missing", { status: 500 });

  const res = await fetch(`${apiBase}/api/shopping/items/`, {
    headers: cookie ? { Cookie: cookie } : undefined,
    credentials: "include",
  });

  if (res.status === 401) {
    throw redirect(`/login?redirectTo=/shopping`);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Response(`Shopping failed: ${res.status}\n${body}`, { status: res.status });
  }

  const shopping_items = (await res.json()) as shopping_item[];
  return { shopping_items };
}
