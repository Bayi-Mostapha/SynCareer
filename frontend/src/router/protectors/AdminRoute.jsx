import { useContext, useEffect } from "react";
import { authContext } from "../../contexts/AuthWrapper";
import { useNavigate } from "react-router-dom";

import { ADMIN_DASHBOARD_LINK, COMPANY_DASHBOARD_LINK, LOGIN_LINK, USER_HOME_LINK } from "..";
import { goHome } from './goHome'

export default function AdminRoute({ children }) {
    const { isLoggedIn, user } = useContext(authContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate(LOGIN_LINK, navigate);
        } else if (user.type !== 'admin') {
            // goHome(user.type);
            switch (user.type) {
                case 'user':
                    navigate(USER_HOME_LINK);
                    break;
                case 'company':
                    navigate(COMPANY_DASHBOARD_LINK);
                    break;
            }
        }
    }, [isLoggedIn, user, navigate]);

    return isLoggedIn && user.type === 'admin' ? children : null;
}