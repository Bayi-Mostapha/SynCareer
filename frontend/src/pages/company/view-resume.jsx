import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { axiosClient } from "@/api/axios";
import CompanyPaddedContent from "@/components/company/padded-content";
import { Document, Page } from "react-pdf";
import { toast } from "sonner";
import { JOBOFFER_LINK_BASE } from "@/router";

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

    return (
        <CompanyPaddedContent>
            <Link to={`${JOBOFFER_LINK_BASE}/${id}`}>Go back</Link>
            {
                file &&
                <Document
                    file={file}
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                >
                    {
                        Array.apply(null, Array(numPages))
                            .map((x, i) => i + 1)
                            .map(page =>
                                <Page pageNumber={page} renderTextLayer={false} renderAnnotationLayer={false} />)
                    }
                </Document>
            }
        </CompanyPaddedContent>
    );
}

export default ViewResume;