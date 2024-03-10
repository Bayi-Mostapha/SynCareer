import { useContext, useEffect } from "react";
import { authContext } from "../../contexts/AuthWrapper";
import { useLocation, useNavigate } from "react-router-dom";

import { LOGIN_LINK } from "..";
import { goHome } from './goHome'

export default function UserRoute({ children }) {
    const {
        getUser,
        user,
        isLoggedIn,
        setCurrLocation,
    } = useContext(authContext);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn && localStorage.getItem('token') != null)
            getUser()
    }, []);
    useEffect(() => {
        if (!isLoggedIn) {
            setCurrLocation(location.pathname)
            navigate(LOGIN_LINK);
        } else if (user.type !== 'user') {
            goHome(user.type, navigate);
        }
    }, [isLoggedIn]);

    return isLoggedIn && user.type === 'user' ? children : null;
}