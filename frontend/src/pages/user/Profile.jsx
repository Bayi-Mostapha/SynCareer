import { useCallback, useContext, useState } from 'react';
import { authContext } from '../../contexts/AuthWrapper';
import { axiosClient } from '../../api/axios';
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'sonner'
import { useDropzone } from 'react-dropzone'
// routing
import { Link, useNavigate } from 'react-router-dom';
import { FORGOT_PASSWORD_LINK, REGISTER_LINK, USER_HOME_LINK } from '../../router';

// icons 
import { FaArrowRight } from "react-icons/fa";

// shadcn 
import DnDFile from "@/components/general/dnd-file";
import { SlPicture } from "react-icons/sl";
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';


function ProfilePage (){
    const [image, setImage] = useState(null);
   
    const onDrop = useCallback(acceptedFiles => {
        if (!acceptedFiles[0]) {
            toast.error('Please upload an image')
            return;
        }setImage(acceptedFiles[0])
    }, [])
    const dropZone = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png']
        }
    })
    const {
        user,
    } = useContext(authContext);

    const userContext = useContext(authContext);

    const navigate = useNavigate()

    const form = useForm({
       //resolver: yupResolver(schema),
        defaultValues: {
            first_name: user.first_name,
            last_name: user.last_name,
            job_title: user.job_title,
            email: user.email,
            phone_number: user.phone_number,
            birthday: user.birthday,
            bio: user.bio,
        }
    });
    const { formState, handleSubmit, control } = form;

    function dataURItoBlob(dataURI) {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    }

    const submit = async (data) => {
        try {
            let newData = { ...data }; // Make a copy of the form data
    
            if (image) { // Check if an image file is selected
                // Convert the image file to a Blob synchronously
                const dataUrl = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(image);
                });
                const blob = dataURItoBlob(dataUrl);
                newData = { ...newData, picture: blob }; // Add the Blob to the form data
            }
    
            // Send the request with Axios
            const response = await axiosClient.put('/profile', newData);
    
            // Check if the request was successful
            if (response.status === 200) {
                // If successful, display a success message to the user
                toast.success('Profile updated successfully');
            } else {
                // If there was an error, display an error message to the user
                toast.error('Failed to update profile. Please try again later.');
            }
        } catch (error) {
            // If there was an error, display an error message to the user
            if (error.response && error.response.status === 422) {
                // Handle validation errors
                // You can access error.response.data.errors to get specific validation errors
                toast.error('Validation error. Please check your inputs.');
            } else if (error.response && error.response.status === 500) {
                // Handle server errors
                toast.error('Failed to update profile due to server error. Please try again later.');
            } else {
                // Handle other errors
                toast.error('Failed to update profile. Please try again later.');
            }
            console.error('Error updating profile:', error);
        }
    };
    
    
    

    

    return (
       <>
       
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
                    <Button  variant='default' type="submit" className='mt-4 flex gap-3 w-full mx-auto'>
                        Save
                    </Button>
                </form>
            </Form>
       </>
    );
}

export default ProfilePage ;