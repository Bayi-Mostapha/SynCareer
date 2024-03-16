import { axiosClient } from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'sonner'

import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RESET_PASSWORD_BASE_LINK } from '@/router'

const schema = yup.object().shape({
    email: yup.string().email().required(),
});

function ForgotPassword() {
    const navigate = useNavigate()
    const form = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email: '',
        }
    });
    const { formState, handleSubmit, control } = form;
    const { isSubmitting, isValid } = formState;

    const submit = async (data) => {
        try {
            const response = await axiosClient.post('/forgot-password', data);
            toast.success(response.data.message)
            navigate(`${RESET_PASSWORD_BASE_LINK}/${data.email}`);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };
    return (
        <div className="w-full flex flex-col justify-center items-center">
            <h2 className='text-center text-2xl font-semibold'>Forgot password?</h2>
            <p className='text-center mb-8 text-sm text-gray-700'>Enter your email below</p>
            <Form {...form}>
                <form className='w-full sm:w-96 px-10 sm:p-0 flex flex-col gap-2' onSubmit={handleSubmit(submit)}>
                    <FormField
                        control={control}
                        name="email"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type='text' placeholder='Example@gmail.com' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }}
                    />
                    <Button disabled={isSubmitting || !isValid} variant='default' type="submit" className='mt-4 flex gap-3 w-full mx-auto'>
                        Send Email
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default ForgotPassword;