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
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import DataTable from "@/components/general/data-table";
import { useEffect, useState } from 'react';
import { columns } from '@/components/super-admin/columns';


const schema = yup.object().shape({
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
});

function Admins() {
    const form = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
        }
    });
    const { formState, handleSubmit, control, reset } = form;
    const { isSubmitting, isValid } = formState;

    const onSubmit = async (data) => {
        try {
            const response = await axiosClient.post('/admins', data);
            toast.success(response.data.message);
            reset();
            fetchAdmins();
        } catch (error) {
            console.error('Error adding admin:', error);
            toast.error(error.response.data.message);
        }
    };

    const [admins, setAdmins] = useState([]);

    const fetchAdmins = async () => {
        try {
            const response = await axiosClient.get('/admins');
            setAdmins(response.data.admins);
        } catch (error) {
            console.error('Error fetching job offers:', error);
        }
    };
    useEffect(() => {
        fetchAdmins();
    }, []);

    return (
        <>
            <div className="flex justify-end">
                <Dialog>
                    <DialogTrigger>
                        <Button variant="default">Create Admin</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create a new admin</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <FormField
                                    control={control}
                                    name="first_name"
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>First Name</FormLabel>
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
                                                <FormLabel>Last Name</FormLabel>
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
                                                    <Input type='text' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    }}
                                />
                                <Button
                                    disabled={!isValid && isSubmitting}
                                    type="submit"
                                >
                                    Create
                                </Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
            <DataTable columns={columns} data={admins} searchColumn={"email"} />
        </>
    );
}
export default Admins;
