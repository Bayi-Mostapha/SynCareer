import { axiosClient } from "@/api/axios";
import defaultImage from '../../public/default-user.jpg';

export default async function getUserPicture(fileName) {
    let picture = defaultImage;
    if (fileName) {
        let res = await axiosClient.get(`/storage/user-pictures/${fileName}`, {
            responseType: 'blob'
        });
        picture = URL.createObjectURL(res.data);
    }
    return picture;
}