import { axiosClient } from "@/api/axios";
import CompanyPaddedContent from "@/components/company/padded-content";
import SynCareerLoader from "@/components/general/syncareer-loader";
import { Badge } from "@/components/ui/badge";
import getUserPicture from "@/functions/get-user-pic";
import { JOBOFFER_LINK_BASE } from "@/router";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function Profile() {
    const { id, uid } = useParams();
    const [isFetching, setIsFetching] = useState(false)
    const [user, setUser] = useState({})
    const [skills, setSkills] = useState([])
    const [education, setEducation] = useState([])
    const [experience, setExperience] = useState([])

    useEffect(() => {
        getUserInfo()
    }, [])
    const getUserInfo = async () => {
        setIsFetching(true)
        axiosClient.get(`candidat/${uid}`)
            .then(res => {
                setSkills(res.data.skills)
                setEducation(res.data.education)
                setExperience(res.data.experience)
                console.log(res.data)
                getUserPicture(res.data.user.picture)
                    .then(pic => {
                        setUser({ ...res.data.user, picture: pic });
                    })
                    .catch(err => {
                        console.log("Error", err)
                    })
            })
            .catch(err => {
                console.log("Error", err)
            }).finally(() => {
                setIsFetching(false)
            })
    }

    function formatDate(dateString) {
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    }
    return (
        <CompanyPaddedContent>
            {
                isFetching ?
                    <SynCareerLoader className='absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2' />
                    :
                    <div>
                        <Link className="text-primary" to={`${JOBOFFER_LINK_BASE}/${id}`}>Go back</Link>
                        <div className="flex flex-col items-center md:flex-row gap-6">
                            <img className="w-52 h-52 object-cover rounded-full shadow-sm" src={user.picture} alt={`${user.first_name}_image`} />
                            <div>
                                <p>First name: {user.first_name}</p>
                                <p>Last name: {user.last_name}</p>
                                <p>Email: {user.email}</p>
                                {
                                    user.phone_number &&
                                    <p>Phone number: {user.phone_number}</p>
                                }
                                {
                                    user.job_title &&
                                    <p>Job title: {user.job_title}</p>
                                }
                                {
                                    user.birthday &&
                                    <p>Birthday: {user.birthday}</p>
                                }
                                <p>Joined: {formatDate(user.created_at)}</p>
                            </div>
                        </div>
                        {
                            user.bio &&
                            <p>Bio: {user.bio}</p>
                        }
                        {
                            education.length > 0 &&
                            <h2 className="mt-5 text-xl font-medium">Education: </h2>
                        }
                        {
                            education.map(edu => {
                                return <div className="my-3" key={'edu_' + edu.id}>
                                    <div className="flex flex-row items-center gap-6">
                                        <p className="font-medium capitalize text-lg">{edu.school_name}</p>
                                        <p className="text-xs text-gray-500">{formatDate(edu.graduation_date)}</p>
                                    </div>
                                    <p className="uppercase">{edu.degree}</p>
                                </div>
                            })
                        }
                        {
                            experience.length > 0 &&
                            <h2 className="mt-5 text-xl font-medium">Experience: </h2>
                        }
                        {
                            experience.map(exp => {
                                return <div className="my-3" key={'exp_' + exp.id}>
                                    <p className="font-medium capitalize text-lg">{exp.company_name}</p>
                                    <p>{exp.position}</p>
                                    <p className="text-xs text-gray-500">Started {formatDate(exp.beginning_date)}</p>
                                    <p className="text-xs text-gray-500">Ended {formatDate(exp.end_date)}</p>
                                </div>
                            })
                        }
                        {
                            skills.length > 0 &&
                            <h2 className="mt-5 text-xl font-medium">Skills: </h2>
                        }
                        {
                            skills.map(skill => {
                                return <Badge key={'skill_' + skill.id}>{skill.content}</Badge>
                            })
                        }
                    </div>
            }
        </CompanyPaddedContent>
    );
}

export default Profile;