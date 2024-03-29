import { useEffect, useState } from "react";
import { axiosClient } from "@/api/axios";
// icons 
import { IoSearch } from "react-icons/io5";
import { MdOutlineBookmarkBorder } from "react-icons/md";
// routing 
import { USER_HOME_LINK } from "@/router";
import { Link, Outlet } from "react-router-dom";
import { toast } from "sonner";
import UserPaddedContent from "@/components/user/padded-content";

function UserHome() {
    const [jobOffers, setJobOffers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        getJobOffers();
    }, []);

    const getJobOffers = async () => {
        // const res = await axiosClient.get(`storage/assets/logooracle.png`, {
        //     responseType: 'blob'
        // });
        // setImageUrl( URL.createObjectURL(res.data)); // Adjust the path as needed

        try {
            const response = await axiosClient.get('/joboffers');
            setJobOffers(response.data);
            // Set the image URL here if necessary
        } catch (error) {
            console.log("error fetching job data", error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredJobOffers = jobOffers.filter(jobOffer =>
        jobOffer.job_title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    function displayJobOffers() {
        return filteredJobOffers.map((jobOffer) => {
            // Calculate time difference
            const createdAt = new Date(jobOffer.created_at);
            const currentTime = new Date();
            const diffTime = Math.abs(currentTime - createdAt);
            const diffMinutes = Math.floor(diffTime / (1000 * 60)); // Convert milliseconds to minutes

            // Format the time difference
            let postedTime;
            if (diffMinutes < 60) {
                postedTime = `Posted ${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
            } else {
                const diffHours = Math.floor(diffMinutes / 60);
                if (diffHours < 24) {
                    postedTime = `Posted ${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
                } else {
                    const diffDays = Math.floor(diffHours / 24);
                    postedTime = `Posted ${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
                }
            }

            return (
                <Link key={jobOffer.id} to={`${USER_HOME_LINK}/${jobOffer.id}`} className="block bg-white rounded-lg p-4 mb-4 w-[95%]">
                    <div className="flex flex-col py-3 pl-4">
                        <div className="flex gap-4 mb-4 justify-between items-center">
                            <div><img src={imageUrl} alt="Company_logo" /></div>
                            <div className="flex flex-col">
                                <h1 className="text-gray-800 font-bold">{jobOffer.job_title}</h1>
                                <div className="flex gap-2">
                                    <p className="text-gray-600">{jobOffer.location}</p>
                                    <p className="text-gray-600">{jobOffer.workplace_type}</p>
                                    <p className="text-gray-600">{jobOffer.exp_years}</p>
                                </div>
                            </div>
                            <div className="ml-auto mr-4"><button><MdOutlineBookmarkBorder className="text-4xl text-[#808080] border-2 p-1 rounded-md border-[#E5E5E5]" /></button></div>
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
            <div className="flex flex-col gap-2 p-4">
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
                    <div >
                        {displayJobOffers()}
                    </div>
                    <Outlet />
                </div>
            </div>
        </UserPaddedContent>
    );
}

export default UserHome;
