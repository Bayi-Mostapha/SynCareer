import { axiosClient } from "@/api/axios";
import CompanyPaddedContent from "@/components/company/padded-content";
import { JOBOFFER_LINK_BASE } from "@/router";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function Profile() {
    const { id, uid } = useParams();
    const [user, setUser] = useState({})
    const [imageUrl, setImageUrl] = useState(null)

    useEffect(() => {
        getUserInfo()
    }, [])
    const getUserInfo = async () => {
        axiosClient.get(`candidat/${uid}`)
            .then(res => {
                setUser(res.data);
                axiosClient.get(`storage/user-pictures/${res.data.picture}`, {
                    responseType: 'blob'
                })
                    .then(imgRes => {
                        setImageUrl(URL.createObjectURL(imgRes.data))
                    }).catch(imgErr => {
                        console.log(imgErr)
                    })
            })
            .catch(err => {
                console.log("Error", err)
            })
    }

    function formatDate(dateString) {
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    }
    return (
        <CompanyPaddedContent>
            <Link to={`${JOBOFFER_LINK_BASE}/${id}`}>Go back</Link>
            <img className="w-52 h-52 object-cover rounded-full" src={imageUrl} alt={`${user.first_name}_image`} />
            <p>first name: {user.first_name}</p>
            <p>last name: {user.last_name}</p>
            <p>email: {user.email}</p>
            <p>phone number: {user.phone_number}</p>
            <p>job title: {user.job_title}</p>
            <p>birthday: {user.birthday}</p>
            <p>bio: {user.bio}</p>
            <p>joined: {formatDate(user.created_at)}</p>
        </CompanyPaddedContent>
    );
}

export default Profile;