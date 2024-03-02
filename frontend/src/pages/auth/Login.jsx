import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
});

function Login() {
    const { register, handleSubmit, formState } = useForm({ resolver: yupResolver(schema) });
    const { errors, isSubmitting, isValid } = formState;

    function submit(data) {
        console.log(data)
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