import { useNavigate } from "react-router-dom";
import { useRef, useState, useCallback } from "react";
import { axiosClient } from "@/api/axios";
// shadcn 
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
// sonner 
import { toast } from "sonner";
// icons
import { TbPencil, TbPencilOff } from "react-icons/tb";
import { LuChevronsUpDown } from "react-icons/lu";
import { IoCloudDownloadOutline } from "react-icons/io5"
import { MdOutlineColorLens } from "react-icons/md";
import { SlPicture } from "react-icons/sl";
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
import ResumeProjects from "@/components/user/resume/resume-projects";
import dataURItoBlob from "@/functions/uri2blob";

const ResumeCreator = () => {
    const [order, setOrder] = useState(['edu', 'exp', 'prj', 'lang', 'skills']);
    const controls = useDragControls()

    const [color, setColor] = useState("black");
    const [isSaving, setIsSaving] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null);

    const resumeRef = useRef();

    const navigate = useNavigate();

    const onDrop = useCallback(acceptedFiles => {
        if (!acceptedFiles[0]) {
            toast.error('Please upload an image')
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const imageDataUrl = reader.result;
            setAvatarUrl(imageDataUrl);
        };
        reader.readAsDataURL(acceptedFiles[0]);
    }, [])
    const dropZone = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png']
        }
    })

    const toggleEditable = () => {
        setIsEdit(!isEdit);
    };

    const [titles, setTitles] = useState({
        summary: "Summay",
        experience: "Experience",
        skills: "Skills",
        languages: "Languages",
        education: "Education",
        projects: "Projects",
    });
    const [formData, setFormData] = useState({
        fullname: "Full Name",
        jobPosition: "Job Title",
        personalSummary: "Add a summary",
        phoneNumber: "+1234567890",
        email: "email@example.com",
        website: "www.yourwebsite.com",
        address: "Your address, city, postal code",
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
            year: "From-To",
            title: "Job Position",
            companyAndLocation: "Company Name and Location",
            description: "Description"
        }
    ]);
    const [projects, setProjects] = useState([
        {
            year: "From-To",
            title: "Project",
            description: "Description"
        }
    ]);
    const [languages, setLanguages] = useState([
        {
            title: "English",
            level: "Advanced",
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
            const dataUrl = await toJpeg(resumeRef.current);
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

    const styles = {
        fontFamily: 'sans-serif',
        backgroundColor: 'white',
        outline: 'none',
        border: 'none',
        width: '100%'
    };
    const titleStyles = {
        display: 'block',
        color: color,
        fontSize: '25px',
        fontWeight: '700',
        fontFamily: 'sans-serif',
        backgroundColor: 'white',
        outline: 'none',
        border: 'none',
        width: '100%',
        textTransform: 'capitalize'
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
                case 'prj':
                    component = <ResumeProjects projects={projects} setProjects={setProjects} styles={styles} isEdit={isEdit} handleTitleChange={handleTitleChange} titles={titles} titleStyles={titleStyles} />
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
                    dragListener={isEdit}
                    dragControls={controls}
                >
                    {component}
                    {isEdit && <div className="p-2 bg-background absolute top-0 left-[-100px] rounded-md shadow-sm cursor-grab hover:opacity-90 active:opacity-80 active:cursor-grabbing">
                        <LuChevronsUpDown />
                    </div>}
                </Reorder.Item>
            )
        })
    }

    return (
        <>
            <h2 className="mb-4 text-3xl font-semibold">Resume Builder</h2>
            <div className="mb-3 flex justify-end items-center gap-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            < Button
                                disabled={isEdit || isSaving}
                                variant="ghost"
                                onClick={generatePdf}
                            >
                                <IoCloudDownloadOutline className="text-xl" />
                            </Button >
                        </TooltipTrigger>
                        <TooltipContent className="bg-background text-primary font-semibold">
                            {isEdit ?
                                <p>Disable editing mode first</p>
                                :
                                <p>Click to download and save</p>
                            }
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <Button variant="ghost" onClick={toggleEditable}>
                    {!isEdit ? <TbPencil className="text-xl" /> : <TbPencilOff className="text-xl" />}
                </Button>
            </div>
            {isEdit &&
                <>
                    <DnDFile {...dropZone} file='picture' icon={<SlPicture className="text-8xl text-gray-400" />} />
                    <div className="my-4 flex justify-center items-center gap-4">
                        <div className="h-7 w-7 bg-[#1e40af] rounded-full cursor-pointer hover:scale-125 transition-all:"
                            onClick={() => { setColor("#1e40af") }}></div>
                        <div className="h-7 w-7 bg-[#65a30d] rounded-full cursor-pointer hover:scale-125 transition-all:"
                            onClick={() => { setColor("#65a30d") }}></div>
                        <div className="h-7 w-7 bg-[#ea580c] rounded-full cursor-pointer hover:scale-125 transition-all"
                            onClick={() => { setColor("#ea580c") }}></div>
                        <input className="opacity-0 h-0 w-0 absolute z-[-1]"
                            id="color-picker" type="color"
                            onChange={(e) => { setColor(e.target.value) }} />
                        <label htmlFor="color-picker" className='flex justify-center items-center h-7 w-7 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 rounded-full shadow-sm cursor-pointer hover:scale-125 transition-all'>
                            <MdOutlineColorLens className="text-gray-700 text-xl" />
                        </label>
                    </div>
                </>
            }
            <div className={`w-full overflow-auto ${isEdit && 'pl-20'} lg:flex items-center justify-center`}>
                <div className="w-[691px] px-12 py-16" ref={resumeRef} style={{ backgroundColor: 'white' }}>
                    <ResumeHeader styles={styles} formData={formData} handleChange={handleChange} titleStyles={titleStyles} isEdit={isEdit} avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} />
                    <ResumeSummary styles={styles} formData={formData} handleChange={handleChange} handleTitleChange={handleTitleChange} titles={titles} titleStyles={titleStyles} isEdit={isEdit} />
                    <Reorder.Group values={order} onReorder={setOrder} style={{ listStyleType: 'none', padding: '0' }}>
                        {displaySections()}
                    </Reorder.Group>
                </div>
            </div >
        </>
    );
};

export default ResumeCreator;