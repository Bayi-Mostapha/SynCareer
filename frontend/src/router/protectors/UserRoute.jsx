import { useContext, useEffect } from "react";
import { authContext } from "../../contexts/AuthWrapper";
import { useNavigate } from "react-router-dom";
import { LOGIN_LINK } from "..";

export default function UserRoute({ children }) {
    const { isLoggedIn } = useContext(authContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate(LOGIN_LINK);
        }
    }, [isLoggedIn, navigate]);

    return isLoggedIn ? children : null;
}