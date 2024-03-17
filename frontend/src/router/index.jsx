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
import ResumeContainer from '@/pages/user/resume-container';
import Resumes from '@/pages/user/resume/resume-library';
import ResumeCreator from '@/pages/user/resume/resume-builder';
import JobOffer from '@/pages/company/JobOffer';

// protectors 
import GuestRoute from './protectors/GuestRoute';
import AuthRoute from './protectors/AuthRoute';

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

export const JOBOFFER_LINK = '/company/joboffer';


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
        element: <AuthRoute type="user"><UserLayout /></AuthRoute>,
        children: [
            {
                path: USER_HOME_LINK,
                element: <h1>user home</h1>
            },
            {
                path: USER_RESUMES_LINK,
                element: <ResumeContainer />,
                children: [
                    {
                        path: '',
                        element: <Resumes />
                    },
                    {
                        path: 'create',
                        element: <ResumeCreator />
                    }
                ]
            },
        ]
    },
    {
        element: <AuthRoute type="company"><CompanyLayout /></AuthRoute>,
        children: [
            {
                path: COMPANY_DASHBOARD_LINK,
                element: <h1>dashboard</h1>
            },

            {
                path: JOBOFFER_LINK,
                element: <JobOffer/>
            },
        ]
    },
    {
        element: <AuthRoute type="admin"><AdminLayout /></AuthRoute>,
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