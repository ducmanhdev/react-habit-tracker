import {Outlet} from "react-router-dom";
import Aside from "@/layouts/LayoutMain/Aside.tsx";

export default function Index() {
    return (
        <main className="grid grid-cols-[300px_1fr] h-screen">
            <Aside/>
            <section>
                <Outlet/>
            </section>
        </main>
    )
}