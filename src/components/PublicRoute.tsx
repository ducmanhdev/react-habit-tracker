import {PropsWithChildren} from "react";
import {Authenticated, AuthLoading, Unauthenticated} from "convex/react";
import {Navigate} from "react-router-dom";

type PublicRouteProps = PropsWithChildren

const PublicRoute = ({children}: PublicRouteProps) => {
    return (
        <>
            <AuthLoading>
                <div className="min-h-screen flex flex-col justify-center items-center p-4 text-2xl">
                    LOADING...
                </div>
            </AuthLoading>
            <Authenticated>
                <Navigate to="/" replace/>
            </Authenticated>
            <Unauthenticated>
                {children}
            </Unauthenticated>
        </>
    );
};

export default PublicRoute;