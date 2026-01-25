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

    <div className="flex flex-col sm:flex-row sm:items-center sm:min-h-16 px-4 py-2 sm:py-0">

   <h1 className="text-white font-bold text-xl sm:text-2xl md:text-3xl text-center sm:text-left sm:flex-1"> The Reminder App </h1>
    
   <div className="mt-2 sm:mt-0 sm:ml-4 flex justify-center sm:justify-end">
      {isLoggedIn ? (
        <button
          type="button"
          onClick={logout}
          className="flex flex-col items-start px-3 py-2 rounded-md hover:bg-white/10 transition"
        >
          <span className="text-xs text-slate-400">Hallo, {user?.username}</span>
          <span className="text-sm font-semibold text-white">Logout</span>
        </button>
      ) : (
        <Link to="/login" className="text-sm font-semibold text-white hover:text-slate-200">
          Login
        </Link>
      )}
    </div>
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