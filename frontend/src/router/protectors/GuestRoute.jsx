import { useContext, useEffect } from "react";
import { authContext } from "../../contexts/AuthWrapper";
import { useNavigate } from "react-router-dom";

import { goHome } from './goHome'

export default function GuestRoute({ children }) {
    const { isLoggedIn, user } = useContext(authContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            goHome(user.type, navigate);
        }
    }, [isLoggedIn, user, navigate]);

    return isLoggedIn ? null : children;
}