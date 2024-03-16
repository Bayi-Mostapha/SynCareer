import { useEffect, useState } from "react";
import { axiosClient } from "@/api/axios";
// icons 
import { FaPlus } from "react-icons/fa6";
// shadcn 
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
// sonner 
import { toast } from "sonner";
// componentes
import ResumeCard from "../../../components/user/resume/resume-card";
import ResumesSkeleton from "@/components/user/resume/resumes-skeleton";

function Resumes() {
    const [isFetching, setIsFetching] = useState(false);
    const [resumes, setResumes] = useState([])

    useEffect(() => {
        getResumes()
    }, [])
    const getResumes = async () => {
        setIsFetching(true)
        try {
            const response = await axiosClient.get('/resumes')
            const updatedResumes = response.data.map(resume => ({ ...resume, isDeleting: false, isDownloading: false }))
            setResumes(updatedResumes)
        } catch (error) {
            console.log("error fetching  resume data", error);
        } finally {
            setIsFetching(false)
        }
    }

    const deleteResume = async (id) => {
        try {
            setResumes(prev => prev.map(resume => {
                if (resume.id === id) {
                    return { ...resume, isDeleting: true };
                }
                return resume;
            }));

            const downloadResponse = await axiosClient.delete(`/delete-resume`, {
                data: {
                    id: id,
                }
            });
            setResumes(prev => prev.filter((resume) => resume.id != id))
            toast.success(downloadResponse.data.message)
        } catch (error) {
            console.error('Error deleting resume:', error);
        }
    };

    const downloadResume = async (fileName, id) => {
        setResumes(prev => prev.map(resume => {
            if (resume.id === id) {
                return { ...resume, isDownloading: true };
            }
            return resume;
        }));

        try {
            const downloadResponse = await axiosClient.get(`/download-resume/${fileName}`, {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/pdf',
                },
            });

            const blob = new Blob([downloadResponse.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'syncareer-resume.pdf';
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.log('error downloading resume', error)
        } finally {
            setResumes(prev => prev.map(resume => {
                if (resume.id === id) {
                    return { ...resume, isDownloading: false };
                }
                return resume;
            }));
        }
    }

    function displayResumes() {
        return resumes.map((resume) => {
            return (
                <ResumeCard key={resume.id} resume={resume} onDelete={deleteResume} onDownload={downloadResume} />
            )
        })
    }

    return (
        <>
            <h2 className="text-2xl font-bold text-gray-700">Your resumes</h2>
            {
                isFetching ?
                    <>
                        <ResumesSkeleton />
                    </>
                    :
                    <>
                        <Button
                            variant="default"
                            className="block ml-auto"
                        >
                            <Link
                                className="flex items-center gap-1"
                                to={'create'}
                            >
                                Create new <FaPlus />
                            </Link>
                        </Button>
                        <div className="my-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {displayResumes()}
                        </div >
                    </>
            }
        </>
    );
}

export default Resumes;