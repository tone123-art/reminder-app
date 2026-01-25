import type { Route } from "../../+types/root";
import { Link } from "react-router";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Reminder-App" },
  
  ];
}

type TileProps = {
  to: string;
  img: string;
  title: string;
};


function Tile({to, img ,title}:TileProps) {

  return (

   <Link to={to}>
   <div className="flex flex-col items-center w-full overflow-hidden cursor-pointer rounded-lg border border-transparent hover:border-black hover:border-2 transition active:scale-95"> 
   <img src={img} alt={img} className="w-full aspect-[4/3] object-cover rounded-t-lg shadow-md"/> 
   <p className="w-full text-center bg-amber-500 text-xl font-semibold rounded-b-lg py-2">{title}</p>
     </div>
     </Link> 

  );
}




export default function Home() {

    const tiles = [
    { to: "calendar", img: "/images/calendar.avif", title: "Calendar" },
    { to: "tasks", img: "/images/tasklist.avif", title: "Tasks" },
    { to: "shopping", img: "/images/shopping.avif", title: "Shopping" },
    { to: "books", img: "/images/books.avif", title: "Books" },
    { to: "movies", img: "/images/movies.avif", title: "Movies" },
  ];
  return (
  <div className="max-w-6xl mx-auto px-4">
  <div className="grid gap-6 mt-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

     {tiles.map((item)=> (
      <Tile key={item.to} to={item.to} img={item.img} title={item.title}/>

     ))}
     

    </div> 
    </div> 
 

);




}
