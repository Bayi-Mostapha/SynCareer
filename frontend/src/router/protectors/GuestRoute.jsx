import { useContext, useEffect } from "react";
import { authContext } from "../../contexts/AuthWrapper";
import { useNavigate } from "react-router-dom";

import { goHome } from './goHome'
import SynCareerLoadingPage from "@/pages/loading-page";

export default function GuestRoute({ children }) {
    const {
        user,
        getUser,
        isLoggedIn,
        isFetchingUser
    } = useContext(authContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn && localStorage.getItem('token') != null) {
            getUser()
        } else if (isLoggedIn) {
            goHome(user.type, navigate);
        }
    }, [isLoggedIn, isFetchingUser, user.type]);

    return (!isLoggedIn && !isFetchingUser) ? children : <SynCareerLoadingPage />;
}