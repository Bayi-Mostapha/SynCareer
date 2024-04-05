import { axiosClient } from '../../api/axios';
import DataTable from "@/components/general/data-table";
import { useEffect, useState } from 'react';
import { columns } from '@/components/admin/job-offers-table/columns';

function AJobOffers() {
    const [jobOffers, setJobOffers] = useState([]);

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
        <>
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-medium">Job Offers</h1>
            </div>
            <DataTable columns={columns} data={jobOffers} searchColumn={"job_title"} title="Job offers" />
        </>
    );
}


export default AJobOffers;
