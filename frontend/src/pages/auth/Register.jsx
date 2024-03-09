import { useState, useEffect } from 'react';
// api 
import { axiosClient } from '../../api/axios';
// form 
import { useForm, useController } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// routing 
import { useNavigate } from 'react-router-dom';
import { LOGIN_LINK } from '../../router';
// toast Notification 
import { toast } from 'sonner';
// icons 
import { FaArrowRight } from "react-icons/fa";
//axios
import axios from 'axios';
// shadcn 
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const schema = yup.object().shape({
    // section 1
    type: yup.string().required(),

    // section 2
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
    password_confirmation: yup.string().test('passwords-match', 'Passwords must match', function (value) {
        return this.parent.password === value;
    }).required(),

    // section 3
    // user 
    job_title: yup.string(),
    // company 
    name: yup.string().test('name', 'company name is required', function (value) {
        return this.parent.type === 'company' ? (value !== '') : true;
    }),
    size: yup.string(),
    industry: yup.string(),
    country: yup.string().test('country', 'country is required', function (value) {
        return this.parent.type === 'company' ? (value !== '') : true;
    }),
    city: yup.string(),
});

function Register() {
    const navigate = useNavigate();

    const [formStep, setFormStep] = useState(0);
    const [countries, setCountries] = useState([]);

    const { register, control, setError, handleSubmit, formState, trigger, watch } = useForm({
        mode: 'all',
        resolver: yupResolver(schema),
        defaultValues: {
            type: 'user',

            first_name: '',
            last_name: '',
            email: '',
            password: '',
            password_confirmation: '',

            // user 
            job_title: '',

            // company
            name: '',
            size: '',
            industry: '',
            country: '',
            city: '',

        },
    });
    const { errors } = formState;
    const formData = watch();

    const { field } = useController({ name: 'country', control })

    function handleSelectChange(option) {
        field.onChange(option)
    }

    useEffect(() => {
        trigger();

        if (formData.type === 'company' && formStep === 2 && countries.length === 0) {
            fetchCountries();
        }
    }, [formStep, formData.type])

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
                    } else if (key === 'first_name' || key === 'last_name' || key === 'email' || key === 'password' || key === 'password_confirmation') {
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
                return !errors.first_name && !errors.last_name && !errors.email && !errors.password && !errors.password_confirmation;
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

    const fetchCountries = async () => {
        try {
            const response = await axios.get("https://restcountries.com/v3.1/all");
            setCountries(response.data.sort((a, b) => {
                return a.name.common.localeCompare(b.name.common);
            }));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="w-full h-screen flex justify-center items-center">
            <form className='py-16 flex flex-col w-fit h-full'>
                {formStep === 0 && (
                    <section className='flex-1'>
                        <h2>Let's get started</h2>

                        <div className="flex gap-3">
                            <div className={`py-10 px-6 border rounded-lg ${watch('type') === 'user' ? 'bg-[#F4F7FE] border-primary' : 'bg-white border-gray-400'}`}>
                                <input id="user" type="radio" {...register('type')} value="user" />
                                <label htmlFor="user" className={`text-sm ${watch('type') === 'user' ? 'text-primary' : 'text-black'}`}> I’m a candidate,<br /> looking for work</label>
                            </div>

                            <div className={`py-10 px-6 border rounded-lg ${watch('type') === 'company' ? 'bg-[#F4F7FE] border-primary' : 'bg-white border-gray-400'}`}>
                                <input id="company" type="radio" {...register('type')} value="company" />
                                <label htmlFor="company" className={`text-sm ${watch('type') === 'company' ? 'text-primary' : 'text-black'}`}> I’m a recruiter,<br /> hiring for a position</label>
                            </div>
                        </div>
                        <p className="text-red-500">{errors.type && errors.type.message}</p>
                    </section>
                )
                }

                {
                    formStep === 1 && (
                        <section className='flex-1'>
                            <div>
                                <input type="text" placeholder="last name" {...register('first_name')} />
                                <p className="text-red-500">{errors.first_name && errors.first_name.message}</p>
                            </div>
                            <div>
                                <input type="text" placeholder="name" {...register('last_name')} />
                                <p className="text-red-500">{errors.last_name && errors.last_name.message}</p>
                            </div>
                            <div>
                                <input type="text" placeholder="email" {...register('email')} />
                                <p className="text-red-500">{errors.email && errors.email.message}</p>
                            </div>
                            <div>
                                <input type="password" placeholder="password" {...register('password')} />
                                <p className="text-red-500">{errors.password && errors.password.message}</p>
                            </div>
                            <div>
                                <input type="password" placeholder="confirm password" {...register('password_confirmation')} />
                                <p className="text-red-500">{errors.password_confirmation && errors.password_confirmation.message}</p>
                            </div>
                        </section>
                    )
                }

                {
                    formStep === 2 &&
                    (
                        formData.type === 'user' ?
                            <section className='flex-1'>
                                <div>
                                    <input type="text" placeholder="current job title" {...register('job_title')} />
                                    <p className="text-red-500">{errors.job_title && errors.job_title.message}</p>
                                </div>
                            </section>
                            :
                            <section className='flex-1'>
                                <div>
                                    <input type="text" placeholder="company name" {...register('name')} />
                                    <p className="text-red-500">{errors.name && errors.name.message}</p>
                                </div>
                                <div>
                                    <input type="text" placeholder="company size" {...register('size')} />
                                    <p className="text-red-500">{errors.size && errors.size.message}</p>
                                </div>
                                <div>
                                    <input type="text" placeholder="industry" {...register('industry')} />
                                    <p className="text-red-500">{errors.industry && errors.industry.message}</p>
                                </div>

                                {JSON.stringify(watch('country'))}
                                <div>
                                    {/* <select {...register('country')}>
                                        {countries.map((country, index) => (
                                            <option key={index} value={country.cioc}>{country.name.common}</option>
                                        ))}
                                    </select> */}
                                    <Select value={field.value} onValueChange={handleSelectChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="select a country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {countries.map((country, index) => {
                                                return <SelectItem key={index} value={country.name.common}>{country.name.common}</SelectItem>
                                            })}
                                        </SelectContent>
                                    </Select>

                                    <p className="text-red-500">{errors.country && errors.country.message}</p>
                                </div>
                                <div>
                                    <input type="text" placeholder="city" {...register('city')} />
                                    <p className="text-red-500">{errors.city && errors.city.message}</p>
                                </div>
                            </section>
                    )
                }

                {/* buttons  */}

                {
                    formStep > 0 && (
                        <button onClick={goToPrev} className="px-3 py-1 text-gray-600 font-semibold capitalize" type="button">
                            Back
                        </button>
                    )
                }
                {
                    formStep === 0 && (
                        <button disabled={!getSectionValidity(formStep)} onClick={goToNext} className=" px-3 py-2 uppercase w-full flex justify-center items-center gap-2 bg-blue-600 text-white rounded" type="button">
                            Get started <FaArrowRight />
                        </button>
                    )
                }
                {
                    formStep === 1 && (
                        <button disabled={!getSectionValidity(formStep)} onClick={goToNext} className="px-3 py-1 bg-blue-600 text-white font-bold capitalize rounded" type="button">
                            Next Step
                        </button>
                    )
                }
                {
                    formStep === 2 && (
                        <button disabled={!getSectionValidity(formStep)} onClick={handleSubmit(submit)} className="px-3 py-1 bg-blue-600 text-white font-bold capitalize rounded" type="submit">
                            Create Account
                        </button>
                    )
                }
            </form >
        </div>
    );
}

export default Register;