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
import ForgotPassword from '@/pages/auth/forgot-password';
import ResetPassword from '@/pages/auth/reset-password';
import NotFound from '../pages/NotFound';
import ResumeContainer from '@/pages/user/resume-container';
import Resumes from '@/pages/user/resume/resume-library';
import ResumeCreator from '@/pages/user/resume/resume-builder';
import JobOffer from '@/pages/company/JobOffer';

// protectors 
import GuestRoute from './protectors/GuestRoute';
import AuthRoute from './protectors/AuthRoute';
import CompanyDashboard from '@/pages/company/company-dashboard';
import VerifyEmail from '@/pages/auth/verify-email';
import JobOfferCandidats from '@/pages/company/job-offer-candidats';

// links 
// auth 
export const LOGIN_LINK = '/login';
export const REGISTER_LINK = '/register';
export const FORGOT_PASSWORD_LINK = '/forgot-password';
export const RESET_PASSWORD_BASE_LINK = '/reset-password';
export const RESET_PASSWORD_LINK = '/reset-password/:email';
// user 
export const USER_HOME_LINK = '/user/home';
export const USER_RESUMES_LINK = '/user/resumes';
// company 
export const COMPANY_DASHBOARD_LINK = '/company/dashboard';
export const JOBOFFER_LINK_BASE = '/company/joboffer';
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
            {
                path: FORGOT_PASSWORD_LINK,
                element: <ForgotPassword />
            },
            {
                path: RESET_PASSWORD_LINK,
                element: <ResetPassword />
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
                element: <CompanyDashboard />
            },

            {
                path: JOBOFFER_LINK_BASE,
                children: [
                    {
                        path: '',
                        element: <JobOffer />
                    },
                    {
                        path: ':id',
                        element: <JobOfferCandidats />
                    },
                ]
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
        path: '/verify-email/:url',
        element: <VerifyEmail />
    },
    {
        path: '*',
        element: <NotFound />

    }
])