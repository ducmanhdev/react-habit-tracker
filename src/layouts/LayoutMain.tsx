import {Outlet} from "react-router-dom";
import LayoutMainAside from "@/layouts/LayoutMainAside.tsx";

export default function LayoutMain() {
    return (
        <main className="grid grid-cols-[300px_1fr] h-screen">
            <LayoutMainAside/>
            <section>
                <Outlet/>
            </section>
        </main>
    )
}