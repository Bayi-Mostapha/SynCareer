import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { axiosClient } from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { USER_HOME_LINK } from '../../router';
import { toast } from 'sonner'
import { useContext } from 'react';
import { authContext } from '../../contexts/AuthWrapper';
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FaArrowRight } from "react-icons/fa";

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
        <div className="w-full flex justify-center items-center">
            <div className="w-fit h-fit">
                <h2 className='mb-5 text-xl font-bold'>Log In</h2>
                <form className='w-96 flex flex-col gap-2' onSubmit={handleSubmit(submit)}>
                    <Label htmlFor='email'>Email address</Label>
                    <Input id='email' type='text' name='email' placeholder='Example@gmail.com' register={register} />
                    <p className='text-red-500'>{errors.email && errors.email.message}</p>

                    <Label htmlFor='password'>Password</Label>
                    <Input id='password' type='password' name='password' placeholder='Your password' register={register} />
                    <p className='text-red-500'>{errors.password && errors.password.message}</p>

                    <Button disabled={isSubmitting} variant='default' className='flex gap-3 w-full mx-auto' type="submit">
                        Login
                        <FaArrowRight />
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default Login;