import {type ActionFunctionArgs } from "react-router"; 

export default async function  action({request}:ActionFunctionArgs) {
   
    const formData = await request.formData();
    const intent = formData.get('intent');
    const cookieHeader = request.headers.get('Cookie')


      // Toggle completion
    if (intent === 'toggle') {
    const task_id = formData.get('task_id');
    const completed = formData.get('completed');

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/completed`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader ? { Cookie: cookieHeader } : {})
      },
      body: JSON.stringify({ 
        task_id: Number(task_id), 
        completed 
      })
    });

    if (!res.ok) throw new Error('Failed to update task');
    return await res.json();
  }

    // Update task (your existing code)
  if (intent === 'update') {


     const name = formData.get('name');
     const priority = formData.get('priority');
     const deadlineRaw = formData.get('deadline');
     const taskId = Number(formData.get('task_id'));

   ;


    const payload = {
    name: typeof name === "string" ? name : undefined,
    priority: typeof priority === "string" ? priority : undefined,
    // empty string => null (removes deadline)
    deadline:
    typeof deadlineRaw === "string"
        ? (deadlineRaw.trim() === "" ? null : deadlineRaw) // "YYYY-MM-DD"
        : undefined,
    task_id: taskId,
    };

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/update`, {
  method: "PATCH",
  credentials: "include",
  headers: { "Content-Type": "application/json", ...(cookieHeader ? {Cookie : cookieHeader}:{}) },
  body: JSON.stringify(payload),
});
  if (!res.ok) {
     throw Error("Failed to update task" );
  }
  const updated = await res.json();
  return updated;  
}}