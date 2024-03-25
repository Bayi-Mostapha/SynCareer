import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LOGIN_LINK } from '@/router';
import axios from 'axios';
import { toast } from 'sonner';

const VerifyEmail = () => {
    const { url } = useParams();
    const navigate = useNavigate();

    const verify = async (url) => {
        try {
            const decodedUrl = decodeURIComponent(url);
            const res = await axios.get(decodedUrl);
            toast.success(res.data.message);
            navigate(LOGIN_LINK);
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred');
            navigate(LOGIN_LINK);
        }
    };

    useEffect(() => {
        if (url) {
            verify(url);
        } else {
            navigate(LOGIN_LINK);
        }
    }, [url, navigate]);

    return (
        <div className='w-screen h-screen flex justify-center items-center'>
            <p className='text-primary text-2xl font-semibold'>
                Verifying your email...
            </p>
        </div>
    );
};

export default VerifyEmail;