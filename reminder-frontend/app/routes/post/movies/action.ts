import type { ActionFunctionArgs } from "react-router";


export default async function action({request}:ActionFunctionArgs) {

    const cookieHeader = request.headers.get('Cookie');
    const formData = await request.formData();

    const nameRaw =  formData.get('name');
    const availabilityRaw = formData.get('availability')
    const notesRaw = formData.get('notes');
   

    const errors:Record<string, string> = {    };

    const name = typeof nameRaw === "string" ? nameRaw.trim() : "";
    const availability = typeof availabilityRaw === "string" ? availabilityRaw : "";
    const notes =    typeof notesRaw === "string" && notesRaw.trim() !== "" ? notesRaw.trim() : null;

  if (!name) errors.name = "name is required";
  if (!availability) errors.availability = "availability is required";
  if (Object.keys(errors).length > 0) return { errors };
    
    try { 
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/movies/addMovie`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json",...(cookieHeader ? {Cookie : cookieHeader}:{})},
      body: JSON.stringify({ name, availability, notes }),
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