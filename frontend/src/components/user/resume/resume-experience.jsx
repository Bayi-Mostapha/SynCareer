import { FaRegTrashCan } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

function ResumeExperience({ experiences, setExperiences, styles, isEdit, handleTitleChange, titles, titleStyles }) {
    const handleExpChange = (index, e) => {
        const { name, value } = e.target;
        const updatedExperiences = [...experiences];
        updatedExperiences[index][name] = value;
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
        const updatedExperiences = [
            ...experiences,
            {
                year: " years",
                title: "Job Position Here",
                companyAndLocation: "Company Name / Location here",
                description: "desc"
            }
        ];
        setExperiences(updatedExperiences);
    };
    return (
        <>
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
                                <table>
                                    <tr>
                                        <td style={{ width: '80%' }}>
                                            <input
                                                readOnly={!isEdit}
                                                type="text"
                                                value={exp.title}
                                                name="title"
                                                onChange={(e) => handleExpChange(i, e)}
                                                style={{ ...styles, fontWeight: '600', }}
                                            />
                                        </td>
                                        <td style={{ width: '20%' }}>
                                            <input
                                                readOnly={!isEdit}
                                                type="text"
                                                value={exp.year}
                                                name="year"
                                                onChange={(e) => handleExpChange(i, e)}
                                                style={styles}
                                            />
                                        </td>
                                    </tr>
                                </table>
                                <input
                                    readOnly={!isEdit}
                                    type="text"
                                    value={exp.companyAndLocation}
                                    name="companyAndLocation"
                                    onChange={(e) => handleExpChange(i, e)}
                                    style={styles}
                                />
                                {
                                    isEdit ?
                                        <Dialog>
                                            <DialogTrigger style={{ fontFamily: 'sans-serif' }} className="w-full text-left">{exp.description}</DialogTrigger>
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
                                        <div style={{ fontFamily: 'sans-serif' }}>
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
        </>
    );
}

export default ResumeExperience;