import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosClient } from "@/api/axios";
import formatDistanceToNow from "@/functions/format-time";
import { Button } from "@/components/ui/button";
import { RiFlagFill } from "react-icons/ri";
import { Textarea } from '@/components/ui/textarea';
import { FaLocationDot } from "react-icons/fa6";
import { MdWork } from "react-icons/md";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ResumeList from "./resumes-list";
import { MdOutlineBookmarkBorder, MdBookmark } from "react-icons/md";
import { toast } from "sonner";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

function ApplyJobOffer() {
    const [jobOffer, setJobOffer] = useState({});
    const { id } = useParams();

    const [description, setDescription] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const getJobOffer = async () => {
            try {
                setIsFetching(true)
                const response = await axiosClient.get(`/joboffers/${id}`);
                setJobOffer(response.data);
            } catch (error) {
                console.log("Error fetching job offer data", error);
            } finally {
                setIsFetching(false)
            }
        };

        const checkIfJobOfferSaved = async () => {
            try {
                // Check if job offer is saved in localStorage
                const savedJobOffers = JSON.parse(localStorage.getItem("savedJobOffers")) || [];
                const isJobOfferSaved = savedJobOffers.some(offerId => offerId === id);
                setIsSaved(isJobOfferSaved);
            } catch (error) {
                console.log("Error checking if job offer is saved", error);
            }
        };

        if (id) {
            getJobOffer();
            checkIfJobOfferSaved();
        }
    }, [id]);

    const saveJobOffer = async () => {
        try {
            const savedJobOffers = JSON.parse(localStorage.getItem("savedJobOffers")) || [];
            if (isSaved) {
                // Remove job offer ID from savedJobOffers
                const updatedSavedJobOffers = savedJobOffers.filter(offerId => offerId !== id);
                localStorage.setItem("savedJobOffers", JSON.stringify(updatedSavedJobOffers));
                toast.success("Job offer unsaved successfully");
            } else {
                // Add job offer ID to savedJobOffers
                const updatedSavedJobOffers = [...savedJobOffers, id];
                localStorage.setItem("savedJobOffers", JSON.stringify(updatedSavedJobOffers));
                toast.success("Job offer saved successfully");
            }
            setIsSaved(!isSaved);
        } catch (error) {
            console.log("error saving/unsaving job", error);
            toast.error("Failed to save/unsave job offer");
        }
    };

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
                job_offer_id: id,
                type: selectedType,
                description: description
            });
            toast.success(response.data.message);
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    async function apply() {
        try {
            const response = await axiosClient.post(`/apply/${id}`);
            toast.success("Applied succesfully")
        } catch (error) {
            toast.error("Something went wrong please try again")
            console.error("Error applying for job offer", error);
        }
    }

    return <>
        {isFetching ?
            <Skeleton className="col-span-2 rounded-lg shadow-md"></Skeleton>
            :
            <div className="col-span-2 flex flex-col bg-white rounded-lg shadow-md">
                < div className="top-info flex items-center justify-between bg-white rounded-lg py-4 px-[50px] mb-4" >
                    <div>
                        <p className="text-gray-600 ">Posted {formatDistanceToNow(jobOffer.created_at)}</p>
                        <p className="text-gray-800 font-semibold text-3xl mt-2"> {jobOffer.job_title}</p>
                        <p className="text-gray-600 flex items-center gap-1 mt-4 text-[16px]"> <FaLocationDot />{jobOffer.location}</p>
                        <p className="text-gray-600 flex items-center gap-1 mt-2 text-[16px]"> <MdWork /> {jobOffer.workplace_type}</p>
                        <p className="text-gray-600"> Required Experience : {jobOffer.exp_years} year(s)</p>
                    </div>
                    <div className="flex items-center">
                        <div className="report mr-4">
                            <Dialog>
                                <DialogTrigger>
                                    <button>
                                        <RiFlagFill className="cursor-pointer text-[40px] text-[#1A64E4] border-2 p-2 rounded-md border-[#1A64E4]" />
                                    </button>
                                </DialogTrigger>
                                <DialogContent>
                                    <h1 className="text-2xl font-medium mb-3">Flag as inappropriate</h1>
                                    <div className="flex items-center">
                                        <input type="radio" id="option1" name="flagOption" value="It is offensive, discriminatory" className="mr-4 transform scale-150" onChange={handleTypeChange} />
                                        <label htmlFor="option1">It is offensive, discriminatory</label>
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
                                        <Textarea id="reason" name="reason" rows="4" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" onChange={handleDescChange} />
                                    </div>
                                    <button className="cursor-pointer bg-[#1A64E4] mb-[4px] text-white px-6 py-[8.5px] rounded-lg border-blue-500" onClick={submitReport}>Submit</button>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="save mr-4 flex-shrink-0">
                            <button onClick={saveJobOffer}>
                                {isSaved ? (
                                    <MdBookmark className="cursor-pointer text-[40px] text-[#1A64E4] border-2 p-1.5 rounded-md border-[#1A64E4]" />
                                ) : (
                                    <MdOutlineBookmarkBorder className="cursor-pointer text-[40px] text-[#1A64E4] border-2 p-1.5 rounded-md border-[#1A64E4]" />
                                )}
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
                                            <div className="h-full flex flex-col gap-3">
                                                <h3 className="text-lg font-medium text-gray-700">Apply with your profile</h3>
                                                <p className="text-gray-600 flex-1">Make sure your profile is polished and up-to-date before submitting your application.</p>
                                                <Button className="w-full" onClick={apply}>Apply</Button>
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="resume">
                                            <h3 className="text-lg font-medium text-gray-700">Choose a resume</h3>
                                            <ResumeList />
                                        </TabsContent>
                                    </Tabs>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div >
                <h1 className="font-medium  px-[50px] mb-4 text-[18px]">Job details</h1>
                <ScrollArea className="h-[200px] overflow-auto">
                    <hr className="border-[#F6F6F6]" />
                    <div className="px-[50px]">
                        <p className="text-gray-600 text-justify mt-4" style={{ whiteSpace: 'pre-line' }}>{jobOffer.role_desc}</p>
                    </div>
                </ScrollArea>
            </div >
        }
    </>
}

export default ApplyJobOffer;
