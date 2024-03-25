import { axiosClient } from '../../api/axios';
// form 
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
// sonner 
import { toast } from 'sonner'
// shadcn 
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// table 
import DataTable from "@/components/general/data-table";
import { columns } from '@/components/company/job-offers-table/columns';
import { useEffect, useState } from 'react';

const schema = yup.object().shape({
    job_title: yup.string().required(),
    location: yup.string().required(),
    workplace_type: yup.string().required(),
    workhours_type: yup.string().required(),
    exp_years: yup.number().required().integer(),
    role_desc: yup.string().required(),
});

function JobOffer() {
    const form = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email: '',
            password: '',
        }
    });
    const { formState, handleSubmit, control } = form;
    const { isSubmitting, isValid } = formState;

    

    const onSubmit = async (data) => {
        try {
            const response = await axiosClient.post('/joboffers', data);
            console.log(response.data);
            toast.success('Job offer posted successfully!');
        } catch (error) {
            console.error('Error posting job offer:', error);
            toast.error('Failed to post job offer. Please try again later.');
        }
    };


    const [jobOffers, setJobOffers] = useState([]);

    useEffect(() => {
        const fetchJobOffers = async () => {
            try {
                const response = await axiosClient.get('joboffers');
                setJobOffers(response.data);
            } catch (error) {
                console.error('Error fetching job offers:', error);
            }
        };

        fetchJobOffers();
    }, []);
  
    
   

    return (
        <>
            <div className="flex justify-end">
                <Dialog>
                    <DialogTrigger>
                        <Button variant="default">Post Job</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Post a Job Offer</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <ScrollArea className="h-[400px] p-5">
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
                                    <FormField
                                        control={control}
                                        name="location"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Location</FormLabel>
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
                                        name="workplace_type"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Workplace type</FormLabel>
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
                                        name="workhours_type"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Workhours type</FormLabel>
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
                                        name="exp_years"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Experience years</FormLabel>
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
                                        name="role_desc"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Role description</FormLabel>
                                                    <FormControl>
                                                        <Textarea {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )
                                        }}
                                    />
                                </ScrollArea>
                                <Button disabled={isSubmitting} type="submit">Submit</Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
            <DataTable columns={columns} data={jobOffers} searchColumn={"job_title"} />
        </>
    );
}

export default JobOffer;