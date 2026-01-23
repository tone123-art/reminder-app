import { type ActionFunctionArgs } from "react-router"


export default async function action({request}:ActionFunctionArgs) {
    const formData = await request.formData();
    const intent = formData.get('intent')
    const cookieHeader = request.headers.get('Cookie')

    if(intent === 'update'){
    const movie_id= formData.get('movie_id');
    const name = formData.get('name');
    const availability = formData.get('availability');
    const notes = formData.get('notes')

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/movies/update`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader ? { Cookie: cookieHeader } : {})
      },
      body: JSON.stringify({  
            movie_id: Number(movie_id),  name, availability, notes      
      })
    });

    if (!res.ok) throw new Error('Failed to toggle movie');
    return await res.json();
  }
    return null;
}