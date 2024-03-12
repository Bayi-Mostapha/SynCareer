import { useRef, useState } from "react";
// shadcn 
import { Button } from "@/components/ui/button";
import { axiosClient } from "@/api/axios";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
// sonner 
import { toast } from "sonner";
// icons 
import { FaRegTrashCan } from "react-icons/fa6";
import { TbPencil, TbPencilOff } from "react-icons/tb";
import { FaPlus } from "react-icons/fa";

const Template = () => {
    const resumeRef = useRef();

    const [isEdit, setIsEdit] = useState(false);

    const toggleEditable = () => {
        setIsEdit(!isEdit);
    };


    const [titles, setTitles] = useState({
        summary: "Summay",
        experience: "Experience",
        skills: "Skills",
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
    const [experiences, setExperiences] = useState([
        {
            year: "Enter time and end time",
            title: "Job Position Here",
            companyAndLocation: "Company Name / Location here",
            description: "desc"
        }
    ]);
    const [skills, setSkills] = useState([
        {
            title: "skill",
        }
    ]);
    const [education, setEducation] = useState([
        {
            university: "Name of your university/school",
            major: "Your major",
            year: "Graduation year",
        },
    ]);

    const handleExpChange = (index, e) => {
        const { name, value } = e.target;
        // Create a copy of the workExperiences array
        const updatedExperiences = [...experiences];
        // Update the specific field for the experience at the given index
        updatedExperiences[index][name] = value;
        // Update the state with the modified array
        setExperiences(updatedExperiences);
    };
    const removeExperience = (index) => {
        setExperiences(prev => {
            const updatedExp = [...prev];
            updatedExp.splice(index, 1);
            return updatedExp;
        });
    };
    const addExperience = () => {
        // Create a copy of the workExperiences array and add a new experience
        const updatedExperiences = [
            ...experiences,
            {
                year: "Enter time and end time",
                title: "Job Position Here",
                companyAndLocation: "Company Name / Location here",
                description: "desc"
            }
        ];
        // Update the state with the modified array
        setExperiences(updatedExperiences);
    };

    const handleSkillsChange = (index, e) => {
        const { name, value } = e.target;
        const updatedSkills = [...skills];
        updatedSkills[index][name] = value;
        setSkills(updatedSkills);
    };
    const removeSkill = (index) => {
        setSkills(prev => {
            const updatedSkills = [...prev];
            updatedSkills.splice(index, 1);
            return updatedSkills;
        });
    };
    const addSkill = () => {
        const updatedSkills = [
            ...skills,
            {
                title: "skill",
            }
        ];
        setSkills(updatedSkills);
    };

    const handleEducationChange = (index, e) => {
        const { name, value } = e.target;
        const updatedEdu = [...education];
        updatedEdu[index][name] = value;
        setEducation(updatedEdu);
    };
    const removeEducation = (index) => {
        setEducation(prev => {
            const updatedEdu = [...prev];
            updatedEdu.splice(index, 1);
            return updatedEdu;
        });
    };
    const addEducation = () => {
        const updatedEdu = [
            ...education,
            {
                university: "Name of your university/school",
                major: "ENTER YOUR MAJOR",
                year: "Graduation year",
            },
        ];
        setEducation(updatedEdu);
    };

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
        const htmlContent = resumeRef.current.innerHTML;

        try {
            // saving to database 
            const saveResponse = await axiosClient.post('/store-resume', {
                html_content: htmlContent,
            });
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
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            if (error.code === 'ERR_BAD_REQUEST') {
                toast.error('Forbidden!!')
            }
            console.error('Error generating PDF:', error);
        }
    };

    const styles = {
        display: 'block',
        color: 'black',
        fontFamily: 'sans-serif',
        backgroundColor: 'transparent',
        outline: 'none',
        border: 'none',
        width: '100%'
    };

    const titleStyles = {
        display: 'block',
        color: 'black',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        fontFamily: 'sans-serif',
        backgroundColor: 'transparent',
        outline: 'none',
        border: 'none',
        width: '100%'
    };

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
            {/* resume container  */}
            <div ref={resumeRef} className="mx-auto h-fit w-[793px]">
                {/* the resume  */}
                <div className="p-8 w-full h-fit bg-white">
                    <input
                        readOnly={!isEdit}
                        type="text"
                        value={formData.fullname}
                        name="fullname"
                        onChange={handleChange}
                        style={styles}
                    />
                    <input
                        readOnly={!isEdit}
                        type="text"
                        value={formData.jobPosition}
                        name="jobPosition"
                        onChange={handleChange}
                        style={styles}
                    />
                    <input
                        readOnly={!isEdit}
                        type="text"
                        value={formData.address}
                        name="address"
                        onChange={handleChange}
                        style={styles}
                    />
                    <input
                        readOnly={!isEdit}
                        type="text"
                        value={formData.email}
                        name="email"
                        onChange={handleChange}
                        style={styles}
                    />
                    <input
                        readOnly={!isEdit}
                        type="text"
                        value={formData.phoneNumber}
                        name="phoneNumber"
                        onChange={handleChange}
                        style={styles}
                    />
                    <input
                        readOnly={!isEdit}
                        type="text"
                        value={formData.website}
                        name="website"
                        onChange={handleChange}
                        style={styles}
                    />
                    <input
                        readOnly={!isEdit}
                        type="text"
                        value={titles.summary}
                        name="summary"
                        onChange={handleTitleChange}
                        style={titleStyles}
                    />
                    {
                        isEdit ?
                            <Dialog>
                                <DialogTrigger className="w-full text-left">{formData.personalSummary}</DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{titles.summary}</DialogTitle>
                                        <DialogDescription>You can close this pop up after you are done!</DialogDescription>
                                        <Textarea
                                            value={formData.personalSummary}
                                            name="personalSummary"
                                            onChange={handleChange}
                                        />
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                            :
                            <div>
                                {formData.personalSummary}
                            </div>
                    }

                    {/* education section */}
                    <div>
                        {(education && education.length) > 0 ? (
                            <>
                                {/* title  */}
                                <input
                                    readOnly={!isEdit}
                                    type="text"
                                    value={titles.education}
                                    name="education"
                                    onChange={handleTitleChange}
                                    style={titleStyles}
                                />
                                {education.map((edu, i) => (
                                    <div key={i} className='relative'>
                                        <input
                                            readOnly={!isEdit}
                                            type="text"
                                            value={edu.university}
                                            name="university"
                                            onChange={(e) => handleEducationChange(i, e)}
                                            style={styles}
                                        />
                                        <input
                                            readOnly={!isEdit}
                                            type="text"
                                            value={edu.major}
                                            name="major"
                                            onChange={(e) => handleEducationChange(i, e)}
                                            style={styles}
                                        />
                                        <input
                                            readOnly={!isEdit}
                                            type="text"
                                            value={edu.year}
                                            name="year"
                                            onChange={(e) => handleEducationChange(i, e)}
                                            style={styles}
                                        />
                                        {
                                            isEdit && <Button
                                                variant="ghost"
                                                className="py-1 px-2 absolute top-0 right-0 text-lg text-destructive hover:opacity-85 hover:text-destructive transition-all"
                                                onClick={() => removeEducation(i)}
                                            >
                                                <FaRegTrashCan />
                                            </Button>
                                        }
                                    </div>
                                ))}
                            </>
                        ) : null}
                    </div>
                    {isEdit &&
                        <div
                            onClick={addEducation}
                            className="my-2 p-2 font-bold cursor-pointer w-full flex items-center justify-center gap-1 text-primary bg-[#DCE6F6] hover:opacity-80 rounded-md transition-all"
                        >
                            <FaPlus /> Add Education
                        </div>
                    }

                    {/* experience section */}
                    <div>
                        {(experiences && experiences.length) > 0 ? (
                            <>
                                {/* title  */}
                                <input
                                    readOnly={!isEdit}
                                    type="text"
                                    value={titles.experience}
                                    name="experience"
                                    onChange={handleTitleChange}
                                    style={titleStyles}
                                />
                                {experiences.map((exp, i) => (
                                    <div key={i} className='relative'>
                                        <input
                                            readOnly={!isEdit}
                                            type="text"
                                            value={exp.companyAndLocation}
                                            name="companyAndLocation"
                                            onChange={(e) => handleExpChange(i, e)}
                                            style={styles}
                                        />
                                        <input
                                            readOnly={!isEdit}
                                            type="text"
                                            value={exp.title}
                                            name="title"
                                            onChange={(e) => handleExpChange(i, e)}
                                            style={styles}
                                        />
                                        <input
                                            readOnly={!isEdit}
                                            type="text"
                                            value={exp.year}
                                            name="year"
                                            onChange={(e) => handleExpChange(i, e)}
                                            style={styles}
                                        />
                                        {
                                            isEdit ?
                                                <Dialog>
                                                    <DialogTrigger className="w-full text-left">{exp.description}</DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Experience description</DialogTitle>
                                                            <DialogDescription>You can close this pop up after you are done!</DialogDescription>
                                                            <Textarea
                                                                value={exp.description}
                                                                name="description"
                                                                onChange={(e) => handleExpChange(i, e)}
                                                            />
                                                        </DialogHeader>
                                                    </DialogContent>
                                                </Dialog>
                                                :
                                                <div>
                                                    {exp.description}
                                                </div>
                                        }
                                        {
                                            isEdit && <Button
                                                variant="ghost"
                                                className="py-1 px-2 absolute top-0 right-0 text-lg text-destructive hover:opacity-85 hover:text-destructive transition-all"
                                                onClick={() => removeExperience(i)}
                                            >
                                                <FaRegTrashCan />
                                            </Button>
                                        }
                                    </div>
                                ))}
                            </>
                        ) : null}
                    </div>
                    {isEdit &&
                        <div
                            onClick={addExperience}
                            className="my-2 p-2 font-bold cursor-pointer w-full flex items-center justify-center gap-1 text-primary bg-[#DCE6F6] hover:opacity-80 rounded-md transition-all"
                        >
                            <FaPlus /> Add Experience
                        </div>
                    }

                    {/* skills section */}
                    <div>
                        {(skills && skills.length) > 0 ? (
                            <>
                                {/* title  */}
                                <input
                                    readOnly={!isEdit}
                                    type="text"
                                    value={titles.skills}
                                    name="skills"
                                    onChange={handleTitleChange}
                                    style={titleStyles}
                                />
                                {skills.map((skill, i) => (
                                    <div key={i} className='relative'>
                                        <input
                                            readOnly={!isEdit}
                                            type="text"
                                            value={skill.title}
                                            name="title"
                                            onChange={(e) => handleSkillsChange(i, e)}
                                            style={styles}
                                        />
                                        {
                                            isEdit && <Button
                                                variant="ghost"
                                                className="py-1 px-2 absolute top-0 right-0 text-lg text-destructive hover:opacity-85 hover:text-destructive transition-all"
                                                onClick={() => removeSkill(i)}
                                            >
                                                <FaRegTrashCan />
                                            </Button>
                                        }
                                    </div>
                                ))}
                            </>
                        ) : null}
                    </div>
                    {isEdit &&
                        <div
                            onClick={addSkill}
                            className="my-2 p-2 font-bold cursor-pointer w-full flex items-center justify-center gap-1 text-primary bg-[#DCE6F6] hover:opacity-80 rounded-md transition-all"
                        >
                            <FaPlus /> Add Skill
                        </div>
                    }
                </div>
            </div >
            {/* end of resume */}

            <Button
                disabled={isEdit}
                variant="default"
                className="my-3 block ml-auto"
                onClick={generatePdf}
            >
                Save and download
            </Button>
        </>
    );
};

export default Template;