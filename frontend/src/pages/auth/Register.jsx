import { useState, useEffect } from 'react';
// api 
import { axiosClient } from '../../api/axios';
// form 
import { useForm, useController } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// routing 
import { Link, useNavigate } from 'react-router-dom';
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
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { industries } from '@/api/industries';
import PasswordInput from '@/components/general/password-input';

const schema = yup.object().shape({
    // section 1
    type: yup.string().required(),

    // section 2
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),

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

    const form = useForm({
        mode: 'all',
        resolver: yupResolver(schema),
        defaultValues: {
            type: 'user',

            first_name: '',
            last_name: '',
            email: '',
            password: '',

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
    const { register, control, setError, handleSubmit, formState, trigger, watch } = form;
    const { errors } = formState;
    const formData = watch();

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
                    } else if (key === 'first_name' || key === 'last_name' || key === 'email' || key === 'password') {
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
                return !errors.first_name && !errors.last_name && !errors.email && !errors.password;
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
            const response = await axios.get("https://countriesnow.space/api/v0.1/countries/iso");
            setCountries(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="w-full h-screen flex justify-center items-center">
            <Form {...form}>
                <form className='px-8 sm:p-0 flex flex-col justify-around w-full sm:w-[450px] h-full'>
                    {formStep === 0 && (
                        <section>
                            <h2 className='mb-3 font-semibold text-2xl'>Let's get started</h2>
                            <p className='mb-14 text-gray-500 text-sm'>Have an account? <Link to={LOGIN_LINK} className='text-primary'>Login</Link></p>

                            <div className="flex gap-3">
                                <div className={`flex-1 py-10 px-6 border rounded-lg ${watch('type') === 'user' ? 'bg-[#F4F7FE] border-primary' : 'bg-white border-gray-400'}`}>
                                    <input id="user" type="radio" {...register('type')} value="user" />
                                    <label htmlFor="user" className={`text-sm ${watch('type') === 'user' ? 'text-primary' : 'text-black'}`}> I’m a candidate,<br /> looking for work</label>
                                </div>

                                <div className={`flex-1 py-10 px-6 border rounded-lg ${watch('type') === 'company' ? 'bg-[#F4F7FE] border-primary' : 'bg-white border-gray-400'}`}>
                                    <input id="company" type="radio" {...register('type')} value="company" />
                                    <label htmlFor="company" className={`text-sm ${watch('type') === 'company' ? 'text-primary' : 'text-black'}`}> I’m a recruiter,<br /> hiring for a position</label>
                                </div>
                            </div>
                            <p className="mt-1 text-red-500 text-sm">{errors.type && errors.type.message}</p>
                        </section>
                    )
                    }

                    {
                        formStep === 1 && (
                            <section>
                                <div className="flex gap-2">
                                    <FormField
                                        control={control}
                                        name="first_name"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>First name</FormLabel>
                                                    <FormControl>
                                                        <Input type='text' {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )
                                        }}
                                    />
                                    <FormField
                                        control={control}
                                        name="last_name"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Last name</FormLabel>
                                                    <FormControl>
                                                        <Input type='text' {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )
                                        }}
                                    />
                                </div>
                                <FormField
                                    control={control}
                                    name="email"
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type='text' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    }}
                                />
                                <FormField
                                    control={control}
                                    name="password"
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <PasswordInput className="pr-10" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    }}
                                />
                            </section>
                        )
                    }

                    {
                        formStep === 2 &&
                        (
                            formData.type === 'user' ?
                                <section>
                                    <FormField
                                        control={control}
                                        name="job_title"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Job title</FormLabel>
                                                    <FormControl>
                                                        <Input type='text' {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )
                                        }}
                                    />
                                </section>
                                :
                                <section>
                                    <FormField
                                        control={control}
                                        name="name"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Company name</FormLabel>
                                                    <FormControl>
                                                        <Input type='text' {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )
                                        }}
                                    />

                                    <FormField
                                        control={control}
                                        name="size"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Company size</FormLabel>
                                                    <Select onValueChange={field.onChange}>
                                                        <FormControl>
                                                            <SelectTrigger className="p-5">
                                                                <SelectValue placeholder="select a size" />
                                                            </SelectTrigger>

                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="1-9">1 to 9 employees</SelectItem>
                                                            <SelectItem value="10-49">10 to 49 employees</SelectItem>
                                                            <SelectItem value="50-249">50 to 249 employees</SelectItem>
                                                            <SelectItem value="250+">More than 250 employees</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )
                                        }}
                                    />

                                    <FormField
                                        control={control}
                                        name="industry"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Industry</FormLabel>
                                                    <Select onValueChange={field.onChange}>
                                                        <FormControl>
                                                            <SelectTrigger className="p-5">
                                                                <SelectValue placeholder="select an industry" />
                                                            </SelectTrigger>

                                                        </FormControl>
                                                        <SelectContent className="h-52">
                                                            {industries.map(industry => {
                                                                return <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                                                            })}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )
                                        }}
                                    />

                                    <FormField
                                        control={control}
                                        name="country"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Country</FormLabel>
                                                    <Select onValueChange={field.onChange}>
                                                        <FormControl>
                                                            <SelectTrigger className="p-5">
                                                                <SelectValue placeholder="select a country" />
                                                            </SelectTrigger>

                                                        </FormControl>
                                                        <SelectContent className="h-52">
                                                            {countries.map(country => {
                                                                return <SelectItem key={country.Iso3} value={country.Iso3}>{country.name}</SelectItem>
                                                            })}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )
                                        }}
                                    />

                                    <FormField
                                        control={control}
                                        name="city"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>City</FormLabel>
                                                    <FormControl>
                                                        <Input type='text' {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )
                                        }}
                                    />
                                </section>
                        )
                    }

                    {/* buttons  */}

                    <div className="flex gap-4">

                        {
                            formStep > 0 && (
                                <Button type="button" variant="ghost" onClick={goToPrev}>Back</Button>
                            )
                        }
                        {
                            formStep === 0 && (
                                <Button className="w-full" type="button" variant="default" disabled={!getSectionValidity(formStep)} onClick={goToNext}>Get started <FaArrowRight className='ml-2' /></Button>
                            )
                        }
                        {
                            formStep === 1 && (
                                <Button type="button" variant="default" disabled={!getSectionValidity(formStep)} onClick={goToNext}>Next Step</Button>
                            )
                        }
                        {
                            formStep === 2 && (
                                <Button type="submit" variant="default" disabled={!getSectionValidity(formStep)} onClick={handleSubmit(submit)}>Create Account</Button>
                            )
                        }
                    </div>
                </form >
            </Form>
        </div>
    );
}

export default Register;