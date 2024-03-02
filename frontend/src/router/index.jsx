import {
    createBrowserRouter
} from 'react-router-dom';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import NotFound from '../pages/NotFound';
import UserLayout from '../layouts/UserLayout';
import AuthLayout from '../layouts/AuthLayout';

export const router = createBrowserRouter([
    {
        element: <AuthLayout />,
        children: [
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/register',
                element: <Register />
            },
        ]
    },
    {
        element: <UserLayout />,
        children: [
            {
                path: '/',
                element: <h1>home</h1>
            }
        ]
    },
    {
        path: '*',
        element: <NotFound />

    }
])