import { axiosClient } from '../../api/axios';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import DataTable from "@/components/general/data-table";
import { columns } from '@/components/company/job-offers-table/columns';
import { useEffect, useState } from 'react';
import CompanyPaddedContent from '@/components/company/padded-content';
import { MdOutlineFileUpload } from 'react-icons/md';
import { Label } from '@/components/ui/label';
import { FaRegTrashCan } from 'react-icons/fa6';
import { IoMdAddCircle } from 'react-icons/io';
import { Separator } from '@/components/ui/separator';

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
            job_title: '',
            location: '',
            workplace_type: '',
            workhours_type: '',
            exp_years: '',
            role_desc: '',
        }
    });
    const [jobOffers, setJobOffers] = useState([]);
    const [skills, setSkills] = useState(['skill'])
    const { formState, handleSubmit, control, reset } = form;
    const { isSubmitting, isValid } = formState;

    function addSkill() {
        setSkills(prev => [...prev, 'skill'])
    }
    const handleSkillChange = (index, e) => {
        const { value } = e.target;
        setSkills(prev => {
            const updatedSkills = [...prev];
            updatedSkills[index] = value;
            return updatedSkills
        });
    };
    const removeSkill = (index) => {
        setSkills(prev => {
            const updatedSkills = [...prev];
            updatedSkills.splice(index, 1);
            return updatedSkills;
        });
    };

    const onSubmit = async (data) => {
        try {
            data = { ...data, skills: skills }
            const response = await axiosClient.post('/joboffers', data);
            console.log(response.data);
            toast.success('Job offer posted successfully!');
            setSkills([])
            reset(); // Reset the form after successful submission
            fetchJobOffers();
        } catch (error) {
            console.error('Error posting job offer:', error);
            toast.error('Failed to post job offer. Please try again later.');
        }
    };

    const fetchJobOffers = async () => {
        try {
            const response = await axiosClient.get('joboffers');
            setJobOffers(response.data);
        } catch (error) {
            console.error('Error fetching job offers:', error);
        }
    };
    useEffect(() => {
        fetchJobOffers();
    }, []);

    return (
        <CompanyPaddedContent>
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-medium">Job Offers</h1>
                <Dialog>
                    <DialogTrigger>
                        <Button className="flex gap-2" variant="default">Post Job <MdOutlineFileUpload className='text-xl' /></Button>
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
                                    <Label className='block mt-6'>Skills</Label>
                                    {
                                        skills.map((skill, i) =>
                                            <div className='my-2 flex gap-3'>
                                                <Input
                                                    type="text"
                                                    value={skill}
                                                    onChange={(e) => handleSkillChange(i, e)}
                                                />
                                                <Button onClick={() => removeSkill(i)} variant='destructive' type='button'>
                                                    <FaRegTrashCan className='text-lg' />
                                                </Button>
                                            </div>
                                        )
                                    }
                                    <Button variant='outline' className='ml-auto flex gap-2' onClick={addSkill} type='button'>
                                        Add <IoMdAddCircle className='text-xl text-primary' />
                                    </Button>
                                </ScrollArea>
                                <Button disabled={isSubmitting} type="submit">Submit</Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
            <DataTable columns={columns} data={jobOffers} searchColumn={"job_title"} />
        </CompanyPaddedContent>
    );
}


export default JobOffer;
