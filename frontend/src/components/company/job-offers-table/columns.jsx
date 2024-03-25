import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { JOBOFFER_LINK_BASE } from '@/router';
import { BsThreeDots } from 'react-icons/bs';
import { IoIosArrowDown } from 'react-icons/io';
import { toast } from 'sonner';
import { axiosClient } from '@/api/axios';

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
        accessorKey: 'role_desc',
        header: 'Role Description',
    },
    {
        id: 'actions',
        accessorKey: 'action',
        header: 'Action',
        cell: ({ row }) => {
            const jobOffer = row.original;
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
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
