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
// libs 
import { formatDistanceToNow } from 'date-fns';

function Resumes() {
    const [isFetching, setIsFetching] = useState(false);
    const [resumes, setResumes] = useState([])

    useEffect(() => {
        getResumes()
    }, [])
    const getResumes = async () => {
        setIsFetching(true)
        try {
            const response = await axiosClient.get('/resumes');
            const updatedResumes = await Promise.all(response.data.map(async (resume) => {
                const res = await axiosClient.get(`storage/resume-images/${resume.image_name}`, {
                    responseType: 'blob'
                });
                const imageUrl = URL.createObjectURL(res.data);

                const date = new Date(resume.created_at);
                const datetonow = formatDistanceToNow(date, { addSuffix: true });

                return { ...resume, date: datetonow, isDeleting: false, isDownloading: false, img: imageUrl };
            }));
            setResumes(updatedResumes);
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

            const downloadResponse = await axiosClient.delete(`/resumes/${id}`);
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
            <>
                <h2 className="text-2xl font-semibold">Resumes</h2>
                <p className="mb-5 pb-3 border-b-2 text-sm">Create, upload and manage you resumes</p>
            </>
            {
                isFetching ?
                    <ResumesSkeleton />
                    :
                    <div className="my-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        <div className="pt-1">
                            <h2 className="font-semibold">New Resume</h2>
                            <p className="text-xs text-slate-600 mb-2">Create a new resume</p>
                            <Link
                                to={'create'}
                            >
                                <div className="h-[240px] flex justify-center items-center border rounded-md group hover:bg-background">
                                    <FaPlus className="p-2 text-6xl group-hover:scale-150 group-hover:text-primary transition-all rounded-full" />
                                </div>
                            </Link>
                        </div>
                        {displayResumes()}
                    </div >
            }
        </>
    );
}

export default Resumes;