import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { axiosClient } from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { USER_HOME_LINK } from '../../router';
import { toast } from 'sonner'
import { useContext } from 'react';
import { authContext } from '../../contexts/AuthWrapper';

const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
});

function Login() {
    const userContext = useContext(authContext);

    const navigate = useNavigate()

    const { register, handleSubmit, formState } = useForm({ resolver: yupResolver(schema) });
    const { errors, isSubmitting } = formState;

    const submit = (data) => {
        axiosClient.post('/login', data)
            .then((response) => {
                userContext.setUser(response.data.user)
                userContext.setIsLoggedIn(true)
                localStorage.setItem('token', response.data.token)
                navigate(USER_HOME_LINK)
            })
            .catch(({ response }) => {
                toast.error(response.data.message);
            })
            .finally(() => {

            });
    }

    return (
        <>
            <form onSubmit={handleSubmit(submit)}>
                <div>
                    <input type="text" placeholder="email" {...register('email')} />
                    <p className='text-red-500'>{errors.email && errors.email.message}</p>
                </div>
                <div>
                    <input type="password" placeholder="password" {...register('password')} />
                    <p className='text-red-500'>{errors.password && errors.password.message}</p>
                </div>
                <button disabled={isSubmitting} className='px-3 py-1 bg-blue-600 text-white font-bold capitalize rounded' type="submit">
                    login
                </button>
            </form>
        </>
    );
}

export default Login;