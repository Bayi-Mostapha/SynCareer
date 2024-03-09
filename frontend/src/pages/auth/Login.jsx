import { useContext } from 'react';
import { authContext } from '../../contexts/AuthWrapper';
import { axiosClient } from '../../api/axios';
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'sonner'

// routing
import { Link, useNavigate } from 'react-router-dom';
import { REGISTER_LINK, USER_HOME_LINK } from '../../router';

// icons 
import { FaArrowRight } from "react-icons/fa";

// shadcn 
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';

const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
});

function Login() {
    const userContext = useContext(authContext);

    const navigate = useNavigate()

    const form = useForm({ resolver: yupResolver(schema) });
    const { register, handleSubmit, formState } = form;
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
                <h2 className='text-center text-2xl font-semibold'>Welcome back</h2>
                <p className='text-center mb-8 text-sm text-gray-700'>Enter your account details below</p>
                <form className='w-96 flex flex-col gap-2' onSubmit={handleSubmit(submit)}>
                    <Label htmlFor='email'>Email address</Label>
                    <Input id='email' type='text' name='email' placeholder='Example@gmail.com' register={register} />
                    <p className='text-red-500'>{errors.email && errors.email.message}</p>

                    <Label htmlFor='password'>Password</Label>
                    <Input id='password' type='password' name='password' placeholder='Your password' register={register} />
                    <p className='text-red-500'>{errors.password && errors.password.message}</p>

                    <div className="flex justify-between items-center">
                        <div className='flex items-center gap-2'>
                            <Checkbox id="remember" />
                            <Label htmlFor="remember">
                                Remember me
                            </Label>
                        </div>
                        <Link to='' className='text-primary text-sm font-medium'>Forgot passsword</Link>
                    </div>

                    <Button disabled={isSubmitting} variant='default' className='mt-4 flex gap-3 w-full mx-auto' type="submit">
                        Login
                        <FaArrowRight />
                    </Button>
                </form>
                <div className='mt-8 flex justify-center items-center gap-2'>
                    <p className='text-center text-gray-700'>Don't have an account?</p>
                    <Link to={REGISTER_LINK} className='text-primary font-medium'>Register</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;