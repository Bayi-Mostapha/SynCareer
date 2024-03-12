import { useContext, useEffect } from "react";
import { authContext } from "../../contexts/AuthWrapper";
import { useNavigate } from "react-router-dom";

import { LOGIN_LINK } from "..";
import { goHome } from './goHome'
import SynCareerLoader from "@/pages/loading-page";

export default function AuthRoute({ children, type }) {
    const {
        getUser,
        user,
        isLoggedIn,
        isFetchingUser
    } = useContext(authContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn && localStorage.getItem('token') != null) {
            getUser()
        } else if (!isLoggedIn && !isFetchingUser) {
            navigate(LOGIN_LINK);
        } else if (isLoggedIn && user.type !== type) {
            goHome(user.type, navigate);
        }
    }, [isLoggedIn, isFetchingUser, user.type, type]);

    return (isLoggedIn && !isFetchingUser && user.type === type) ? children : <SynCareerLoader />;
}