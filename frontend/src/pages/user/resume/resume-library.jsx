import { useCallback, useEffect, useRef, useState } from "react";
import { axiosClient } from "@/api/axios";
// icons 
import { FaPlus } from "react-icons/fa6";
import { GrDocumentPdf } from "react-icons/gr";
import { IoCloudUploadOutline } from "react-icons/io5";
// shadcn 
import { Link } from "react-router-dom";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// sonner 
import { toast } from "sonner";
// componentes
import ResumeCard from "../../../components/user/resume/resume-card";
import ResumesSkeleton from "@/components/user/resume/resumes-skeleton";
// react drop zone
import { useDropzone } from 'react-dropzone'
import DnDFile from "@/components/general/dnd-file";
// functions 
import formatDistanceToNow from "@/functions/format-time";
//pdf stuff
import { toJpeg } from 'html-to-image';
import { Document, Page, pdfjs } from 'react-pdf';
import dataURItoBlob from "@/functions/uri2blob";
import UserPaddedContent from "@/components/user/padded-content";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

function Resumes() {
    const [isFetching, setIsFetching] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [resumes, setResumes] = useState([])
    const [uFile, setUFile] = useState(null)
    const imgRef = useRef();

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        if (file) {
            setUFile(file)
        } else {
            toast.error('Please upload a pdf')
        }
    }, []);
    const dropZone = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
        }
    })

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

                const datetonow = formatDistanceToNow(resume.created_at);

                return { ...resume, date: datetonow, isDeleting: false, isDownloading: false, img: imageUrl };
            }));
            setResumes(updatedResumes);
        } catch (error) {
            toast.error("Error fetching  resumes");
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
            toast.error('Error deleting resume:');
        }
    }
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
            toast.error('error downloading resume')
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
    function uploadResume() {
        setIsUploading(true)
        toJpeg(imgRef.current).then((dataUrl) => {
            const blobData = dataURItoBlob(dataUrl);
            const formData = new FormData();
            formData.append('resume', uFile);
            formData.append('image', blobData, 'resume-image.jpeg');
            axiosClient.post('/upload-resume', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => {
                toast.success(response.data.message)
                getResumes()
            }).catch(error => {
                toast.error(error.response.data.message)
            });
        }).catch(() => {
            toast.error('Something went wrong, please try again')
        }).finally(() => {
            setUFile(null)
            setDialogOpen(false)
            setIsUploading(false)
        })
    }

    const sortByNewest = () => {
        const sortedResumes = [...resumes].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setResumes(sortedResumes);
    };
    const sortByOldest = () => {
        const sortedResumes = [...resumes].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        setResumes(sortedResumes);
    };

    return (
        <UserPaddedContent>
            <div className="flex justify-between mb-5 pb-3 border-b-2">
                <div>
                    <h2 className="text-2xl font-semibold">Resumes</h2>
                    <p className="text-sm">Create, upload and manage you resumes</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger className="h-fit px-3 py-2 bg-background text-primary text-sm flex items-center gap-2 shadow-sm rounded-md hover:shadow-md hover:scale-105 transition-all">
                        <IoCloudUploadOutline className="text-lg" />
                        <span>Upload a resume</span>
                    </DialogTrigger>
                    <DialogContent>
                        {
                            (uFile !== null) ?
                                <>
                                    <div className="mt-4 flex flex-col">
                                        <h2 className="text-lg font-semibold">Upload Confirmation</h2>
                                        <p className="text-sm">Your resume is now ready to upload, click to confirm upload</p>
                                    </div>
                                    <div className="w-full h-80 overflow-auto">
                                        <div ref={imgRef} className="bg-white w-fit h-fit">
                                            <Document file={uFile}>
                                                <Page pageNumber={1} renderTextLayer={false} renderAnnotationLayer={false} />
                                            </Document>
                                        </div>
                                    </div>
                                    <div className="flex justify-end items-center gap-4">
                                        <DialogClose onClick={() => { setUFile(null) }}>Cancel</DialogClose>
                                        <Button disabled={isUploading} variant='default' onClick={uploadResume}>Upload</Button>
                                    </div>
                                </>
                                :
                                <DnDFile {...dropZone} file="resume" icon={<GrDocumentPdf className="text-8xl text-gray-400" />} />
                        }
                    </DialogContent>
                </Dialog>
            </div>
            {
                isFetching ?
                    <ResumesSkeleton />
                    :
                    <>
                        <div className="flex justify-end">
                            <Select onValueChange={(e) => {
                                if (e === "desc") {
                                    sortByNewest()
                                } else {
                                    sortByOldest()
                                }
                            }}
                            >
                                <SelectTrigger className="w-fit bg-background">
                                    <SelectValue placeholder="Order by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="desc">Newest</SelectItem>
                                    <SelectItem value="asc">Oldest</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="my-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                            <div className="pt-1">
                                <h2 className="font-semibold">New Resume</h2>
                                <p className="text-xs text-slate-600 mb-2">Create a new resume</p>
                                <Link
                                    to={'create'}
                                >
                                    <div className="relative h-[300px] flex justify-center items-center rounded-md overflow-hidden group">
                                        <div className="absolute top-0 bottom-0 left-0 right-0 z-[-1] bg-primary opacity-15 group-hover:opacity-25 transition-all"></div>
                                        <div className="p-5 rounded-full flex items-center justify-center bg-background shadow group-hover:scale-105 group-hover:shadow-lg transition-all">
                                            <FaPlus className="text-3xl text-primary" />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            {displayResumes()}
                        </div >
                    </>
            }
        </UserPaddedContent>
    );
}

export default Resumes;