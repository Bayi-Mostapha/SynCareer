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
import Stepper from '@/components/auth/Stepper';
import { Checkbox } from '@/components/ui/checkbox';

const schema = yup.object().shape({
    // section 1
    type: yup.string().required().oneOf(['user', 'company']),

    // section 2
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required("Last name is required"),
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),

    // section 3
    terms: yup.boolean().oneOf([true], 'You must accept the terms and conditions').required('Terms and conditions are required'),
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

            terms: false,
        },
    });
    const { register, control, handleSubmit, formState, trigger, watch } = form;
    const { touchedFields, errors, isValid, isSubmitting } = formState;
    const formData = watch();

    useEffect(() => {
        trigger();

        if (formData.type === 'company' && formStep === 2 && countries.length === 0) {
            fetchCountries();
        }
    }, [formStep])

    const submit = async (formData) => {
        try {
            const { data } = await axiosClient.post('/register', formData);
            toast.success(data.message);
            navigate(LOGIN_LINK);
        } catch (error) {
            console.log(error)
            const errorMessages = Object.entries(error.response.data.errors).flatMap(([field, messages]) =>
                messages.map((message) =>
                    <li key={message}>
                        <span className='font-semibold'>{field}:</span> {message}
                    </li>
                )
            );
            toast.error(<ul>{errorMessages}</ul>);
            setFormStep(0);
        }
    };


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

    const goToNext = () => {
        if (getSectionValidity(formStep)) {
            setFormStep(prev => {
                if (prev > 2)
                    return prev;
                return prev + 1;
            });
        }
    };

    const goToPrev = () => {
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
                    <Stepper formStep={formStep} />
                    {formStep === 0 && (
                        <section>
                            <h2 className='mb-3 font-semibold text-2xl'>Let's get started</h2>
                            <p className='mb-14 text-gray-500 text-sm'>Have an account? <Link to={LOGIN_LINK} className='text-primary'>Login</Link></p>

                            <div className="flex flex-col min-[450px]:flex-row gap-3">
                                <div className={`flex-1 py-5 sm:py-10 sm:px-6 px-3 border rounded-lg ${watch('type') === 'user' ? 'bg-[#F4F7FE] border-primary' : 'bg-white border-gray-400'}`}>
                                    <input id="user" type="radio" {...register('type')} value="user" />
                                    <label htmlFor="user" className={`text-sm ${watch('type') === 'user' ? 'text-primary' : 'text-black'}`}> I’m a candidate, looking for work</label>
                                </div>

                                <div className={`flex-1 py-5 sm:py-10 sm:px-6 px-3 border rounded-lg ${watch('type') === 'company' ? 'bg-[#F4F7FE] border-primary' : 'bg-white border-gray-400'}`}>
                                    <input id="company" type="radio" {...register('type')} value="company" />
                                    <label htmlFor="company" className={`text-sm ${watch('type') === 'company' ? 'text-primary' : 'text-black'}`}> I’m a recruiter, hiring for a position</label>
                                </div>
                            </div>
                            <p className="mt-1 text-destructive text-sm">{errors.type && errors.type.message}</p>
                        </section>
                    )
                    }

                    {
                        formStep === 1 && (
                            <section>
                                <div className="w-full grid grid-cols-1 min-[500px]:grid-cols-2 gap-2">
                                    <FormField
                                        control={control}
                                        name="first_name"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel className="text-black">First name</FormLabel>
                                                    <FormControl>
                                                        <Input type='text' {...field} />
                                                    </FormControl>
                                                    {touchedFields.first_name && <FormMessage />}
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
                                                    <FormLabel className="text-black">Last name</FormLabel>
                                                    <FormControl>
                                                        <Input type='text' {...field} />
                                                    </FormControl>
                                                    {touchedFields.last_name && <FormMessage />}
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
                                                <FormLabel className="text-black">Email</FormLabel>
                                                <FormControl>
                                                    <Input type='text' {...field} />
                                                </FormControl>
                                                {touchedFields.email && <FormMessage />}
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
                                                <FormLabel className="text-black">Password</FormLabel>
                                                <FormControl>
                                                    <PasswordInput className="pr-10" {...field} />
                                                </FormControl>
                                                {touchedFields.password && <FormMessage />}
                                            </FormItem>
                                        )
                                    }}
                                />
                            </section>
                        )
                    }

                    {
                        formStep === 2 &&
                        <section>
                            {
                                formData.type === 'user' ?
                                    <>
                                        <FormField
                                            control={control}
                                            name="job_title"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel className="text-black">Job title</FormLabel>
                                                        <FormControl>
                                                            <Input type='text' {...field} />
                                                        </FormControl>
                                                        {touchedFields.job_title && <FormMessage />}
                                                    </FormItem>
                                                )
                                            }}
                                        />
                                    </>
                                    :
                                    <>
                                        <FormField
                                            control={control}
                                            name="name"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem>
                                                        <FormLabel className="text-black">Company name</FormLabel>
                                                        <FormControl>
                                                            <Input type='text' {...field} />
                                                        </FormControl>
                                                        {touchedFields.name && <FormMessage />}
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
                                                        <FormLabel className="text-black">Company size</FormLabel>
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
                                                        {touchedFields.size && <FormMessage />}
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
                                                        <FormLabel className="text-black">Industry</FormLabel>
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
                                                        {touchedFields.industry && <FormMessage />}
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
                                                        <FormLabel className="text-black">Country</FormLabel>
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
                                                        {touchedFields.country && <FormMessage />}
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
                                                        <FormLabel className="text-black">City</FormLabel>
                                                        <FormControl>
                                                            <Input type='text' {...field} />
                                                        </FormControl>
                                                        {touchedFields.city && <FormMessage />}
                                                    </FormItem>
                                                )
                                            }}
                                        />
                                    </>
                            }
                            <FormField
                                control={form.control}
                                name="terms"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="mt-4 flex items-center gap-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel className="text-sm text-gray-500">
                                                I agree with SynCareer’s User Agreement and Privacy Policy.
                                            </FormLabel>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </section>
                    }

                    {/* buttons  */}
                    <div className="flex gap-4">

                        {
                            formStep > 0 && (
                                <Button className="p-5" type="button" variant="ghost" onClick={goToPrev}>Back</Button>
                            )
                        }
                        {
                            formStep === 0 && (
                                <Button className="py-5 w-full font-normal uppercase" type="button" variant="default" disabled={!getSectionValidity(formStep)} onClick={goToNext}>Get started <FaArrowRight className='ml-2' /></Button>
                            )
                        }
                        {
                            formStep === 1 && (
                                <Button className="p-5" type="button" variant="default" disabled={!getSectionValidity(formStep)} onClick={goToNext}>Next Step</Button>
                            )
                        }
                        {
                            formStep === 2 && (
                                <Button className="p-5" type="submit" variant="default" disabled={!isValid || isSubmitting} onClick={handleSubmit(submit)}>Create Account</Button>
                            )
                        }
                    </div>
                </form >
            </Form>
        </div>
    );
}

export default Register;