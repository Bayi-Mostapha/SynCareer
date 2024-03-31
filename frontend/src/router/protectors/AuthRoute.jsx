import { useContext, useEffect } from "react";
import { authContext } from "../../contexts/AuthWrapper";
import { useNavigate } from "react-router-dom";

import { LOGIN_LINK } from "..";
import { goHome } from './goHome'
import SynCareerLoadingPage from "@/pages/loading-page";

export default function AuthRoute({ children, types }) {
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
        } else if (isLoggedIn && !types.includes(user.type)) {
            goHome(user.type, navigate);
        }
    }, [isLoggedIn, isFetchingUser, user.type, types]);

    return (isLoggedIn && !isFetchingUser && types.includes(user.type)) ? children : <SynCareerLoadingPage />;
}