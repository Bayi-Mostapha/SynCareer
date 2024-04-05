import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { axiosClient } from "@/api/axios";
import CompanyPaddedContent from "@/components/company/padded-content";
import { Document, Page } from "react-pdf";
import { toast } from "sonner";
import { JOBOFFER_LINK_BASE } from "@/router";
import { Button } from "@/components/ui/button";

function ViewResume() {
    const { id, rid } = useParams();
    const [numPages, setNumPages] = useState(1);
    const [file, setFile] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        getResume()
    }, [])
    const getResume = async () => {
        axiosClient.get(`resume/${rid}`, {
            responseType: 'blob'
        })
            .then(res => {
                console.log(res)
                setFile(URL.createObjectURL(res.data));
            })
            .catch(err => {
                if (err.response.status === 404) {
                    toast.error("Resume not found!")
                    navigate(`${JOBOFFER_LINK_BASE}/${id}`)
                }
            })
    }

    const downloadResume = async () => {
        try {
            const downloadResponse = await axiosClient.get(`/download-resume-id/${rid}`, {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/pdf',
                },
            });

            const blob = new Blob([downloadResponse.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'candidat-resume.pdf';
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.log(error)
            toast.error('error downloading resume')
        }
    }

    return (
        <CompanyPaddedContent>
            <div className="flex flex-row justify-between">
                <Link to={`${JOBOFFER_LINK_BASE}/${id}`}>Go back</Link>
                <Button onClick={downloadResume}>
                    Download
                </Button>
            </div>
            {
                file &&
                <div className="flex justify-center items-center">
                    <Document
                        file={file}
                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                    >
                        {
                            Array.apply(null, Array(numPages))
                                .map((x, i) => i + 1)
                                .map(page =>
                                    <Page className='border border-gray-100 shadow-sm' pageNumber={page} renderTextLayer={false} renderAnnotationLayer={false} />)
                        }
                    </Document>
                </div>
            }
        </CompanyPaddedContent>
    );
}

export default ViewResume;