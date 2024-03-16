import { FaRegTrashCan } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";

function ResumeEducation({ education, setEducation, styles, isEdit, handleTitleChange, titles, titleStyles }) {
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
                major: "Your Major",
                year: "Graduation year",
            },
        ];
        setEducation(updatedEdu);
    };
    return (
        <>
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
                                <table>
                                    <tr>
                                        <td style={{ width: '80%' }}>
                                            <input
                                                readOnly={!isEdit}
                                                type="text"
                                                value={edu.major}
                                                name="major"
                                                onChange={(e) => handleEducationChange(i, e)}
                                                style={{ ...styles, fontWeight: '600', }}
                                            />
                                        </td>
                                        <td style={{ width: '20%' }}>
                                            <input
                                                readOnly={!isEdit}
                                                type="text"
                                                value={edu.year}
                                                name="year"
                                                onChange={(e) => handleEducationChange(i, e)}
                                                style={styles}
                                            />
                                        </td>
                                    </tr>
                                </table>
                                <input
                                    readOnly={!isEdit}
                                    type="text"
                                    value={edu.university}
                                    name="university"
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
        </>
    );
}

export default ResumeEducation;