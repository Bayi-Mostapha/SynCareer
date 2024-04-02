import React, { useState, useEffect } from 'react';
import { axiosClient } from '@/api/axios'; // Import your axiosClient instance
import UserPaddedContent from '@/components/user/padded-content';

const SavedJobOffersPage = () => {
  const [savedJobOffers, setSavedJobOffers] = useState([]);

  useEffect(() => {
    const fetchSavedJobOffers = async () => {
      try {
        const response = await axiosClient.get('/SavedJobOffers');
        setSavedJobOffers(response.data);
      } catch (error) {
        console.error('Error fetching saved job offers:', error);
      }
    };

    fetchSavedJobOffers();
  }, []);

  const handleUnsaveJob = async (jobId) => {
    try {
      await axiosClient.delete(`/SavedJobOffers/${jobId}`);
      // After successfully deleting, update the saved job offers list
      const updatedJobOffers = savedJobOffers.filter(jobOffer => jobOffer.id !== jobId);
      setSavedJobOffers(updatedJobOffers);
    } catch (error) {
      console.error('Error unsaving job offer:', error);
    }
  };

  return (
    <UserPaddedContent>
      <h2 className="text-2xl font-semibold mb-4">Saved Job Offers</h2>
      {savedJobOffers.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Place</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Hours</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {savedJobOffers.map((jobOffer) => (
              <tr key={jobOffer.id}>
                <td className="px-6 py-4 whitespace-nowrap">{jobOffer.job_title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{jobOffer.workplace_type}</td>
                <td className="px-6 py-4 whitespace-nowrap">{jobOffer.workhours_type}</td>
                <td className="px-6 py-4 whitespace-nowrap">{jobOffer.role_desc}</td>
                <td className="px-6 py-4 whitespace-nowrap">{jobOffer.location}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button onClick={() => handleUnsaveJob(jobOffer.id)} className="text-[#0085FF]" >Unsave</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No saved job offers found.</p>
      )}
    </UserPaddedContent>
  );
};

export default SavedJobOffersPage;
