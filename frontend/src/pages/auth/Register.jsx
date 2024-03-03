import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { axiosClient } from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { LOGIN_LINK } from '../../router';
import { toast } from 'sonner';
import { useContext } from 'react';
import { authContext } from '../../contexts/AuthWrapper';

const schema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
    password_confirmation: yup.string().min(8).required(),
});

function Register() {
    const userContext = useContext(authContext);

    const navigate = useNavigate();
    const { register, setError, handleSubmit, formState } = useForm({ resolver: yupResolver(schema) });
    const { errors, isSubmitting } = formState;

    const submit = (data) => {
        axiosClient.post('/register', data)
            .then(({ data }) => {
                toast.success(data.message)
                navigate(LOGIN_LINK)
            })
            .catch(({ response }) => {
                const responseErrors = response.data.errors;
                Object.keys(responseErrors).forEach(key => {
                    setError(key, { message: responseErrors[key].join(' ') });
                });
            })
            .finally(() => {

            });
    }

    return (
        <>
            {
                userContext.isFetchingUser ?
                    <p>loading...</p>
                    :
                    <form onSubmit={handleSubmit(submit)}>
                        <div>
                            <input type="text" placeholder="name" {...register('name')} />
                            <p className='text-red-500'>{errors.name && errors.name.message}</p>
                        </div>
                        <div>
                            <input type="text" placeholder="email" {...register('email')} />
                            <p className='text-red-500'>{errors.email && errors.email.message}</p>
                        </div>
                        <div>
                            <input type="password" placeholder="password" {...register('password')} />
                            <p className='text-red-500'>{errors.password && errors.password.message}</p>
                        </div>
                        <div>
                            <input type="password" placeholder="confirm password" {...register('password_confirmation')} />
                            <p className='text-red-500'>{errors.password_confirmation && errors.password_confirmation.message}</p>
                        </div>
                        <button disabled={isSubmitting} className='px-3 py-1 bg-blue-600 text-white font-bold capitalize rounded' type="submit">
                            Register
                        </button>
                    </form>
            }
        </>
    );
}

export default Register;