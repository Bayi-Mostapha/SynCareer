import { useNavigate } from "react-router-dom";
import { useRef, useState, useCallback } from "react";
import { axiosClient } from "@/api/axios";
// shadcn 
import { Button } from "@/components/ui/button";
// sonner 
import { toast } from "sonner";
// icons
import { TbPencil, TbPencilOff } from "react-icons/tb";
import { LuChevronsUpDown } from "react-icons/lu";
// html to pdf 
import { toJpeg } from 'html-to-image';
// react drop zone
import { useDropzone } from 'react-dropzone'
// framer motion 
import { Reorder, useDragControls } from "framer-motion"
//components
import DnDFile from "@/components/general/dnd-file";
import ResumeHeader from "../../../components/user/resume/resume-header";
import ResumeSummary from "../../../components/user/resume/resume-summary";
import ResumeEducation from "@/components/user/resume/resume-education";
import ResumeExperience from "@/components/user/resume/resume-experience";
import ResumeLanguages from "@/components/user/resume/resume-languages";
import ResumeSkills from "@/components/user/resume/resume-skills";

const ResumeCreator = () => {
    const [order, setOrder] = useState(['edu', 'exp', 'lang', 'skills']);
    const controls = useDragControls()

    const [isSaving, setIsSaving] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null);

    const resumeRef = useRef();
    const imageResumeRef = useRef();

    const navigate = useNavigate();

    const onDrop = useCallback(acceptedFiles => {
        const reader = new FileReader();
        reader.onload = () => {
            const imageDataUrl = reader.result;
            setAvatarUrl(imageDataUrl);
        };
        reader.readAsDataURL(acceptedFiles[0]);
    }, [])
    const dropZone = useDropzone({ onDrop })

    const toggleEditable = () => {
        setIsEdit(!isEdit);
    };

    const [titles, setTitles] = useState({
        summary: "Summay",
        experience: "Experience",
        skills: "Skills",
        languages: "Languages",
        education: "Education",
    });
    const [formData, setFormData] = useState({
        fullname: "Your Name",
        jobPosition: "Your Job Title",
        personalSummary: "Add a summary",
        phoneNumber: "+1234567890",
        email: "email@example.com",
        website: "www.yourwebsite.com",
        address: "your address",
    });
    const [education, setEducation] = useState([
        {
            university: "Name of your university/school",
            major: "Your major",
            year: "Graduation year",
        },
    ]);
    const [experiences, setExperiences] = useState([
        {
            year: "years",
            title: "Job Position Here",
            companyAndLocation: "Company Name / Location here",
            description: "desc"
        }
    ]);
    const [languages, setLanguages] = useState([
        {
            title: "english",
            level: "advanced",
        }
    ]);
    const [skills, setSkills] = useState([
        {
            title: "skill",
        }
    ]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleTitleChange = (e) => {
        const { name, value } = e.target;
        setTitles((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    //backend request
    const generatePdf = async () => {
        const formData = new FormData();
        const htmlContent = resumeRef.current.innerHTML;
        setIsSaving(true)
        try {
            const dataUrl = await toJpeg(imageResumeRef.current);
            const blobData = dataURItoBlob(dataUrl);
            formData.append('image', blobData, 'resume-image.jpeg');
            formData.append('html_content', htmlContent);
            const saveResponse = await axiosClient.post('/resumes', formData);
            toast.success(saveResponse.data.message)
            const fileName = saveResponse.data.fileName

            // downloading
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

            navigate('../');
        } catch (error) {
            if (error.code === 'ERR_BAD_REQUEST') {
                toast.error('Forbidden!!')
            }
            console.error('Error generating PDF:', error);
        } finally {
            setIsSaving(false)
        }
    };
    function dataURItoBlob(dataURI) {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    }

    const styles = {
        fontFamily: 'sans-serif',
        backgroundColor: 'transparent',
        outline: 'none',
        border: 'none',
        width: '100%'
    };
    const titleStyles = {
        display: 'block',
        color: "#005EFF",
        fontSize: '1.5rem',
        fontWeight: 'bold',
        fontFamily: 'sans-serif',
        backgroundColor: 'transparent',
        outline: 'none',
        border: 'none',
        width: '100%'
    };

    function displaySections() {
        return order.map(item => {
            let component;

            switch (item) {
                case 'edu':
                    component = <ResumeEducation education={education} setEducation={setEducation} styles={styles} isEdit={isEdit} handleTitleChange={handleTitleChange} titles={titles} titleStyles={titleStyles} />
                    break;
                case 'exp':
                    component = <ResumeExperience experiences={experiences} setExperiences={setExperiences} styles={styles} isEdit={isEdit} handleTitleChange={handleTitleChange} titles={titles} titleStyles={titleStyles} />
                    break;
                case 'lang':
                    component = <ResumeLanguages languages={languages} setLanguages={setLanguages} styles={styles} isEdit={isEdit} handleTitleChange={handleTitleChange} titles={titles} titleStyles={titleStyles} />
                    break;
                case 'skills':
                    component = <ResumeSkills skills={skills} setSkills={setSkills} styles={styles} isEdit={isEdit} handleTitleChange={handleTitleChange} titles={titles} titleStyles={titleStyles} />
                    break;
            }
            return (
                <Reorder.Item
                    className="relative bg-white"
                    style={{ padding: '0' }}
                    key={item}
                    value={item}
                    dragListener={true}
                    dragControls={controls}
                >
                    {component}
                    {isEdit && <div className="p-2 bg-background absolute top-0 left-[-55px] rounded-md shadow-sm cursor-grab hover:opacity-90 active:opacity-80 active:cursor-grabbing">
                        <LuChevronsUpDown />
                    </div>}
                </Reorder.Item>
            )
        })
    }

    return (
        <>
            <div className="flex justify-between items-center">
                <h2 className="text-gray-700">
                    {isEdit ? "editing mode" : "viewing mode"}
                </h2>
                <Button variant="ghost" className="p-0" onClick={toggleEditable}>
                    {!isEdit ? <TbPencil className="text-xl" /> : <TbPencilOff className="text-xl" />}
                </Button>
            </div>
            {isEdit &&
                <DnDFile {...dropZone} />
            }
            <h2 className="mt-8 text-lg font-bold">Your resume:</h2>
            <div ref={resumeRef} className="w-full overflow-auto pl-12 lg:flex items-center justify-center">
                <div className="w-[793px] min-w-[793px] p-5" ref={imageResumeRef} style={{ backgroundColor: 'white' }}>
                    <ResumeHeader styles={styles} formData={formData} handleChange={handleChange} titleStyles={titleStyles} isEdit={isEdit} avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} />
                    <ResumeSummary styles={styles} formData={formData} handleChange={handleChange} handleTitleChange={handleTitleChange} titles={titles} titleStyles={titleStyles} isEdit={isEdit} />
                    <Reorder.Group values={order} onReorder={setOrder} style={{ listStyleType: 'none', padding: '0' }}>
                        {displaySections()}
                    </Reorder.Group>
                </div>
            </div >
            < Button
                disabled={isEdit || isSaving
                }
                variant="default"
                className="my-3 block ml-auto"
                onClick={generatePdf}
            >
                Save and download
            </Button >
        </>
    );
};

export default ResumeCreator;