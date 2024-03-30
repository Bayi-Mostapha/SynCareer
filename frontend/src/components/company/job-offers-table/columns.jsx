import React, { useState } from 'react';
import { Form, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  
import { JOBOFFER_LINK_BASE } from '@/router';
import { BsThreeDots } from 'react-icons/bs';
import { IoIosArrowDown } from 'react-icons/io';
import { toast } from 'sonner';
import { axiosClient } from '@/api/axios';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import * as yup from 'yup';
import { Input } from 'postcss';
import { Textarea } from '@/components/ui/textarea';


// Define Yup schema for form validation
const schema = yup.object().shape({
    job_title: yup.string().required('Job title is required'),
    location: yup.string().required('Location is required'),
    workplace_type: yup.string().required('Workplace type is required'),
    workhours_type: yup.string().required('Workhours type is required'),
    exp_years: yup.number().required('Years of experience is required').integer('Years of experience must be an integer'),
    // Add validation rules for other fields as needed
  });
  
  const handleDelete = async (jobOfferId) => {
      try {
          await axiosClient.delete(`/joboffers/${jobOfferId}`);
          // If successful, update jobOffers state to reflect the deletion
          toast.success('Job offer deleted successfully');
      } catch (error) {
          console.error('Error deleting job offer:', error);
          toast.error('Failed to delete job offer. Please try again later.');
      }
  };

  
export const columns = [
    {
        accessorKey: 'id',
        header: 'Id',
    },
    {
        accessorKey: 'job_title',
        header: ({ column }) => {
            return (
                <Button
                    className="flex gap-2"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Job Title <IoIosArrowDown />
                </Button>
            );
        },
    },
    {
        accessorKey: 'location',
        header: 'Location',
    },
    {
        accessorKey: 'workplace_type',
        header: 'Workplace Type',
    },
    {
        accessorKey: 'workhours_type',
        header: 'Workhours ',
    },
    {
        accessorKey: 'exp_years',
        header: 'Years of Experience',
    },
    {
        id: 'actions',
        accessorKey: 'action',
        header: 'Action',
        cell: ({ row }) => {
            const jobOffer = row.original;
            const { formState, handleSubmit, control, reset } = useForm({
                resolver: yupResolver(schema),
                defaultValues: {
                    job_title: jobOffer.job_title,
                    location: jobOffer.location,
                    workplace_type: jobOffer.workplace_type,
                    workhours_type: jobOffer.workhours_type,
                    exp_years: jobOffer.exp_years,
                    // Set default values for other fields
                },
            });

            const onUpdate = async (data) => {
                try {
                    // Make API call to update job offer
                    const response = await axiosClient.put(`/joboffers/${jobOffer.id}`, data);
                    console.log(response.data);
                    toast.success('Job offer updated successfully');
                    // Optionally, you can reset the form after successful submission
                    reset();
                } catch (error) {
                    console.error('Error updating job offer:', error);
                    toast.error('Failed to update job offer. Please try again later.');
                }
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="p-0 text-gray-400 hover:bg-transparent">
                            <BsThreeDots />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                            <Link to={`${JOBOFFER_LINK_BASE}/${jobOffer.id}`}>View Candidates</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(jobOffer.id)}>Delete</DropdownMenuItem>
                        <Dialog>
                            <DialogTrigger className='ml-2 text-[14px]'>Update</DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Update a Job Offer</DialogTitle>
                                </DialogHeader>
                                <Form onSubmit={handleSubmit(onUpdate)}>
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
                                    <Button type="submit">Submit</Button>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
