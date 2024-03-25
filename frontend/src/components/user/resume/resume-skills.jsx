import { FaRegTrashCan } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";

function ResumeSkills({ skills, setSkills, styles, isEdit, handleTitleChange, titles, titleStyles }) {
    const handleSkillChange = (index, e) => {
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
    return (
        <div style={{ marginBottom: '15px' }}>
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
                            // <div key={i} className='relative'>
                            <>
                                <input
                                    readOnly={!isEdit}
                                    type="text"
                                    value={skill.title}
                                    name="title"
                                    onChange={(e) => handleSkillChange(i, e)}
                                    style={{ ...styles, width: 'auto' }}
                                />
                                {
                                    isEdit && <Button
                                        variant="ghost"
                                        className="py-1 px-2 text-lg text-destructive hover:opacity-85 hover:text-destructive transition-all"
                                        onClick={() => removeSkill(i)}
                                    >
                                        <FaRegTrashCan />
                                    </Button>
                                }
                            </>
                            // </div>
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
    );
}

export default ResumeSkills;