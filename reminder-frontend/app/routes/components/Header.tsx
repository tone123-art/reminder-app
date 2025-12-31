import { Link } from "react-router"

export default function Header(){

    return <header className="w-full">
    
 
    
    <div className="border-b-2 border-blue-200 bg-blue-500"> 

   <h1 className="py-4 text-3xl text-center font-bold"> The Reminder App </h1>

    </div>

    <div className="border-blue-200 border-b-2 bg-blue-300">
        <nav>
            <ul className="flex justify-center gap-18 py-2 font-semibold text-xl">
                <li> <Link to='/' className="lg px-2"> Tasks</Link></li>
                <li> <Link to='/'> Shopping</Link></li>
                <li> <Link to='/'> Movies</Link></li>
                <li> <Link to='/'> Books</Link></li>
                              </ul>
        </nav>
         </div>


    
    </header>
}