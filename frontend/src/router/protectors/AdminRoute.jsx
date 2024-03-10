import { useContext, useEffect } from "react";
import { authContext } from "../../contexts/AuthWrapper";
import { useLocation, useNavigate } from "react-router-dom";

import { LOGIN_LINK } from "..";
import { goHome } from './goHome'

export default function AdminRoute({ children }) {
    const { isLoggedIn, user, setCurrLocation } = useContext(authContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isLoggedIn) {
            setCurrLocation(location.pathname)
            navigate(LOGIN_LINK);
        } else if (user.type !== 'admin') {
            goHome(user.type, navigate);
        }
    }, [isLoggedIn]);

    return isLoggedIn && user.type === 'admin' ? children : null;
}