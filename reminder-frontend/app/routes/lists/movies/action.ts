import { redirect, type ActionFunctionArgs } from "react-router";

export default async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const cookieHeader = request.headers.get("Cookie") ?? "";

  if (intent === "update") {
    const movie_id = Number(formData.get("movie_id"));
    const name = formData.get("name");
    const availability = formData.get("availability");
    const notes = formData.get("notes");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/movies/update`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      body: JSON.stringify({ movie_id, name, availability, notes }),
    });

    if (res.status === 401) {
      throw redirect("/login?redirectTo=/movies");
    }

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Response(body || "Failed to update movie", { status: res.status });
    }

    return await res.json();
  }

  return null;
}
