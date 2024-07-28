import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import {ThemeProvider} from "@/providers/theme-provider"
import Home from "@/pages/Home.tsx";
import About from "@/pages/About.tsx";
import RootLayout from "@/layouts/RootLayout.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout/>,
        children: [
            {
                path: "/",
                element: <Home/>
            },
            {
                path: "/about",
                element: <About/>
            },
        ]
    },
]);

export default function App() {
    return (
        <ThemeProvider>
            <RouterProvider router={router}/>
        </ThemeProvider>
    )
}