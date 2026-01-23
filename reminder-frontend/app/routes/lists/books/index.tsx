import { Link, useFetcher, useNavigate, useLoaderData } from "react-router"
export { default as loader} from "./loader"
export { default as action} from "./action"
import { useState } from "react";
import type { LoaderData } from "~/lib/types/books";
import { Pencil, Trash2 } from "lucide-react";
import ListHeading from "../listUtils/listHeading";

export default function BookPage(){

    const navigate = useNavigate();
    const editFetcher = useFetcher();

    const [editingId, setEditingId] = useState<number | null>(null);

    const { books }  = useLoaderData() as LoaderData;


    // Handle Update of Books
    async function handleUpdate(book_id:number) {
    setEditingId(null)  
    }

    // Handle Delete of Books
    async function handleDeleteBook(book_id: number) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/books/${book_id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    alert("Failed to delete Book");
    return;
  } 
     navigate("/books");
  };

return (
<div className="max-w-6xl mx-auto px-6 py-6">


{/* Heading of Movies list */}
<ListHeading heading={'Books to Read'} btnName={'+ Add Book'} link={'/post/books'} />

{/* Movies List */}
<div className="list-container">
        
{books.length === 0 ? (
    <p className="text-slate-300">No Books yet.</p>
    ) : (
    books.map((book)=> (book.book_id === editingId 
    ?     
    (<editFetcher.Form  key={book.book_id} 
                        method="post"
                        onSubmit={()=>handleUpdate(book.book_id)}
                        >
        <div className="list-card">
        <input type="hidden" name="intent" value="update" />
        <input name="book_id" type="hidden" value={book.book_id} /> 
         
      
        <input
        name='name'
        defaultValue={book.name}
        className="input-field-small"
        />
         <input
        name='author'
        defaultValue={book.author}
        className="input-field-small"
        />

        <select
            id="category"
            name="category"
            className="input-field-small"
            defaultValue={book.category}
        >
        <option value="fiction">fiction</option>
        <option value="non-fiction">non-fiction</option>
          
          </select>

    
      

        <input
        name='notes'
        defaultValue={book.notes ? book.notes : ''}
        className="input-field-small"
        />
    
    {/* Update Button */}
        <button  
        type='submit'
        className="bg-red-600 px-2 py-1 rounded-lg hover:bg-red-400 transition-transform active:scale-90"> 
        OK 
        </button>    
        </div>
    </editFetcher.Form>
    )
    :
    (
        <div
        key={book.book_id}
        className="list-card"
        >
        <div className="flex items-center gap-3">
        <p>{book.name} {book.author ? `by ${book.author}`: ''}</p>
         
            
             <span className="rounded-lg bg-slate-700 px-1 py-1 text-sm text-slate-300 ml-auto">
                  {book.category}
            </span>
        
            </div>
        {book.notes ? (
            <p className="notes">{book.notes}</p>
        ) 
        : null}
        
            <button 
              onClick={()=> setEditingId(book.book_id)}
              className="btn-edit"> <Pencil size={16} /></button>
          
                <button 
                onClick={()=>handleDeleteBook(book.book_id)}
                className="btn-delete"> <Trash2 size={16}/>
            </button>
              </div>
          )
          ))
        )}
      </div>
    </div>
  );
}




