import {
    createBrowserRouter
} from 'react-router-dom';

// layouts 
import AuthLayout from '../layouts/AuthLayout';
import UserLayout from '../layouts/UserLayout';
import CompanyLayout from '../layouts/CompanyLayout';
import AdminLayout from '../layouts/AdminLayout';

// pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import NotFound from '../pages/NotFound';

// protectors 
import UserRoute from './protectors/UserRoute';
import GuestRoute from './protectors/GuestRoute';

// links 
export const LOGIN_LINK = '/login';
export const REGISTER_LINK = '/register';
export const USER_HOME_LINK = '/user/home';
export const COMPANY_DASHBOARD_LINK = '/company/dashboard';
export const ADMIN_DASHBOARD_LINK = '/admin/dashboard';

// router 
export const router = createBrowserRouter([
    {
        element: <GuestRoute><AuthLayout /></GuestRoute>,
        children: [
            {
                path: LOGIN_LINK,
                element: <Login />
            },
            {
                path: REGISTER_LINK,
                element: <Register />
            },
        ]
    },
    {
        element: <UserRoute><UserLayout /></UserRoute>,
        children: [
            {
                path: USER_HOME_LINK,
                element: <h1>user home</h1>
            }
        ]
    },
    {
        element: <CompanyLayout />,
        children: [
            {
                path: COMPANY_DASHBOARD_LINK,
                element: <h1>dashboard</h1>
            }
        ]
    },
    {
        element: <AdminLayout />,
        children: [
            {
                path: ADMIN_DASHBOARD_LINK,
                element: <h1>hi admin</h1>
            }
        ]
    },
    {
        path: '*',
        element: <NotFound />

    }
])