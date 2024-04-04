import React, { useEffect, useState } from "react";
import { axiosClient } from "@/api/axios";
import { IoSearch } from "react-icons/io5";
import { Link, Outlet, useParams } from "react-router-dom";
import { USER_HOME_LINK } from "@/router"; // Import the link for the saved job offers page
import UserPaddedContent from "@/components/user/padded-content";
import { MdBookmark, MdOutlineBookmarkBorder } from "react-icons/md";
import { toast } from "sonner";
import getUserPicture from "@/functions/get-user-pic";
import formatDistanceToNow from "@/functions/format-time";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

function UserHome() {
  const { id } = useParams()
  const [isFetching, setIsFetching] = useState(false);
  const [jobOffers, setJobOffers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedJobOffers, setSavedJobOffers] = useState(
    JSON.parse(localStorage.getItem("savedJobOffers")) || []
  );

  useEffect(() => {
    getJobOffers();
  }, []);

  const getJobOffers = async () => {
    try {
      setIsFetching(true)
      const response = await axiosClient.get("/joboffers");
      const newJobOffers = await Promise.all(
        response.data.map(async (jobOffer) => {
          const picture = await getUserPicture(jobOffer.company.picture, 'company');
          return { ...jobOffer, company_pic: picture };
        })
      );
      setJobOffers(newJobOffers);
    } catch (error) {
      console.log("error fetching job data", error);
    } finally {
      setIsFetching(false)
    }
  };
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleSaveJob = async (jobId) => {
    try {
      const isSaved = savedJobOffers.some((savedJob) => savedJob.id === jobId);
      if (isSaved) {
        // If already saved, unsave the job offer
        await axiosClient.delete(`/SavedJobOffers/${jobId}`);
        toast.success("Job unsaved successfully");
        // Update the list of saved job offers locally without fetching
        const updatedSavedJobOffers = savedJobOffers.filter((savedJob) => savedJob.id !== jobId);
        setSavedJobOffers(updatedSavedJobOffers);
        localStorage.setItem("savedJobOffers", JSON.stringify(updatedSavedJobOffers));
      } else {
        // If not saved, save the job offer
        await axiosClient.post("/saveJob/" + jobId);
        toast.success("Job saved successfully");
        // Update the list of saved job offers locally without fetching
        const updatedSavedJobOffers = [...savedJobOffers, { id: jobId }];
        setSavedJobOffers(updatedSavedJobOffers);
        localStorage.setItem("savedJobOffers", JSON.stringify(updatedSavedJobOffers));
      }
    } catch (error) {
      console.log("error saving/unsaving job", error);
      toast.error("Failed to save/unsave job");
    }
  };
  const filteredJobOffers = jobOffers.filter((jobOffer) =>
    jobOffer.job_title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  function displayJobOffers() {
    return filteredJobOffers.map((jobOffer) => {
      let postedTime = formatDistanceToNow(jobOffer.created_at);
      const isSaved = savedJobOffers.some((savedJob) => savedJob.id === jobOffer.id);
      return (
        <Link
          key={jobOffer.id}
          to={`${USER_HOME_LINK}/${jobOffer.id}`}
          className="block bg-white rounded-lg p-4 mb-4 shadow-sm"
        >
          <div className="flex flex-col py-3 pl-4">
            <div className="flex gap-4 mb-4 justify-between items-center">
              <div>
                <img className="w-14 h-14 rounded" src={jobOffer.company_pic} alt="Company_logo" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-gray-800 font-bold">{jobOffer.job_title}</h1>
                <div className="flex gap-2">
                  <p className="text-gray-600">{jobOffer.location}</p>
                  <p className="text-gray-600">{jobOffer.workplace_type}</p>
                  <p className="text-gray-600">{jobOffer.exp_years}</p>
                </div>
              </div>
              <div className="ml-auto mr-4">
                <button
                  onClick={() => handleSaveJob(jobOffer.id)}
                  className={`text-5xl border-2 p-1 rounded-md  ${isSaved ? "text-[#0085FF] border-[#0085FF] " : "text-[#808080] border-[#808080]"
                    }`}
                >
                  {isSaved ? (
                    <MdBookmark className="text-[25px]" />
                  ) : (
                    <MdOutlineBookmarkBorder className="text-[25px]" />
                  )}
                </button>
              </div>
            </div>
            <p className="text-gray-600">{postedTime}</p>
            <div className="w-3/4 ml-auto">
              {jobOffer.skills.map(skill => {
                return <Badge className='mr-1'>{skill.content}</Badge>
              })}
            </div>
          </div>
        </Link>
      );
    });
  }

  return (
    <UserPaddedContent>
      <div>
        <div className="relative flex items-center w-full  mb-4">
          <IoSearch className="text-[20px] mx-[25%]  absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="mx-[25%] pl-10 pr-4 py-4 w-full border border-gray-300 rounded-lg"
          />
        </div>
        <div className="relative mx-auto grid grid-cols-3 gap-1">
          {!id && <div className="col-span-1"></div>}
          {isFetching ?
            <div className="flex flex-col gap-4">
              <Skeleton className='h-40'></Skeleton>
              <Skeleton className='h-40'></Skeleton>
            </div>
            :
            <ScrollArea className="px-3 col-span-1 overflow-auto h-[450px]">
              {displayJobOffers()}
            </ScrollArea>
          }
          {jobOffers.length > 0 && <Outlet />}
        </div>
      </div>
    </UserPaddedContent>
  );
}

export default UserHome;
