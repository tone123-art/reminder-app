import { Link } from "react-router"
import { useAuth } from "./hooks/authContext";

export default function Header(){

    const { user , isLoggedIn } = useAuth();

    async function logout() {
        await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
            method: "POST",
            credentials: "include"
    });
    window.location.href = "/login";
}

return <header className="w-full">
    
    <div className="border-b-2 border-slate-200 bg-slate-800">
    <div className="grid grid-cols-[1fr_auto_1fr] items-center min-h-16 px-4 py-2">
    <div />

    <h1 className="text-white font-bold text-xl sm:text-2xl md:text-3xl text-center truncate max-w-[70vw]">
      The Reminder App
    </h1>

    <div className="justify-self-end">
    {isLoggedIn ? (
        <button
            type="button"
            onClick={logout}
            className="flex flex-col items-start px-3 py-2 rounded-md hover:bg-white/10 transition"
        >
        <span className="text-[10px] sm:text-xs text-slate-400 truncate max-w-[10rem]">
            Hello, {user?.username}
        </span>
        <span className="text-xs sm:text-sm font-semibold text-white">
            Logout
        </span>
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
    <ul className="flex flex-wrap justify-center gap-x-6 sm:gap-x-8 gap-y-2 py-2 px-3 font-semibold text-sm sm:text-base md:text-lg text-slate-300">
        <li> <Link to='/' className="px-2 py-1 rounded hover:text-white"> Home</Link></li>
        <li> <Link to='/calendar' className="px-2 py-1 rounded hover:text-white hover:text-white"> Calendar</Link></li>
        <li> <Link to='/tasks' className="px-2 py-1 rounded hover:text-white hover:text-white"> Tasks</Link></li>
        <li> <Link to='/shopping' className="px-2 py-1 rounded hover:text-white hover:text-white"> Shopping</Link></li>
        <li> <Link to='/books' className="px-2 py-1 rounded hover:text-white hover:text-white"> Books</Link></li>
        <li> <Link to='/movies' className="px-2 py-1 rounded hover:text-white hover:text-white"> Movies</Link></li>
        
        {user?.role === 'admin' && <li> <Link to='/admin' className="px-2 py-1 rounded hover:text-white hover:text-white"> Admin</Link></li>}
         </ul>
        </nav>
</div>
</header>
}