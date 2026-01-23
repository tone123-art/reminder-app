import { Link, useFetcher, useNavigate, useLoaderData } from "react-router"
export { default as loader} from "./loader"
export { default as action} from "./action"
import { useState } from "react";
import type { LoaderData } from "~/lib/types/movies";
import { Pencil, Trash2 } from "lucide-react";
import ListHeading from "../listUtils/listHeading";

export default function MoviePage(){

    const navigate = useNavigate();
    const editFetcher = useFetcher();

    const [editingId, setEditingId] = useState<number | null>(null);

    const { movies }  = useLoaderData() as LoaderData;


    // Handle Update of Movies
    async function handleUpdate(movie_id:number) {
    setEditingId(null)  
    }

    // Handle Delete of Movies
    async function handleDeleteMovie(movie_id: number) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/movies/${movie_id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    alert("Failed to delete Movie");
    return;
  } 
     navigate("/movies");
  };

return (
<div className="max-w-6xl mx-auto px-6 py-6">


{/* Heading of Movies list */}
<ListHeading heading={'Movies to Watch'} btnName={'+ Add Movie'} link={'/post/movies'} />



{/* Movies List */}
<div className="list-container">
        
{movies.length === 0 ? (
    <p className="text-slate-300">No Movies yet.</p>
    ) : (
    movies.map((movie)=> (movie.movie_id === editingId 
    ?     
    (<editFetcher.Form  key={movie.movie_id} 
                        method="post"
                        onSubmit={()=>handleUpdate(movie.movie_id)}
                     
                        >
        <div className="list-card">
        <input type="hidden" name="intent" value="update" />
        <input name="movie_id" type="hidden" value={movie.movie_id} /> 
         
        <input
        name='name'
        defaultValue={movie.name}
        className="input-field-small w-full"
        />

        <select
            id="availability"
            name="availability"
            className="input-field-small w-full"
            defaultValue={movie.availability}
        >
        <option value="streaming">streaming</option>
        <option value="vod">vod</option>
        <option value="none">none</option>
       
          </select>

    
      

        <input
        name='notes'
        defaultValue={movie.notes ? movie.notes : ''}
        className="input-field-small w-full"
        />

           {/* Update Button */}
        <button  
        type='submit'
        className="btn-add py-1 px-2"> 
        OK 
        </button>  
        </div>
    
 
    </editFetcher.Form>
    )
    :
    (
      // Cards
  <div
    key={movie.movie_id}
    className="list-card"
  >
    <div className="flex items-center">
  <p> 
    {movie.name}  
  </p>
   <p className="rounded-lg bg-slate-700 px-1 py-1 text-sm text-slate-300 ml-auto">
    {movie.availability} 
  </p>
  </div>
      
    {movie.notes ? (
        <p className="notes">{movie.notes}</p>
        ) 
        : null}

 
    
  <div>
            <button 
              onClick={()=> setEditingId(movie.movie_id)}
              className="btn-edit"> <Pencil size={16}/></button>
                  <button 
                onClick={()=>handleDeleteMovie(movie.movie_id)}
                className="btn-delete"> <Trash2 size={16}/>
            </button>
    </div>
            </div> )
          ))
        )}
      </div>
    </div>
  );
}




