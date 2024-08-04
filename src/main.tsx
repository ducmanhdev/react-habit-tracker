import * as React from "react";
import * as ReactDOM from "react-dom/client";

import {ConvexAuthProvider} from "@convex-dev/auth/react";
import {ConvexReactClient} from "convex/react";

import App from "./App";

import "./styles/globals.css"

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)
ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ConvexAuthProvider client={convex}>
            <App/>
        </ConvexAuthProvider>
    </React.StrictMode>,
);