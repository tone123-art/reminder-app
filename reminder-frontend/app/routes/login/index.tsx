
import { useState, useMemo } from "react"
import { useNavigate, useSearchParams } from "react-router";
import { useAuth} from "../../components/hooks/authContext"


// Prevent open redirects. Only allow same-site paths like "/list" or "/edit/1"
function safeRedirectPath(value: string | null) {
  if (!value) return "/";
  if (!value.startsWith("/")) return "/";
  if (value.startsWith("//")) return "/";
  return value;
}


export default function LoginPage(){

    const navigate = useNavigate();
    const { refresh } = useAuth();
    const [searchParams] = useSearchParams();


    const redirectTo = useMemo(
    () => safeRedirectPath(searchParams.get("redirectTo")),
    [searchParams]
  );

    // States and Variables
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [mode, setMode] = useState<string>('login');
    const [error, setError] = useState<string|null>(null)
    const [loading, setLoading] =useState<boolean>(false)
    const [showPw, setShowPw] = useState(false);


    // OnSubmit Function
    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

    const url = mode === "login"
     ? `${import.meta.env.VITE_API_URL}/api/auth/login`
     : `${import.meta.env.VITE_API_URL}/api/auth/signup`;

    const payload =
      mode === "login"
        ? { email: email.trim().toLowerCase(), password }
        : { name: name.trim(), email: email.trim().toLowerCase(), password };

    try {
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

    if (!res.ok) {
    if (res.status === 409) setError("That email is already registered.");
    else if (res.status === 400) setError("Please check your inputs.");
    else setError(mode === "login" ? "Invalid email or password." : "Signup failed.");
    return;
  }
      await refresh();
      navigate(redirectTo, { replace: true });
    } catch {
      setError(`Network error. Is the backend running on :${import.meta.env.VITE_PORT}?`);
    }finally {
  setLoading(false);}
  }

return (

   <div className="min-h-[70vh] grid place-items-center p-8">
   <div className="w-full max-w-sm md:max-w-md lg:max-w-lg border border-gray-700 rounded-xl p-5 bg-white text-black">
   
     {/* Choose Login or SignUp */}
   <div className="flex items-center justify-between mb-4">
   <h1 className="text-xl font-semibold mb-2 text-black">  {mode === "login" ? "Login" : "Create Account"}</h1>
   <button
        type="button"
        onClick={() => {
            setError(null);
            setMode(m => (m === "login" ? "signup" : "login"));
        }}
        className="text-sm text-gray-600 hover:text-black transition"
        >
        {mode === "login" ? "Sign up" : "Back to login"}
    </button>
   </div>

    {/* Login / SignUp Form */}
    <form onSubmit={onSubmit} className="grid gap-3">
        {mode === "signup" && (
        <label className="grid gap-1.5">
            <span className="text-sm  text-black font-medium">Name</span>
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-60"
              />
        </label>
        )}
        <label className="grid gap-1.5">
            <span className="text-sm text-black font-medium">Email</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-60"
            />
        </label>
        
        <label className="grid gap-1.5">
            <span className="text-sm text-black font-medium">Password</span>
            <div className="flex gap-2">
             <input
                type={showPw ? "text" : "password"}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="flex-1 px-3 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-60"
              />
        <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                disabled={loading}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-60"
              >
                {showPw ? "Hide" : "Show"}
        </button>
        </div>
        </label>

        {error && (
            <div className="rounded-lg border border-red-300 bg-red-50 p-2.5 text-sm text-red-700">
              {error}
        </div>
        )}

        <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-xl border border-black bg-black py-3 font-semibold text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? (mode === "login" ? "Logging in…" : "Creating account…")
              : (mode === "login" ? "Login" : "Sign up")}
          </button>
        </form>
    </div>
     </div>
)

}