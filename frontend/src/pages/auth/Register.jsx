import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGIN_LINK } from '../../router';
import { axiosClient } from '../../api/axios';
import { toast } from 'sonner';

const schema = yup.object().shape({
    type: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
    password_confirmation: yup.string().test('passwords-match', 'Passwords must match', function (value) {
        return this.parent.password === value;
    }).required(),
    name: yup.string().required(),
});

function Register() {
    const navigate = useNavigate();

    const [formStep, setFormStep] = useState(0);

    const { register, setError, handleSubmit, formState, trigger, watch } = useForm({
        mode: 'all',
        resolver: yupResolver(schema),
        defaultValues: {
            type: 'user',
            email: '',
            password: '',
            password_confirmation: '',
            name: ''
        },
    });
    const { errors, touchedFields } = formState;
    const formData = watch();

    useEffect(() => {
        trigger();
    }, [])

    const submit = (formData) => {
        axiosClient.post('/register', formData)
            .then(({ data }) => {
                toast.success(data.message)
                navigate(LOGIN_LINK)
            })
            .catch(({ response }) => {
                const responseErrors = response.data.errors;
                Object.keys(responseErrors).forEach(key => {
                    setError(key, { message: responseErrors[key].join(' ') });
                    if (key === 'type') {
                        setFormStep(0);
                    } else if (key === 'email' || key === 'password' || key === 'password_confirmation') {
                        setFormStep(1);
                    } else {
                        setFormStep(2);
                    }
                });
            })
            .finally(() => {

            });
    }

    const getSectionValidity = (step) => {
        switch (step) {
            case 0:
                return !errors.type;
            case 1:
                return !errors.email && !errors.password && !errors.password_confirmation;
            case 2:
                return !errors.name;
            default:
                return false;
        }
    };

    const goToNext = (e) => {
        e.preventDefault();
        if (getSectionValidity(formStep)) {
            setFormStep(prev => {
                if (prev > 2)
                    return prev;
                return prev + 1;
            });
        }
    };

    const goToPrev = (e) => {
        e.preventDefault();
        setFormStep((prev) => {
            if (prev <= 0) return prev;
            return prev - 1;
        });
    };

    return (
        <form>
            {formStep === 0 && (
                <section>
                    <h2>type</h2>
                    <input id="user" type="radio" {...register('type')} value="user" />
                    <label htmlFor="user">user</label>

                    <input id="company" type="radio" {...register('type')} value="company" />
                    <label htmlFor="company">company</label>

                    <p className="text-red-500">{touchedFields.type && errors.type && errors.type.message}</p>
                </section>
            )}

            {formStep === 1 && (
                <section>
                    <h2>credentials</h2>
                    <div>
                        <input type="text" placeholder="email" {...register('email')} />
                        <p className="text-red-500">{touchedFields.email && errors.email && errors.email.message}</p>
                    </div>
                    <div>
                        <input type="password" placeholder="password" {...register('password')} />
                        <p className="text-red-500">{touchedFields.password && errors.password && errors.password.message}</p>
                    </div>
                    <div>
                        <input type="password" placeholder="confirm password" {...register('password_confirmation')} />
                        <p className="text-red-500">{touchedFields.password_confirmation && errors.password_confirmation && errors.password_confirmation.message}</p>
                    </div>
                </section>
            )}

            {formStep === 2 &&
                (
                    formData.type === 'user' ?
                        <section>
                            <h2>details</h2>
                            <div>
                                <input type="text" placeholder="user name" {...register('name')} />
                                <p className="text-red-500">{touchedFields.name && errors.name && errors.name.message}</p>
                            </div>
                        </section>
                        :
                        <section>
                            <h2>details</h2>
                            <div>
                                <input type="text" placeholder="company name" {...register('name')} />
                                <p className="text-red-500">{touchedFields.name && errors.name && errors.name.message}</p>
                            </div>
                        </section>
                )
            }

            {formStep > 0 && (
                <button onClick={goToPrev} className="px-3 py-1 text-gray-600 font-semibold capitalize" type="button">
                    back
                </button>
            )}
            {formStep === 2 ? (
                <button disabled={!getSectionValidity(formStep)} onClick={handleSubmit(submit)} className="px-3 py-1 bg-blue-600 text-white font-bold capitalize rounded" type="submit">
                    Register
                </button>
            ) : (
                <button disabled={!getSectionValidity(formStep)} onClick={goToNext} className="px-3 py-1 bg-blue-600 text-white font-bold capitalize rounded" type="button">
                    next
                </button>
            )}
        </form>
    );
}

export default Register;