import { axiosClient } from "@/api/axios";
import CompanyPaddedContent from "@/components/company/padded-content";
import SynCareerLoader from "@/components/general/syncareer-loader";
import getUserPicture from "@/functions/get-user-pic";
import { JOBOFFER_LINK_BASE } from "@/router";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function Profile() {
    const { id, uid } = useParams();
    const [isFetching, setIsFetching] = useState(false)
    const [user, setUser] = useState({})

    useEffect(() => {
        getUserInfo()
    }, [])
    const getUserInfo = async () => {
        setIsFetching(true)
        axiosClient.get(`candidat/${uid}`)
            .then(res => {
                getUserPicture(res.data.picture)
                    .then(pic => {
                        setUser({ ...res.data, picture: pic });
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
                        <Link to={`${JOBOFFER_LINK_BASE}/${id}`}>Go back</Link>
                        <img className="w-52 h-52 object-cover rounded-full" src={user.picture} alt={`${user.first_name}_image`} />
                        <p>first name: {user.first_name}</p>
                        <p>last name: {user.last_name}</p>
                        <p>email: {user.email}</p>
                        <p>phone number: {user.phone_number}</p>
                        <p>job title: {user.job_title}</p>
                        <p>birthday: {user.birthday}</p>
                        <p>bio: {user.bio}</p>
                        <p>joined: {formatDate(user.created_at)}</p>
                    </div>
            }
        </CompanyPaddedContent>
    );
}

export default Profile;