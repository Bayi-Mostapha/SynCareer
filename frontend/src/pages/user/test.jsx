import { useRef, useState } from "react";

// shadcn 
import { Button } from "@/components/ui/button";
import { axiosClient } from "@/api/axios";
import { toast } from "sonner";


const Template = () => {
    const resumeRef = useRef();

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
            year: "Graduation year",
            major: "ENTER YOUR MAJOR",
            university: "Name of your university/school",
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
        // Create a copy of the workExperiences array and remove the experience at the given index
        const updatedExperiences = [...experiences];
        updatedExperiences.splice(index, 1);
        // Update the state with the modified array
        setExperiences(updatedExperiences);
    };

    const addExperience = () => {
        // Create a copy of the workExperiences array and add a new experience
        const updatedExperiences = [
            ...experiences,
            {
                year: "2012 - 2014",
                title: "Job Position Here",
                companyAndLocation: "Company Name / Location here",
                description:
                    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatibus minima tenetur nostrum quo aliquam dolorum incidunt.",
            },
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
        const updatedSkills = [...skills];
        updatedSkills.splice(index, 1);
        setSkills(updatedSkills);
    };

    const addSkill = () => {
        const updatedSkills = [
            ...skills,
            {
                title: "skill1",
            },
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
        const updatedEdu = [...education];
        updatedEdu.splice(index, 1);
        setEducation(updatedEdu);
    };

    const addEducation = () => {
        const updatedEdu = [
            ...education,
            {
                major: "ENTER YOUR MAJOR",
                university: "Name of your university / college 2005-2009",
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

    function textAreaAdjustHeight(e) {
        e.target.style.height = "1px";
        e.target.style.height = (e.target.scrollHeight) + "px";
    }

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
        backgroundColor: 'transparent',
        outline: 'none',
        border: 'none',
        resize: 'none',
        width: '100%'
    };

    return (
        <>
            <Button
                variant="default"
                onClick={generatePdf}
            >
                Save and Download
            </Button>
            {/* the resume  */}
            <div ref={resumeRef} className="h-fit w-full">
                <div className="p-8 w-full h-fit bg-white">
                    <input
                        type="text"
                        defaultValue={formData.fullname}
                        name="fullname"
                        onChange={handleChange}
                        style={styles}
                    />
                    <input
                        type="text"
                        defaultValue={formData.jobPosition}
                        name="jobPosition"
                        onChange={handleChange}
                        style={styles}
                    />
                    <input
                        type="text"
                        defaultValue={formData.address}
                        name="address"
                        onChange={handleChange}
                        style={styles}
                    />
                    <input
                        type="text"
                        defaultValue={formData.email}
                        name="email"
                        onChange={handleChange}
                        style={styles}
                    />
                    <input
                        type="text"
                        defaultValue={formData.phoneNumber}
                        name="website"
                        onChange={handleChange}
                        style={styles}
                    />
                    <input
                        type="text"
                        defaultValue={formData.website}
                        name="website"
                        onChange={handleChange}
                        style={styles}
                    />
                    <textarea
                        defaultValue={formData.personalSummary}
                        name="personalSummary"
                        onChange={handleChange}
                        onKeyDownCapture={textAreaAdjustHeight}
                        rows="2"
                        style={styles}
                    />
                </div>
            </div>
        </>
    );
};

export default Template;