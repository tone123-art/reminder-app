import type { ActionFunctionArgs } from "react-router";



export default async function action({request}:ActionFunctionArgs){

    const formData = await request.formData();
    const intent = formData.get("intent");
    const cookieHeader = request.headers.get("Cookie");

    if(intent === "accept"){

    const userId = formData.get('userId')

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/accept`,{
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", ...(cookieHeader ? { Cookie: cookieHeader } : {}) },
      body: JSON.stringify({ userId }),
      });
    if (!res.ok) throw new Error("Failed to accept user");
    return await res.json();
  }


    if(intent === "delete"){

    const userId = formData.get('userId')

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/delete`,{
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json", ...(cookieHeader ? { Cookie: cookieHeader } : {}) },
      body: JSON.stringify({ userId }),
      });
    if (!res.ok) throw new Error("Failed to delete user");
    return await res.json();
  }
  return null;

    }




    

