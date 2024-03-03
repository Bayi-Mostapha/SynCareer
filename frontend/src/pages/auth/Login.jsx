import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { axiosClient } from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { USER_HOME_LINK } from '../../router';
import { toast } from 'sonner'
import { useContext } from 'react';
import { authContext } from '../../contexts/AuthWrapper';
import InputGroup from '../../components/general/InputGroup';
import PrimaryBtn from '../../components/general/PrimaryBtn';

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
                userContext.setUser({ ...response.data.user, type: response.data.type });
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
            <div className="w-full flex justify-center items-center">
                <form className='w-96 flex flex-col gap-2' onSubmit={handleSubmit(submit)}>
                    <InputGroup label='Email' name='email' type='text' placeholder='' register={register} />
                    <p className='text-red-500'>{errors.email && errors.email.message}</p>

                    <InputGroup label='Password' name='password' type='password' placeholder='' register={register} />
                    <p className='text-red-500'>{errors.password && errors.password.message}</p>

                    <PrimaryBtn className='mx-auto' type="submit" body="Login" disabled={isSubmitting} />
                </form>
            </div>
        </>
    );
}

export default Login;