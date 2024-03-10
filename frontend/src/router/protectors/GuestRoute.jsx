import { useContext, useEffect } from "react";
import { authContext } from "../../contexts/AuthWrapper";
import { useNavigate } from "react-router-dom";

import { goHome } from './goHome'

export default function GuestRoute({ children }) {
    const {
        user,
        getUser,
        isLoggedIn,
        currLocation,
    } = useContext(authContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn && localStorage.getItem('token') != null) {
            getUser()
        }
    }, []);
    useEffect(() => {
        if (isLoggedIn) {
            goHome(user.type, navigate, currLocation);
        }
    }, [isLoggedIn]);

    return isLoggedIn ? null : children;
}