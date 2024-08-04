import {PropsWithChildren, useEffect} from "react";
import {useQuery} from "convex/react";
import {api} from "../../convex/_generated/api";
import {useNavigate} from "react-router-dom";

type ProtectedRouteProps = PropsWithChildren

const ProtectedRoute = ({children}: ProtectedRouteProps) => {
    const currentUser = useQuery(api.users.currentUser);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser === null) {
            navigate("/login", {replace: true});
        }
    }, [currentUser, navigate]);

    return children
};

export default ProtectedRoute;