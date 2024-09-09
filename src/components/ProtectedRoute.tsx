import {PropsWithChildren} from "react";
import {Authenticated, AuthLoading, Unauthenticated} from "convex/react";
import {Navigate} from "react-router-dom";

type ProtectedRouteProps = PropsWithChildren

const ProtectedRoute = ({children}: ProtectedRouteProps) => {
    return (
        <>
            <AuthLoading>
                <div className="min-h-screen flex flex-col justify-center items-center p-4 text-2xl">
                    LOADING...
                </div>
            </AuthLoading>
            <Authenticated>
                {children}
            </Authenticated>
            <Unauthenticated>
                <Navigate to="/login" replace/>
            </Unauthenticated>
        </>
    )
};

export default ProtectedRoute;