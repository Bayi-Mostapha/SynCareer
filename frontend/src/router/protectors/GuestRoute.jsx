import { useContext, useEffect } from "react";
import { authContext } from "../../contexts/AuthWrapper";
import { useNavigate } from "react-router-dom";
import { USER_HOME_LINK } from "..";

export default function GuestRoute({ children }) {
    const { isLoggedIn } = useContext(authContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            //switch on user role
            navigate(USER_HOME_LINK);
        }
    }, [isLoggedIn, navigate]);

    return isLoggedIn ? null : children;
}