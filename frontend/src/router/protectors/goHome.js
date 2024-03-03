import { ADMIN_DASHBOARD_LINK, COMPANY_DASHBOARD_LINK, LOGIN_LINK, USER_HOME_LINK } from "..";

export const goHome = (type, navigate) => {
    switch (type) {
        case 'user':
            navigate(USER_HOME_LINK);
            break;
        case 'company':
            navigate(COMPANY_DASHBOARD_LINK);
            break;
        case 'admin':
            navigate(ADMIN_DASHBOARD_LINK);
            break;
        // case 'super-admin':
        //     navigate(ADMIN_DASHBOARD_LINK);
        //     break;
        default:
            navigate(LOGIN_LINK);
            break;
    }
}