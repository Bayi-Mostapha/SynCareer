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

function ResumeProjects({ projects, setProjects, styles, isEdit, handleTitleChange, titles, titleStyles }) {
    const handleProjectChange = (index, e) => {
        const { name, value } = e.target;
        const updatedProjects = [...projects];
        updatedProjects[index][name] = value;
        setProjects(updatedProjects);
    };
    const removeProject = (index) => {
        setProjects(prev => {
            const updatedProjects = [...prev];
            updatedProjects.splice(index, 1);
            return updatedProjects;
        });
    };
    const addProject = () => {
        const updatedProjects = [
            ...projects,
            {
                year: "From-To",
                title: "Project",
                description: "Description"
            }
        ];
        setProjects(updatedProjects);
    };
    return (
        <div style={{ marginBottom: '15px' }}>
            <div>
                {(projects && projects.length) > 0 ? (
                    <>
                        {/* title  */}
                        <input
                            readOnly={!isEdit}
                            type="text"
                            value={titles.projects}
                            name="projects"
                            onChange={handleTitleChange}
                            style={titleStyles}
                        />
                        {projects.map((project, i) => (
                            <div key={i} className='relative'>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td width="450px">
                                                <input
                                                    readOnly={!isEdit}
                                                    type="text"
                                                    value={project.title}
                                                    name="title"
                                                    onChange={(e) => handleProjectChange(i, e)}
                                                    style={{ ...styles, fontWeight: '600', }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    readOnly={!isEdit}
                                                    type="text"
                                                    value={project.year}
                                                    name="year"
                                                    onChange={(e) => handleProjectChange(i, e)}
                                                    style={styles}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                {
                                    isEdit ?
                                        <Dialog>
                                            <DialogTrigger style={{ fontFamily: 'sans-serif' }} className="w-full text-left">{project.description}</DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Project description</DialogTitle>
                                                    <DialogDescription>You can close this pop up after you are done!</DialogDescription>
                                                    <Textarea
                                                        value={project.description}
                                                        name="description"
                                                        onChange={(e) => handleProjectChange(i, e)}
                                                    />
                                                </DialogHeader>
                                            </DialogContent>
                                        </Dialog>
                                        :
                                        <div style={{ fontFamily: 'sans-serif' }}>
                                            {project.description}
                                        </div>
                                }
                                {
                                    isEdit && <Button
                                        variant="ghost"
                                        className="py-1 px-2 absolute top-0 right-0 text-lg text-destructive hover:opacity-85 hover:text-destructive transition-all"
                                        onClick={() => removeProject(i)}
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
                    onClick={addProject}
                    className="my-2 p-2 font-bold cursor-pointer w-full flex items-center justify-center gap-1 text-primary bg-[#DCE6F6] hover:opacity-80 rounded-md transition-all"
                >
                    <FaPlus /> Add Project
                </div>
            }
        </div>
    );
}

export default ResumeProjects;