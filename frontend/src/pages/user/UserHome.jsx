import React, { useEffect, useState } from "react";
import { axiosClient } from "@/api/axios";
import { IoSearch } from "react-icons/io5";
import { Link, Outlet } from "react-router-dom";
import { USER_HOME_LINK } from "@/router"; // Import the link for the saved job offers page
import UserPaddedContent from "@/components/user/padded-content";
import { MdBookmark, MdOutlineBookmarkBorder } from "react-icons/md";
import { toast } from "sonner";

function UserHome() {
  const [jobOffers, setJobOffers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [savedJobOffers, setSavedJobOffers] = useState(
    JSON.parse(localStorage.getItem("savedJobOffers")) || []
  );

  useEffect(() => {
    getJobOffers();
  }, []);

  const getJobOffers = async () => {
    try {
      const response = await axiosClient.get("/joboffers");
      setJobOffers(response.data);
      // Set the image URL here if necessary
    } catch (error) {
      console.log("error fetching job data", error);
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
    console.log("Saved Job Offers:", savedJobOffers);
    return filteredJobOffers.map((jobOffer) => {
      console.log("Current Job Offer:", jobOffer);
      // Calculate time difference
      const createdAt = new Date(jobOffer.created_at);
      const currentTime = new Date();
      const diffTime = Math.abs(currentTime - createdAt);
      const diffMinutes = Math.floor(diffTime / (1000 * 60)); // Convert milliseconds to minutes

      // Format the time difference
      let postedTime;
      if (diffMinutes < 60) {
        postedTime = `Posted ${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""
          } ago`;
      } else {
        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) {
          postedTime = `Posted ${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
        } else {
          const diffDays = Math.floor(diffHours / 24);
          postedTime = `Posted ${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
        }
      }

      const isSaved = savedJobOffers.some((savedJob) => savedJob.id === jobOffer.id);
      console.log("isSaved:", isSaved);

      return (
        <Link
          key={jobOffer.id}
          to={`${USER_HOME_LINK}/${jobOffer.id}`}
          className="block bg-white rounded-lg p-4 mb-4 w-[95%]"
        >
          <div className="flex flex-col py-3 pl-4">
            <div className="flex gap-4 mb-4 justify-between items-center">
              <div>
                <img src={imageUrl} alt="Company_logo" />
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
            <div>
              <p className="text-gray-600">{postedTime}</p>
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
          <IoSearch className="text-[20px] mx-[25%]  absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2D2D2D]" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="mx-[25%] pl-10 pr-4 py-4 w-full border border-gray-300 rounded-lg"
          />
        </div>
        <div className="flex gap-4 mx-auto">
          <div>{displayJobOffers()}</div>
          <Outlet />
        </div>
      </div>
    </UserPaddedContent>
  );
}

export default UserHome;
