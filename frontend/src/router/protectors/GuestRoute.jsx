import { useContext, useEffect } from "react";
import { authContext } from "../../contexts/AuthWrapper";
import { useNavigate } from "react-router-dom";
import { ADMIN_DASHBOARD_LINK, COMPANY_DASHBOARD_LINK, LOGIN_LINK, USER_HOME_LINK } from "..";

export default function GuestRoute({ children }) {
    const { isLoggedIn, user, logout } = useContext(authContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            // switch (user.type) {
            //     case 'user':
            //         navigate(USER_HOME_LINK);
            //         break;
            //     case 'company':
            //         navigate(COMPANY_DASHBOARD_LINK);
            //         break;
            //     case 'admin':
            //         navigate(ADMIN_DASHBOARD_LINK);
            //         break;
            //     case 'super-admin':
            //         navigate(ADMIN_DASHBOARD_LINK);
            //         break;
            //     default:
            //         logout()
            //         navigate(LOGIN_LINK);
            //         break;
            // }
        }
    }, [isLoggedIn, navigate]);

    return isLoggedIn ? null : children;
}