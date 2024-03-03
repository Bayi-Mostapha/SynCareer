import { useContext, useEffect } from "react";
import { authContext } from "../../contexts/AuthWrapper";
import { useNavigate } from "react-router-dom";
import { LOGIN_LINK } from "..";

export default function AdminRoute({ children }) {
    const { isLoggedIn, user } = useContext(authContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) { // && user.type !== 'admin'
            navigate(LOGIN_LINK);
        }
    }, [isLoggedIn, navigate]);

    return isLoggedIn ? children : null; //&& user.type === 'admin'
}