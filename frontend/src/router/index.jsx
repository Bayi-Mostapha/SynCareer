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
import Resumes from '@/pages/user/resume/resume-library';
import ResumeCreator from '@/pages/user/resume/resume-builder';
import JobOffer from '@/pages/company/JobOffer';
import UserHome from '@/pages/user/UserHome';
import ApplyJobOffer from '@/components/user/home/ApplyJobOffer';
import ProfilePage from '@/pages/user/profile-settings';
import SavedJobOffers from '@/pages/user/SavedJobOffers';
import Chat from '@/pages/user/chat/ChatContainer';
import ChatCompany from '@/pages/user/chat/ChatContainerCompany';
import QuizTable from '@/pages/user/quiz/quizs-table';
import PassQuiz from '@/pages/user/quiz/pass-quiz';
import Profile from '@/pages/company/user-profile';
import ViewResume from '@/pages/company/view-resume';
import UserCalendar from '@/pages/user/calendar/schedule-interview';
import CompanyVideoCall from '@/pages/company/companyVideoCall';
import UserVideoCall from '@/pages/user/userVideoCall';
import CompanyDashboard from '@/pages/company/company-dashboard';
import VerifyEmail from '@/pages/auth/verify-email';
import CompanyInterviews from '@/pages/company/company-interviews';

// protectors 
import GuestRoute from './protectors/GuestRoute';
import AuthRoute from './protectors/AuthRoute';
import Admins from '@/pages/super-admin/admins';
import JobOfferCandidats from '@/pages/company/job-offer-candidats';
import JobOfferQuiz from '@/pages/company/joboffer-quiz';


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
export const USER_PROFILE_LINK = '/user/profile';

export const USER_SAVEDJOBOFFERS_LINK = '/user/savedjobs';

export const USER_CHAT_LINK = '/user/chat';
export const USER_PASSQUIZ_LINK = '/user/quiz';
export const USER_CALENDAR_LINK = '/user/calendar';
export const USER_CALL = '/user/call'
// company 
export const COMPANY_DASHBOARD_LINK = '/company/dashboard';
export const JOBOFFER_LINK_BASE = '/company/joboffer';
export const COMPANY_CHAT_LINK = '/company/chat';
export const COMPANY_QUIZ_LINK = '/company/quiz';
export const VIEW_USER_PROFILE_BASE = 'view-user/';
export const QUIZ_RESULTS_LINK = 'quiz-resultes'
export const VIEW_USER_RESUME_BASE = 'view-resume/';
export const COMPANY_INTERVIEW = '/company/interviews';
export const COMPANY_CALL = '/company/call'

// admin 
export const ADMIN_DASHBOARD_LINK = '/admin/dashboard';
export const ADMINS_LINK = '/admin/admins';


//savedjobs


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
        element: <AuthRoute types={["user"]}><UserLayout /></AuthRoute>,
        children: [
            {
                path: USER_HOME_LINK,
                element: <UserHome />,
                children: [
                    {
                        path: ':id',
                        element: <ApplyJobOffer />
                    },
                ]
            },
            {
                path: USER_RESUMES_LINK,
                children: [
                    {
                        path: '',
                        element: <Resumes />
                    },
                    {
                        path: 'create',
                        element: <ResumeCreator />
                    },

                ]
            },
            {
                path: USER_PROFILE_LINK,
                element: <ProfilePage />,
            },
            {
                path: USER_SAVEDJOBOFFERS_LINK,
                element: <SavedJobOffers />,
            },
            {
                path: USER_CHAT_LINK,
                element: <Chat />
            },
            {
                path: USER_PASSQUIZ_LINK + "/:id",
                element: <PassQuiz />
            },
            {
                path: USER_CALENDAR_LINK + '/:cid',
                element: <UserCalendar />
            },
        ]
    },
    {
        path: USER_CALL + '/:token',
        element: <AuthRoute types={["user"]}><UserVideoCall /></AuthRoute>
    },
    {
        element: <AuthRoute types={["company"]}><CompanyLayout /></AuthRoute>,
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
                        children: [
                            {
                                path: '',
                                element: <JobOfferCandidats />
                            },
                            {
                                path: QUIZ_RESULTS_LINK,
                                element: <JobOfferQuiz />
                            },
                            {
                                path: VIEW_USER_PROFILE_BASE + ':uid',
                                element: <Profile />
                            },
                            {
                                path: VIEW_USER_RESUME_BASE + ':rid',
                                element: <ViewResume />
                            }
                        ]
                    },
                ]
            },
            {
                path: COMPANY_CHAT_LINK,
                element: <ChatCompany />
            },
            {
                path: COMPANY_QUIZ_LINK,
                element: <QuizTable />
            },
            {
                path: COMPANY_INTERVIEW,
                element: <CompanyInterviews />
            }
        ]
    },
    {
        path: COMPANY_CALL + '/:token',
        element: <AuthRoute types={["company"]}><CompanyVideoCall /></AuthRoute>
    },
    {
        element: <AuthRoute types={["admin", "super-admin"]}><AdminLayout /></AuthRoute>,
        children: [
            {
                path: ADMIN_DASHBOARD_LINK,
                element: <h1>hi admin</h1>
            },
            {
                path: ADMINS_LINK,
                element: <Admins />
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