import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { axiosClient } from '@/api/axios'
import { toast } from 'sonner'

import { useNavigate, useParams } from 'react-router-dom'
import { LOGIN_LINK } from '@/router'

// shadcn 
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import PasswordInput from '@/components/general/password-input'

const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
    token: yup.number("Code must be a number").integer("Code must be a number").required("Code is required"),
});

function ResetPassword() {
    const navigate = useNavigate()
    let { email } = useParams();

    const form = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email: email,
            password: '',
            token: '',
        }
    });
    const { formState, handleSubmit, control } = form;
    const { isSubmitting, isValid } = formState;

    const submit = async (data) => {
        try {
            const response = await axiosClient.post('/reset-password', data);
            toast.success(response.data.message)
            navigate(LOGIN_LINK);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };
    return (
        <div className="w-full flex flex-col justify-center items-center">
            <h2 className='text-center text-2xl font-semibold'>Reset password</h2>
            <p className='text-center mb-8 text-sm text-gray-700'>Enter your new password below</p>
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
                                        <Input disabled type='text' placeholder='Example@gmail.com' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }}
                    />
                    <FormField
                        control={form.control}
                        name="token"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Code</FormLabel>
                                <FormControl className="w-fit mx-auto">
                                    <InputOTP
                                        maxLength={6}
                                        render={({ slots }) => (
                                            <InputOTPGroup>
                                                {slots.map((slot, index) => (
                                                    <InputOTPSlot key={index} {...slot} />
                                                ))}
                                            </InputOTPGroup>
                                        )}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Please enter the code sent to your email.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="password"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <PasswordInput className="pr-10" placeholder="Your password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }}
                    />
                    <Button disabled={isSubmitting || !isValid} variant='default' type="submit" className='mt-4 flex gap-3 w-full mx-auto'>
                        Change Password
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default ResetPassword;