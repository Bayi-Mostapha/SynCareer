import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosClient } from "@/api/axios";
import formatDistanceToNow from "@/functions/format-time";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ResumeList from "./resumes-list";

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

    async function apply() {
        axiosClient.post(`/apply/${id}`)
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div className="bg-white rounded-lg p-4 mb-4 w-[800px]">
            {/* apply button  */}
            <Dialog>
                <DialogTrigger>Apply now</DialogTrigger>
                <DialogContent>
                    <Tabs defaultValue="profile">
                        <TabsList>
                            <TabsTrigger value="profile">Apply with profile</TabsTrigger>
                            <TabsTrigger value="resume">Apply with resume</TabsTrigger>
                        </TabsList>
                        <TabsContent className='h-60' value="profile">
                            <Button onClick={apply}>Apply</Button>
                        </TabsContent>
                        <TabsContent value="resume">
                            <ResumeList />
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>

            {/* content  */}
            <p className="text-gray-600">Posted {formatDistanceToNow(jobOffer.created_at)}</p>
            <p className="text-gray-800 font-bold">{jobOffer.job_title}</p>
            <p className="text-gray-600">{jobOffer.location}</p>
            <p className="text-gray-600">{jobOffer.workplace_type}</p>
            <p className="text-gray-600">{jobOffer.exp_years}</p>
            <p className="text-gray-600">{jobOffer.role_desc}</p>
        </div>
    );
}

export default ApplyJobOffer;
