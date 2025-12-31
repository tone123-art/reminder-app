import { Outlet } from "react-router"

export default function MainLayout(){

    return <section className="max-w-6xl mx-auto px-6 py-6 text-black">

                <Outlet/>
    </section>
}