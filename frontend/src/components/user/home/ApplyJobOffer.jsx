import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosClient } from "@/api/axios";
import formatDistanceToNow from "@/functions/format-time";
import { Button } from "@/components/ui/button";
import { RiFlagFill } from "react-icons/ri";
import {Textarea} from  '@/components/ui/textarea';

import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ResumeList from "./resumes-list";
import { MdOutlineBookmarkBorder } from "react-icons/md";
import { toast } from "sonner";

function ApplyJobOffer() {
    const [jobOffer, setJobOffer] = useState({});
    const { id } = useParams();

    const [description, setDescription] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleTypeChange = (event) => {
        setSelectedType(event.target.value);
        
    };
    const handleDescChange = (event) => {
        setDescription(event.target.value);
        
    };
    const submitReport = async () => {
        try {
            setIsSubmitting(true);
            const response = await axiosClient.post('/reports', {
                job_offer_id: id, // Use the current job offer ID
                type: selectedType,
                description: description
            });
            toast.success(response.data.message);
            // Optionally, provide feedback to the user
        } catch (error) {
            toast.error(error.response.data.message);
            // Handle error and provide feedback to the user
        } finally {
            setIsSubmitting(false);
        }
    };

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
        <div className="flex bg-white rounded-lg p-4 mx-auto mb-4 w-[900px]">
            {/* Render job offer details */}
            <div>
                <p className="text-gray-600">Posted {formatDistanceToNow(jobOffer.created_at)}</p>
                <p className="text-gray-800 font-bold">{jobOffer.job_title}</p>
                <p className="text-gray-600">{jobOffer.location}</p>
                <p className="text-gray-600">{jobOffer.workplace_type}</p>
                <p className="text-gray-600">{jobOffer.exp_years}</p>
                <p className="text-gray-600">{jobOffer.role_desc}</p>
            </div>

            {/* Render report dialog */}
            <div className="report mr-4">
                <Dialog>
                    <DialogTrigger>
                        <button>
                            <RiFlagFill className="cursor-pointer text-[40px] text-[#1A64E4] border-2 p-2 rounded-md border-[#1A64E4]" />
                        </button> 
                    </DialogTrigger>
                    <DialogContent>
                        <h1 className="text-2xl font-medium mb-3">Flag as inappropriate</h1>
                        {/* Implement radio buttons and text area for report submission */}
                        <div className="flex items-center">
                            <input type="radio" id="option1" name="flagOption" value="It is offensive, discriminatory" className="mr-4 transform scale-150" onChange={handleTypeChange} />
                            <label htmlFor="option1" >It is offensive, discriminatory</label>
                        </div>
                        <div className="flex items-center">
                            <input type="radio" id="option2" name="flagOption" value="It seems like a fake job" className="mr-4 transform scale-150" onChange={handleTypeChange} />
                            <label htmlFor="option2">It seems like a fake job</label>
                        </div>
                        <div className="flex items-center">
                            <input type="radio" id="option3" name="flagOption" value="It is an advertisement" className="mr-4 transform scale-150" onChange={handleTypeChange} />
                            <label htmlFor="option3">It is an advertisement</label>
                        </div>
                        <div className="flex items-center">
                            <input type="radio" id="option4" name="flagOption" value="It is inaccurate" className="mr-4 transform scale-150" onChange={handleTypeChange} />
                            <label htmlFor="option4">It is inaccurate</label>
                        </div> 
                        <div className="mb-4">
                            <label htmlFor="reason" className="block mb-2 font-semibold text-[#181818]">Additional information</label>
                            <Textarea id="reason" name="reason" rows="4" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" onChange={handleDescChange}/>
                        </div>
                        <button className="cursor-pointer bg-[#1A64E4] mb-[4px] text-white px-6 py-[8.5px] rounded-lg border-blue-500" onClick={submitReport}>Submit</button>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Render other components */}
            <div className="save mr-4 flex-shrink-0">
                <button>
                    <MdOutlineBookmarkBorder className=" cursor-pointer text-[40px] text-[#1A64E4] border-2 p-1.5 rounded-md border-[#1A64E4]" />
                </button>
            </div>

            <div className="apply">
                <Dialog>
                    <DialogTrigger className="cursor-pointer bg-[#1A64E4] mb-[4px] text-white px-6 py-[8.5px] rounded-lg border-blue-500">
                        Apply Now
                    </DialogTrigger>
                    <DialogContent>
                        <Tabs defaultValue="profile">
                            <TabsList>
                                <TabsTrigger value="profile">Apply with profile</TabsTrigger>
                                <TabsTrigger value="resume">Apply with resume</TabsTrigger>
                            </TabsList>
                            <TabsContent className="h-60" value="profile">
                                <Button onClick={apply}>Apply</Button>
                            </TabsContent>
                            <TabsContent value="resume">
                                <ResumeList />
                            </TabsContent>
                        </Tabs>

                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

export default ApplyJobOffer;
