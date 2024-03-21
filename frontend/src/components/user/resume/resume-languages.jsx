import { FaRegTrashCan } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";

function ResumeLanguages({ languages, setLanguages, styles, isEdit, handleTitleChange, titles, titleStyles }) {
    const handleLanguageChange = (index, e) => {
        const { name, value } = e.target;
        const updatedLanguages = [...languages];
        updatedLanguages[index][name] = value;
        setLanguages(updatedLanguages);
    };
    const removeLanguage = (index) => {
        setLanguages(prev => {
            const updatedLanguages = [...prev];
            updatedLanguages.splice(index, 1);
            return updatedLanguages;
        });
    };
    const addLanguage = () => {
        const updatedLanguages = [
            ...languages,
            {
                title: "English",
                level: "Advanced",
            }
        ];
        setLanguages(updatedLanguages);
    };
    return (
        <div style={{ marginBottom: '15px' }}>
            <div>
                {(languages && languages.length) > 0 ? (
                    <>
                        {/* title  */}
                        <input
                            readOnly={!isEdit}
                            type="text"
                            value={titles.languages}
                            name="languages"
                            onChange={handleTitleChange}
                            style={titleStyles}
                        />
                        {languages.map((language, i) => (
                            <>
                                <input
                                    readOnly={!isEdit}
                                    type="text"
                                    value={language.title}
                                    name="title"
                                    onChange={(e) => handleLanguageChange(i, e)}
                                    style={{ ...styles, fontWeight: '600' }}
                                />
                                <input
                                    readOnly={!isEdit}
                                    type="text"
                                    value={language.level}
                                    name="level"
                                    onChange={(e) => handleLanguageChange(i, e)}
                                    style={{ ...styles, fontSize: '.85rem' }}
                                />
                                {
                                    isEdit && <Button
                                        variant="ghost"
                                        className="py-1 px-2 absolute top-0 right-0 text-lg text-destructive hover:opacity-85 hover:text-destructive transition-all"
                                        onClick={() => removeLanguage(i)}
                                    >
                                        <FaRegTrashCan />
                                    </Button>
                                }
                            </>
                        ))}
                    </>
                ) : null}
            </div>
            {isEdit &&
                <div
                    onClick={addLanguage}
                    className="my-2 p-2 font-bold cursor-pointer w-full flex items-center justify-center gap-1 text-primary bg-[#DCE6F6] hover:opacity-80 rounded-md transition-all"
                >
                    <FaPlus /> Add Language
                </div>
            }
        </div>
    );
}

export default ResumeLanguages;