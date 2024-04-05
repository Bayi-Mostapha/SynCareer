import { useCallback, useContext, useEffect, useState } from 'react';
import { authContext } from '../../contexts/AuthWrapper';
import { axiosClient } from '../../api/axios';
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useDropzone } from 'react-dropzone'
// shadcn 
import DnDFile from "@/components/general/dnd-file";
import { SlPicture } from "react-icons/sl";
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import UserPaddedContent from '@/components/user/padded-content';
import { FaRegTrashCan } from 'react-icons/fa6';
import { IoMdAddCircle } from 'react-icons/io';
import { Label } from '@/components/ui/label';

function ProfilePage() {
    const [isFetching, setIsFetching] = useState(false)
    const [experience, setExperience] = useState([])
    const [education, setEducation] = useState([])
    const [skills, setSkills] = useState([])
    const [image, setImage] = useState(null);
    const { user, getUser } = useContext(authContext);
    const form = useForm({
        //resolver: yupResolver(schema),
        defaultValues: {
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            job_title: user.job_title || "",
            email: user.email || "",
            phone_number: user.phone_number || "",
            birthday: user.birthday || "",
            bio: user.bio || "",
        }
    });
    const { handleSubmit, control } = form;

    async function getData() {
        try {
            setIsFetching(true)
            const res = await axiosClient.get('/experience')
            setExperience(res.data.experience)

            const res2 = await axiosClient.get('/education')
            setEducation(res2.data.education)

            const res3 = await axiosClient.get('/skills')
            setSkills(res3.data.skills)
        } catch (error) {
            console.log(error.response)
        } finally {
            setIsFetching(false)
        }
    }
    useEffect(() => {
        getData()
    }, [])

    const onDrop = useCallback(acceptedFiles => {
        if (!acceptedFiles[0]) {
            toast.error('Please upload an image')
            return;
        } setImage(acceptedFiles[0])
    }, [])
    const dropZone = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png']
        }
    })

    const submit = async (data) => {
        if (image) {
            const formData = new FormData();
            formData.append('picture', image, image.path);
            try {
                const response = await axiosClient.post('/profile-picture', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } catch (error) {
                toast.error(error.response.data.message)
            }
        }

        try {
            data = { ...data, experience, education, skills }
            const response = await axiosClient.put('/profile', data);
            getUser()
            toast.success(response.data.message)
        } catch (error) {
            toast.error(error.response.data.message)
        }
    };

    function addExperience() {
        setExperience(prev => [...prev, {
            beginning_date: '2024-01-01',
            end_date: '2024-02-01',
            position: 'position',
            company_name: 'company',
        }])
    }
    const handleExperienceChange = (index, e) => {
        const { name, value } = e.target;
        setExperience(prev => {
            const updatedExperiences = [...prev];
            updatedExperiences[index][name] = value;
            return updatedExperiences
        });
    };
    const removeExperience = (index) => {
        setExperience(prev => {
            const updatedExperiences = [...prev];
            updatedExperiences.splice(index, 1);
            return updatedExperiences;
        });
    };

    function addEducation() {
        setEducation(prev => [...prev, {
            graduation_date: '2024-01-01',
            school_name: 'school name',
            degree: 'your degree',
        }])
    }
    const handleEducationChange = (index, e) => {
        const { name, value } = e.target;
        setEducation(prev => {
            const updatedEducations = [...prev];
            updatedEducations[index][name] = value;
            return updatedEducations
        });
    };
    const removeEducation = (index) => {
        setEducation(prev => {
            const updatedEducations = [...prev];
            updatedEducations.splice(index, 1);
            return updatedEducations;
        });
    };

    function addSkill() {
        setSkills(prev => [...prev, {
            content: 'your skill',
        }])
    }
    const handleSkillChange = (index, e) => {
        const { name, value } = e.target;
        setSkills(prev => {
            const updatedSkills = [...prev];
            updatedSkills[index][name] = value;
            return updatedSkills
        });
    };
    const removeSkill = (index) => {
        setSkills(prev => {
            const updatedSkills = [...prev];
            updatedSkills.splice(index, 1);
            return updatedSkills;
        });
    };

    return (
        <UserPaddedContent>
            {
                isFetching ?
                    "Please hold while we're getting your data"
                    :
                    <Form {...form}>
                        <form onSubmit={handleSubmit(submit)} >
                            <div className='w-full flex justify-center flex-row gap-10'>
                                <div className='flex flex-col items-center gap-2'>
                                    <DnDFile {...dropZone} file='picture' icon={<SlPicture className="text-8xl text-gray-400" />} />
                                    <FormField
                                        control={control}
                                        name="first_name"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>First Name</FormLabel>
                                                    <FormControl>
                                                        <Input className="pr-10 w-96" placeholder="" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )
                                        }}
                                    />

                                    <FormField
                                        control={control}
                                        name="last_name"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Last Name</FormLabel>
                                                    <FormControl>
                                                        <Input className="pr-10 w-96" placeholder="" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )
                                        }}
                                    />

                                    <FormField
                                        control={control}
                                        name="job_title"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Job Title</FormLabel>
                                                    <FormControl>
                                                        <Input className="pr-10 w-96" placeholder="" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )
                                        }}
                                    />

                                    <FormField
                                        control={control}
                                        name="email"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input className="pr-10 w-96" placeholder="" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )
                                        }}
                                    />

                                    <FormField
                                        control={control}
                                        name="phone_number"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Phone Number</FormLabel>
                                                    <FormControl>
                                                        <Input className="pr-10 w-96" placeholder="" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )
                                        }}
                                    />

                                    <FormField
                                        control={control}
                                        name="birthday"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Birthday</FormLabel>
                                                    <FormControl>
                                                        <Input className="pr-10 w-96" placeholder="" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )
                                        }}
                                    />
                                    <FormField
                                        control={control}
                                        name="bio"
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel>Bio</FormLabel>
                                                    <FormControl>
                                                        <Textarea className="pr-10 bg-background w-96" placeholder="" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )
                                        }}
                                    />
                                </div>
                                <div className='flex flex-col items-center gap-2'>
                                    <div className="w-96 flex justify-between">
                                        <h4 className='text-lg font-medium'>Experience</h4>
                                        <Button variant='outline' className='ml-auto flex gap-2' onClick={addExperience} type='button'>
                                            Add Experience <IoMdAddCircle className='text-xl text-primary' />
                                        </Button>
                                    </div>
                                    {
                                        experience.map((exp, i) =>
                                            <div key={'exp_' + i} className='bg-[#F8F8FF] my-2 p-4 w-96 border rounded'>
                                                <div className="mb-1 flex justify-between">
                                                    <Label>Experience {i + 1}</Label>
                                                    <Button onClick={() => removeExperience(i)} variant='destructive' type='button'>
                                                        <FaRegTrashCan className='text-lg' />
                                                    </Button>
                                                </div>
                                                <Input
                                                    type="text"
                                                    name="beginning_date"
                                                    value={exp.beginning_date}
                                                    onChange={(e) => handleExperienceChange(i, e)}
                                                />
                                                <Input
                                                    type="text"
                                                    name="end_date"
                                                    value={exp.end_date}
                                                    onChange={(e) => handleExperienceChange(i, e)}
                                                />
                                                <Input
                                                    type="text"
                                                    name="position"
                                                    value={exp.position}
                                                    onChange={(e) => handleExperienceChange(i, e)}
                                                />
                                                <Input
                                                    type="text"
                                                    name="company_name"
                                                    value={exp.company_name}
                                                    onChange={(e) => handleExperienceChange(i, e)}
                                                />
                                            </div>
                                        )
                                    }

                                    <div className="w-96 flex justify-between">
                                        <h4 className='text-lg font-medium'>Education</h4>
                                        <Button variant='outline' className='ml-auto flex gap-2' onClick={addEducation} type='button'>
                                            Add Education <IoMdAddCircle className='text-xl text-primary' />
                                        </Button>
                                    </div>
                                    {
                                        education.map((edu, i) =>
                                            <div key={'edu_' + i} className='bg-[#F8F8FF] my-2 p-4 w-96 border rounded'>
                                                <div className="mb-1 flex justify-between">
                                                    <Label>Education {i + 1}</Label>
                                                    <Button onClick={() => removeEducation(i)} variant='destructive' type='button'>
                                                        <FaRegTrashCan className='text-lg' />
                                                    </Button>
                                                </div>
                                                <Input
                                                    type="text"
                                                    name="graduation_date"
                                                    value={edu.graduation_date}
                                                    onChange={(e) => handleEducationChange(i, e)}
                                                />
                                                <Input
                                                    type="text"
                                                    name="school_name"
                                                    value={edu.school_name}
                                                    onChange={(e) => handleEducationChange(i, e)}
                                                />
                                                <Input
                                                    type="text"
                                                    name="degree"
                                                    value={edu.degree}
                                                    onChange={(e) => handleEducationChange(i, e)}
                                                />
                                            </div>
                                        )
                                    }
                                    <div className="w-96 flex justify-between">
                                        <h4 className='text-lg font-medium'>Skills</h4>
                                        <Button variant='outline' className='ml-auto flex gap-2' onClick={addSkill} type='button'>
                                            Add Skill <IoMdAddCircle className='text-xl text-primary' />
                                        </Button>
                                    </div>
                                    {
                                        skills.map((skill, i) =>
                                            <div key={'skill_' + i} className='bg-[#F8F8FF] my-2 p-4 w-96 border rounded'>
                                                <div className="mb-1 flex justify-between">
                                                    <Label>Skill {i + 1}</Label>
                                                    <Button onClick={() => removeSkill(i)} variant='destructive' type='button'>
                                                        <FaRegTrashCan className='text-lg' />
                                                    </Button>
                                                </div>
                                                <Input
                                                    type="text"
                                                    name="content"
                                                    value={skill.content}
                                                    onChange={(e) => handleSkillChange(i, e)}
                                                />
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                            <Button variant='default' type="submit" className='mt-4 ml-auto flex gap-3 w-fit'>
                                Save
                            </Button>
                        </form>
                    </Form>
            }
        </UserPaddedContent>
    );
}

export default ProfilePage;