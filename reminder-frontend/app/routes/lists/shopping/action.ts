import { redirect, type ActionFunctionArgs } from "react-router";

export default async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const cookieHeader = request.headers.get("Cookie") ?? "";

  if (intent === "update") {
    const item_id = Number(formData.get("item_id"));
    const name = formData.get("name");
    const quantity = formData.get("quantity");
    const notes = formData.get("notes");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/shopping/items/update`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      body: JSON.stringify({ item_id, name, quantity, notes }),
    });

    if (res.status === 401) {
      throw redirect("/login?redirectTo=/shopping");
    }

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Response(body || "Failed to update item", { status: res.status });
    }

    return await res.json();
  }

  return null;
}
