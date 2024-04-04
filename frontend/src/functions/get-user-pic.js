import { axiosClient } from "@/api/axios";
import defaultCompanyImage from '../../public/default-company.jpg';
import defaultImage from '../../public/default-user.jpg';

export default async function getUserPicture(fileName, type = 'user') {
    let picture = defaultImage;
    if (type === 'company') {
        picture = defaultCompanyImage
    }
    if (fileName) {
        let res = await axiosClient.get(`/storage/user-pictures/${fileName}`, {
            responseType: 'blob'
        });
        picture = URL.createObjectURL(res.data);
    }
    return picture;
}