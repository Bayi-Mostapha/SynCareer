import { useContext, useEffect } from "react";
import { authContext } from "../../contexts/AuthWrapper";
import { useNavigate } from "react-router-dom";

import { LOGIN_LINK } from "..";
import { goHome } from './goHome'

export default function UserRoute({ children }) {
    const { isLoggedIn, user } = useContext(authContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate(LOGIN_LINK);
        } else if (user.type !== 'user') {
            goHome(user.type, navigate);
        }
    }, [isLoggedIn, user, navigate]);

    return isLoggedIn && user.type === 'user' ? children : null;
}