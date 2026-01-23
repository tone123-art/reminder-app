import type { ActionFunctionArgs } from "react-router";

export default async function action({request}:ActionFunctionArgs) {

    const cookieHeader = request.headers.get('Cookie');
    const formData = await request.formData();

    const nameRaw =  formData.get('name');
    const quantityRaw = formData.get('quantity')
    const notesRaw = formData.get('notes');
    const storeTypeRaw = formData.get('type')

    const errors:Record<string, string> = {    };

    const name = typeof nameRaw === "string" ? nameRaw.trim() : "";
    const store_type = typeof storeTypeRaw === "string" ? storeTypeRaw : "";

    const quantityStr = typeof quantityRaw === "string" ? quantityRaw : "";
    const quantity = quantityStr === "" ? 1 : Number(quantityStr);

    const notes =    typeof notesRaw === "string" && notesRaw.trim() !== "" ? notesRaw.trim() : null;

  if (!name) errors.name = "name is required";
  if (!store_type) errors.store_type = "type is required";
  if (!Number.isFinite(quantity) || quantity < 1) errors.quantity = "quantity must be >= 1";

  if (Object.keys(errors).length > 0) return { errors };

    

    try { 
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/shopping/addItem`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json",...(cookieHeader ? {Cookie : cookieHeader}:{})},
      body: JSON.stringify({ name, quantity, notes, store_type }),
      keepalive:true,
    });

    if (!res.ok) {
      throw new Error(`Backend returned ${res.status}`);
    }

    const saved = await res.json(); 

    return {
      message: "Data submitted successfully",
      data: saved,
    };
  } catch (err: any) {
    console.error("Error talking to backend:", err);
    return {
      errors: {
        form:
          "Something went wrong saving to the database: " +
          (err?.message ?? "Unknown error"),
      },
    };
};
}
