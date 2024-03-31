import {
    LOGIN_LINK,
    USER_HOME_LINK,
    COMPANY_DASHBOARD_LINK,
    ADMIN_DASHBOARD_LINK,
} from "..";

export const goHome = (type, navigate, path = '') => {
    switch (type) {
        case 'user':
            path !== '' ? navigate(path) : navigate(USER_HOME_LINK);
            break;
        case 'company':
            path !== '' ? navigate(path) : navigate(COMPANY_DASHBOARD_LINK);
            break;
        case 'admin':
            path !== '' ? navigate(path) : navigate(ADMIN_DASHBOARD_LINK);
            break;
        case 'super-admin':
            path !== '' ? navigate(path) : navigate(ADMIN_DASHBOARD_LINK);
            break;
        default:
            navigate(LOGIN_LINK);
            break;
    }
}