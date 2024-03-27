import { useCallback, useContext, useState } from 'react';
import { authContext } from '../../contexts/AuthWrapper';
import { axiosClient } from '../../api/axios';
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'sonner'
import { useDropzone } from 'react-dropzone'
// shadcn 
import DnDFile from "@/components/general/dnd-file";
import { SlPicture } from "react-icons/sl";
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import UserPaddedContent from '@/components/user/padded-content';

function ProfilePage() {
    const [image, setImage] = useState(null);
    const { user } = useContext(authContext);
    const form = useForm({
        //resolver: yupResolver(schema),
        defaultValues: {
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            job_title: user.job_title || "",
            email: user.email || "",
            phone_number: user.phone_number || "",
            birthday: user.birthday || "",
            bio: user.bio || "",
        }
    });
    const { handleSubmit, control } = form;

    const onDrop = useCallback(acceptedFiles => {
        if (!acceptedFiles[0]) {
            toast.error('Please upload an image')
            return;
        } setImage(acceptedFiles[0])
    }, [])
    const dropZone = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png']
        }
    })

    const submit = async (data) => {
        if (image) {
            const formData = new FormData();
            formData.append('picture', image, image.path);
            try {
                const response = await axiosClient.post('/profile-picture', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log(response);
            } catch (error) {
                console.error(error);
            }
        }

        try {
            const response = await axiosClient.put('/profile', data);
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <UserPaddedContent>
            <Form {...form}>
                <form className='w-full sm:w-96 px-10 sm:p-0 flex flex-col gap-2' onSubmit={handleSubmit(submit)} >
                    <DnDFile {...dropZone} file='picture' icon={<SlPicture className="text-8xl text-gray-400" />} />
                    <FormField
                        control={control}
                        name="first_name"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input className="pr-10" placeholder="" {...field} />
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
                                        <Input className="pr-10" placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }}
                    />

                    <FormField
                        control={control}
                        name="job_title"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Job Title</FormLabel>
                                    <FormControl>
                                        <Input className="pr-10" placeholder="" {...field} />
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
                                        <Input className="pr-10" placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }}
                    />

                    <FormField
                        control={control}
                        name="phone_number"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input className="pr-10" placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }}
                    />

                    <FormField
                        control={control}
                        name="birthday"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Birthday</FormLabel>
                                    <FormControl>
                                        <Input className="pr-10" placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }}
                    />
                    <FormField
                        control={control}
                        name="bio"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea className="pr-10" placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }}
                    />
                    <Button variant='default' type="submit" className='mt-4 flex gap-3 w-full mx-auto'>
                        Save
                    </Button>
                </form>
            </Form>
        </UserPaddedContent>
    );
}

export default ProfilePage;