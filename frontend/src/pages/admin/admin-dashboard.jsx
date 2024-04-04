// shadcn 
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"
// nivo
import { ResponsiveLineCanvas } from "@nivo/line"
import CompanyPaddedContent from "@/components/company/padded-content"
import { useEffect, useState } from "react"
import { axiosClient } from "@/api/axios"
import { COMPANY_CHAT_LINK, COMPANY_INTERVIEW } from "@/router"
import { Link } from "react-router-dom"
import formatDistanceToNow from "@/functions/format-time"
import getUserPicture from "@/functions/get-user-pic"

export default function CompanyDashboard() {
    const [counts, setCounts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reports, setReports] = useState([]);
    const [jobOffers, setJobOffers] = useState([]);
    
    const fetchLast10Reports = async () => {
        try {
          const response = await axiosClient.get('/users/last-10'); 
          setReports(response.data);
          
        } catch (error) {
          console.error('Error fetching counts:', error);
        }
      };
    const fetchCounts = async () => {
        try {
          const response = await axiosClient.get('/counts'); 
          setCounts(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching counts:', error);
        }
      };

    useEffect(() => {
        fetchLast10Reports();
        fetchCounts();
      }, []);
    useEffect(() => {
        console.log(reports);
      }, [reports]);

    const fetchLast10JobOffers = () => {
        return axiosClient.get('/job-offers/last-10');
    };
    useEffect(() => {
       
        // Fetch last 10 job offers
        fetchLast10JobOffers()
            .then(response => setJobOffers(response.data))
            .catch(error => console.error('Error fetching job offers:', error));
    }, []);
    return (
       
            <div className="p-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                    <div className="px-3 py-3 border border-gray-200 rounded-md flex flex-col  cursor-pointer">
                        <div className="text-primary text-xl font-medium mb-2">Number of candidates</div>
                        <div className="text-md font-medium text-gray-700">{counts?.user_count}</div>
                    </div>
                    <div className="px-3 py-3 border border-gray-200 rounded-md flex flex-col  cursor-pointer">
                        <div className="text-primary text-xl font-medium mb-2">Number of recruiters</div>
                        <div className="text-md font-medium text-gray-700">{counts?.company_count}</div>
                    </div>
                    <div className="px-3 py-3 border border-gray-200 rounded-md flex flex-col  cursor-pointer">
                        <div className="text-primary text-xl font-medium mb-2">Number of Reports</div>
                        <div className="text-md font-medium text-gray-700">{counts?.report_count} </div>
                    </div>
                    <div className="px-3 py-3 border border-gray-200 rounded-md flex flex-col  cursor-pointer">
                        <div className="text-primary text-xl font-medium mb-2">Number of passed interviews</div>
                        <div className="text-md font-medium text-gray-700">{counts?.job_offer_count} </div>
                    </div>
                    
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                  <div  className="px-3 py-3 border border-gray-200 rounded-md flex flex-col  cursor-pointer  overflow-x-auto shadow-md sm:rounded-lg"> 
                  
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                   id
                </th>
                <th scope="col" className="px-6 py-3">
                    name
                </th>
                <th scope="col" className="px-6 py-3">
                    job title 
                </th>
            </tr>
        </thead>
        <tbody>
               {reports.length>0 && reports?.map(report => (
                      <tr key={report.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                             {report.id}
                      </th>
                      <td className="px-6 py-4">
                             {report.first_name + report.last_name}
                      </td>
                      <td className="px-6 py-4">
                              {report.job_title}
                      </td>
                  </tr>
                ))}
        </tbody>
    </table>
</div>

                
                  <div  className="px-3 py-3 border border-gray-200 rounded-md flex flex-col  cursor-pointer">
                  <p className="cursor-pointer text-sm ml-3 mb-2 text-green-500">
        <Link to="/admin/joboffers">See All Job Offers</Link>
      </p>
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                    id
                </th>
                <th scope="col" className="px-6 py-3">
                    company
                </th>
                <th scope="col" className="px-6 py-3">
                    job offer
                </th>
            </tr>
        </thead>
        <tbody>
            {jobOffers.length>0 && jobOffers?.map(job => (
                        <tr key={job.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {job.id}
                      </th>
                      <td className="px-6 py-4">
                          {job.company_name}
                      </td>
                      <td className="px-6 py-4">
                          {job.title}
                      </td>
                  </tr>
                ))}
        </tbody>
    </table>
                  </div>
                </div>
            </div>
        
    )
}