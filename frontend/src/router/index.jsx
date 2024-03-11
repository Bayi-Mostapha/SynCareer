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
import GuestRoute from './protectors/GuestRoute';
import UserRoute from './protectors/UserRoute';
import CompanyRoute from './protectors/CompanyRoute';
import AdminRoute from './protectors/AdminRoute';
import Template from '@/pages/user/test';

// links 
// auth 
export const LOGIN_LINK = '/login';
export const REGISTER_LINK = '/register';
// user 
export const USER_HOME_LINK = '/user/home';
export const USER_RESUMES_LINK = '/user/resumes';
// company 
export const COMPANY_DASHBOARD_LINK = '/company/dashboard';
// dashboard 
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
            },
            {
                path: USER_RESUMES_LINK,
                element: <Template />
            },
        ]
    },
    {
        element: <CompanyRoute><CompanyLayout /></CompanyRoute>,
        children: [
            {
                path: COMPANY_DASHBOARD_LINK,
                element: <h1>dashboard</h1>
            },
        ]
    },
    {
        element: <AdminRoute><AdminLayout /></AdminRoute>,
        children: [
            {
                path: ADMIN_DASHBOARD_LINK,
                element: <h1>hi admin</h1>
            },
        ]
    },
    {
        path: '*',
        element: <NotFound />

    }
])