import { useContext, useEffect } from "react";
import { authContext } from "../../contexts/AuthWrapper";
import { useNavigate } from "react-router-dom";

import { LOGIN_LINK } from "..";
import { goHome } from './goHome'

export default function AdminRoute({ children }) {
    const { isLoggedIn, user } = useContext(authContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate(LOGIN_LINK, navigate);
        } else if (user.type !== 'admin') {
            goHome(user.type, navigate);
        }
    }, [isLoggedIn, user, navigate]);

    return isLoggedIn && user.type === 'admin' ? children : null;
}