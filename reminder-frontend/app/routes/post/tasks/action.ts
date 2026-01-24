import type { ActionFunctionArgs } from "react-router";


export default async function action({request}:ActionFunctionArgs) {

    const formData = await request.formData();

    const taskName = formData.get('name');
    const taskPriority = formData.get('priority');
    const taskDeadlineRaw =formData.get('deadline');

    const taskDeadline =
        typeof taskDeadlineRaw === "string" && taskDeadlineRaw !== ""
        ? taskDeadlineRaw  : null;


     const cookieHeader = request.headers.get('Cookie');

    


   const errors:Record<string, string> = {    };

   if (typeof taskName !== "string" || !taskName.trim()) {
        errors.name = "Task is required";
     }
    if (typeof taskPriority !== "string" || !taskPriority.trim()) {
    errors.priority = "Priority is required";
         }
    

    if(Object.keys(errors).length>0){return {errors}}

     try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/addTask`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json",...(cookieHeader ? {Cookie : cookieHeader}:{})},
      body: JSON.stringify({ taskName, taskPriority, taskDeadline }),
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

  }

    

    
}