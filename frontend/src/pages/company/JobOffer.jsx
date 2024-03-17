import { Button } from "@/components/ui/button"
import { axiosClient } from '../../api/axios';
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

  
    const schema = yup.object().shape({
   
    job_title: yup.string().required(),
    location: yup.string().required(),
    workplace_type: yup.string().required(),
    workhours_type: yup.string().required(),
    exp_years: yup.number().required().integer(),  
    role_desc: yup.string().required(),
});

function JobOffer() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {
        try {
            // Make API call to post job offer data
            const response = await axiosClient.post('/joboffers', data);

            // Handle successful response
            console.log(response.data);
            toast.success('Job offer posted successfully!');
        } catch (error) {
            // Handle error
            console.error('Error posting job offer:', error);
            toast.error('Failed to post job offer. Please try again later.');
        }
    };

    return (  
        <>
            <Dialog>
                <DialogTrigger>
                    <Button className="" variant="default">Post Job</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Post a Job Offer</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input type="text" {...register("job_title")} placeholder="Job Title" />
                        {errors.job_title && <p>{errors.job_title.message}</p>}

                        <input type="text" {...register("location")} placeholder="Location" />
                        {errors.location && <p>{errors.location.message}</p>}

                        <input type="text" {...register("workplace_type")} placeholder="Workplace Type" />
                        {errors.workplace_type && <p>{errors.workplace_type.message}</p>}

                        <input type="text" {...register("workhours_type")} placeholder="Workhours Type" />
                        {errors.workhours_type && <p>{errors.workhours_type.message}</p>}

                        <input type="number" {...register("exp_years")} placeholder="Years of Experience" />
                        {errors.exp_years && <p>{errors.exp_years.message}</p>}

                        <textarea {...register("role_desc")} placeholder="Role Description" />
                        {errors.role_desc && <p>{errors.role_desc.message}</p>}

                        <Button type="submit">Submit</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default JobOffer;