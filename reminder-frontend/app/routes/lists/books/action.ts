import { type ActionFunctionArgs } from "react-router"


export default async function action({request}:ActionFunctionArgs) {
    const formData = await request.formData();
    const intent = formData.get('intent')
    const cookieHeader = request.headers.get('Cookie')

    if(intent === 'update'){
    const book_id_Raw= formData.get('book_id');
    const nameRaw = formData.get('name');
    const authorRaw = formData.get('author');
    const categoryRaw = formData.get('category');
    const notes = formData.get('notes')

    const book_id =     typeof book_id_Raw === "string" ? Number(book_id_Raw) : NaN;
    if (!Number.isFinite(book_id)) {    return { errors: { book_id: "Invalid book_id" } };  }

    const name = typeof nameRaw === "string" ? nameRaw.trim() : "";
    const author = typeof authorRaw === "string" ? authorRaw.trim() : "";
    const category = typeof categoryRaw === "string" ? categoryRaw.trim() : "";



    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/books/update`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader ? { Cookie: cookieHeader } : {})
      },
      body: JSON.stringify({  
            book_id: Number(book_id),  name, author, category, notes      
      })
    });

    if (!res.ok) {
  const text = await res.text().catch(() => "");
  throw new Error(`Failed to update book: ${res.status} ${text}`);
}
    return await res.json();
  }
    return null;
}