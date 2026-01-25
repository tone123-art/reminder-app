import { Link } from "react-router"
import { useAuth } from "./hooks/authContext";

export default function Header(){

    const { user , isLoggedIn } = useAuth();

    async function logout() {
        await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
            method: "POST",
            credentials: "include"
  });

  // hard redirect so all state resets
  window.location.href = "/login";
}

    return <header className="w-full">
    
 
    
    <div className="border-b-2 border-slate-200 bg-slate-800"> 

    <div className="relative flex items-center min-h-16 px-4">

   <h1 className="mx-auto text-lg sm:text-2xl md:text-3xl text-white font-bold truncate max-w-[70%] text-center"> The Reminder App </h1>
    
    <div className="absolute right-4">
    {isLoggedIn ? <Link to='/login' onClick={logout}>
        <div className="flex flex-col items-start px-3 py-2 border border-transparent rounded-md hover:bg-white/10 hover:border hover:border-slate-500 transition">
        <span className="text-xs text-slate-400"> Hallo, {user?.username}</span> 
        <span className="text-sm font-semibold text-white">Logout</span>
        </div>
        </Link>
             :
        <Link to='/login' className="text-sm font-semibold text-white hover:text-slate-200"> Login</Link>}</div>
    </div>
    </div>

    <div className="border-slate-200 border-b-2 bg-slate-700">
        <nav>
         <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 py-2 font-semibold text-sm sm:text-base md:text-xl text-slate-300">
            <li> <Link to='/' className="hover:text-white"> Home</Link></li>
             <li> <Link to='/calendar' className="hover:text-white"> Calendar</Link></li>
              <li> <Link to='/tasks' className="hover:text-white"> Tasks</Link></li>
                  <li> <Link to='/shopping' className="hover:text-white"> Shopping</Link></li>
                       <li> <Link to='/books' className="hover:text-white"> Books</Link></li>
                            <li> <Link to='/movies' className="hover:text-white"> Movies</Link></li>
            {user?.role === 'admin' && <li> <Link to='/admin' className="hover:text-white"> Admin</Link></li>}
           
            
       
                              </ul>
        </nav>
    </div>


    
    </header>
}