import { Button } from "@/components/ui/button";
import { FaRegTrashCan } from "react-icons/fa6";

function ResumeHeader({ styles, isEdit, avatarUrl, setAvatarUrl, formData, titleStyles, handleChange }) {
    const imgStyles = {
        backgroundImage: `url(${avatarUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '150px',
        height: '150px',
        borderRadius: '50%'
    }
    return (
        <div style={{ marginBottom: '15px' }}>
            <table style={{ marginBottom: '15px' }}>
                <tbody>
                    <tr>
                        <td style={{ width: '525px' }}>
                            <input
                                readOnly={!isEdit}
                                type="text"
                                value={formData.fullname}
                                name="fullname"
                                onChange={handleChange}
                                style={titleStyles}
                            />
                            <input
                                readOnly={!isEdit}
                                type="text"
                                value={formData.jobPosition}
                                name="jobPosition"
                                onChange={handleChange}
                                style={{ ...styles, fontSize: '17px', textTransform: 'capitalize' }}
                            />
                        </td>
                        <td className="relative">
                            {avatarUrl &&
                                <div style={imgStyles}></div>
                            }
                            {
                                isEdit && avatarUrl &&
                                <Button
                                    variant="ghost"
                                    className="absolute top-0 right-0 p-0 text-lg text-destructive hover:bg-transparent hover:opacity-85 hover:text-destructive transition-all"
                                    onClick={() => setAvatarUrl(null)}
                                >
                                    <FaRegTrashCan />
                                </Button>
                            }
                        </td>
                    </tr>
                </tbody>
            </table>
            <table style={{ width: '100%' }}>
                <tbody>
                    <tr>
                        <td>
                            <input
                                readOnly={!isEdit}
                                type="text"
                                value={formData.phoneNumber}
                                name="phoneNumber"
                                onChange={handleChange}
                                style={{ ...styles, fontSize: '.9rem' }}
                            />
                            <input
                                readOnly={!isEdit}
                                type="text"
                                value={formData.email}
                                name="email"
                                onChange={handleChange}
                                style={{ ...styles, fontSize: '.9rem' }}
                            />
                        </td>
                        <td>
                            <input
                                readOnly={!isEdit}
                                type="text"
                                value={formData.address}
                                name="address"
                                onChange={handleChange}
                                style={{ ...styles, fontSize: '.9rem' }}
                            />
                            <input
                                readOnly={!isEdit}
                                type="text"
                                value={formData.website}
                                name="website"
                                onChange={handleChange}
                                style={{ ...styles, fontSize: '.9rem' }}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>);
}

export default ResumeHeader;