import {
    createBrowserRouter,
    RouterProvider,
    Navigate
} from "react-router-dom";
import {ThemeProvider} from "@/providers/theme-provider"
import RootLayout from "@/layouts/LayoutMain/Index";
import PageHabits from "@/pages/PageHabits/Index";
import PageNotFound from "@/pages/PageNotFound";
import PageAppSetting from "@/pages/PageAppSettings";
import PageManageHabits from "@/pages/PageManageHabits";
import PageLogin from "@/pages/PageLogin";
import ProtectedRoute from "@/components/ProtectedRoute.tsx";
import PublicRoute from "@/components/PublicRoute.tsx";
import { Toaster } from "@/components/ui/toaster"

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <RootLayout/>
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="/habits" replace/>,
            },
            {
                path: "habits/:habitGroupId?",
                element: <PageHabits/>,
            },
            {
                path: "settings",
                element: <PageAppSetting/>,
            },
            {
                path: "manage-habits",
                element: <PageManageHabits/>,
            },
        ]
    },
    {
        path: "/login",
        element: (
            <PublicRoute>
                <PageLogin/>
            </PublicRoute>
        ),
    },
    {
        path: "*",
        element: <PageNotFound/>,
    },
]);

export default function App() {
    return (
        <ThemeProvider>
            <RouterProvider router={router}/>
            <Toaster />
        </ThemeProvider>
    )
}