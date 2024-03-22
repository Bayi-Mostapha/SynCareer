import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosClient } from "@/api/axios";

function ApplyJobOffer() {
    const [jobOffer, setJobOffer] = useState({});
    const { id } = useParams();

    useEffect(() => {
        const getJobOffer = async () => {
            try {
                const response = await axiosClient.get(`/joboffers/${id}`);
                setJobOffer(response.data);
            } catch (error) {
                console.log("Error fetching job offer data", error);
            }
        };

        if (id) {
            getJobOffer();
        }
    }, [id]);

    // Function to format the time difference
    const formatTimeDifference = (createdAt) => {
        const createdTime = new Date(createdAt);
        const currentTime = new Date();
        const diffTime = Math.abs(currentTime - createdTime);
        const diffMinutes = Math.floor(diffTime / (1000 * 60)); // Convert milliseconds to minutes

        // Format the time difference
        if (diffMinutes < 60) {
            return `Posted ${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
        } else {
            const diffHours = Math.floor(diffMinutes / 60);
            if (diffHours < 24) {
                return `Posted ${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
            } else {
                const diffDays = Math.floor(diffHours / 24);
                return `Posted ${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
            }
        }
    };

    return (
        <div className="bg-white rounded-lg p-4 mb-4 w-[800px]">
            <p className="text-gray-600">{formatTimeDifference(jobOffer.created_at)}</p>
            <p className="text-gray-800 font-bold">{jobOffer.job_title}</p>
            <p className="text-gray-600">{jobOffer.location}</p>
            <p className="text-gray-600">{jobOffer.workplace_type}</p>
            <p className="text-gray-600">{jobOffer.exp_years}</p>
            <p className="text-gray-600">{jobOffer.role_desc}</p>
        </div>
    );
}

export default ApplyJobOffer;
