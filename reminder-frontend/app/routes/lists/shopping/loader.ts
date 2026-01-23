import type { shopping_item} from "~/lib/types/shopping"
import type { LoaderFunctionArgs } from "react-router";

export default async function loader({request}:LoaderFunctionArgs){

    const cookieHeader = request.headers.get('Cookie');

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/shopping/items`, {
    credentials: "include",
    headers: {
            ...(cookieHeader ? { Cookie: cookieHeader } : {})
    }
  });
    if (!res.ok) {
    throw new Response("Failed to load items", { status: 500 });
    }

    const shopping_items = (await res.json()) as shopping_item[];
  return {shopping_items}
  }