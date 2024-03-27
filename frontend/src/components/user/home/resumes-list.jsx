import { axiosClient } from "@/api/axios";
import SynCareerLoader from "@/components/general/syncareer-loader";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ResumeList() {
    const { id: jobOffer } = useParams()
    const [isFetching, setIsFetching] = useState(false)
    const [resumes, setResumes] = useState([])

    useEffect(() => {
        getResumes()
    }, [])

    const getResumes = async () => {
        try {
            setIsFetching(true)
            const response = await axiosClient.get('/resumes');
            const updatedResumes = await Promise.all(response.data.map(async (resume) => {
                const res = await axiosClient.get(`storage/resume-images/${resume.image_name}`, {
                    responseType: 'blob'
                });
                const imageUrl = URL.createObjectURL(res.data);
                return { ...resume, img: imageUrl };
            }));
            setResumes(updatedResumes);
        } catch (error) {
            toast.error("Error fetching  resumes");
            console.log(error)
        } finally {
            setIsFetching(false)
        }
    }

    async function applyWithResume(id) {
        axiosClient.post(`/apply/${jobOffer}`, { resume_id: id })
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
    }

    function displayResumes() {
        return resumes.map((resume) => {
            return (
                <img
                    key={resume.id}
                    onClick={() => applyWithResume(resume.id)}
                    className="object-fill border cursor-pointer hover:shadow-md opacity-95 transition-all"
                    src={resume.img}
                    alt={resume.id} />
            )
        })
    }

    return (
        <>
            {isFetching ? (
                <div className="w-full h-60 flex items-center justify-center">
                    <SynCareerLoader />
                </div>
            ) : (
                <div className="p-2 h-60 grid grid-cols-3 gap-2 overflow-auto">
                    {displayResumes()}
                </div>
            )}
        </>
    );
}

export default ResumeList;