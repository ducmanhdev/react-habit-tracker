import {
    createBrowserRouter,
    RouterProvider,
    Navigate
} from "react-router-dom";
import {ThemeProvider} from "@/providers/theme-provider"
import RootLayout from "@/layouts/LayoutMain/Index";
import Index from "@/pages/PageHabits/Index";
import PageNotFound from "@/pages/PageNotFound";
import PageAppSetting from "@/pages/PageAppSettings";
import PageManageHabits from "@/pages/PageManageHabits";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/habits" replace/>,
    },
    {
        path: "/habits",
        element: <RootLayout/>,
        children: [
            {
                index: true,
                element: <Index/>,
            },
            {
                path: ":habitGroupId",
                element: <Index/>,
            },
        ]
    },
    {
        path: "/settings",
        element: <PageAppSetting/>,
    },
    {
        path: "/manage-habits",
        element: <PageManageHabits/>,
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
        </ThemeProvider>
    )
}
