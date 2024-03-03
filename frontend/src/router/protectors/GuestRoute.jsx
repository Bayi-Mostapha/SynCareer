import { useContext, useEffect } from "react";
import { authContext } from "../../contexts/AuthWrapper";
import { useNavigate } from "react-router-dom";

import { ADMIN_DASHBOARD_LINK, COMPANY_DASHBOARD_LINK, LOGIN_LINK, USER_HOME_LINK } from "..";
import { goHome } from './goHome'

export default function GuestRoute({ children }) {
    const { isLoggedIn, user } = useContext(authContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            // goHome(user.type, navigate);
            switch (user.type) {
                case 'user':
                    navigate(USER_HOME_LINK);
                    break;
                case 'company':
                    navigate(COMPANY_DASHBOARD_LINK);
                    break;
                case 'admin':
                    navigate(ADMIN_DASHBOARD_LINK);
                    break;
            }
        }
    }, [isLoggedIn, user, navigate]);

    return isLoggedIn ? null : children;
}