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
        <>
            <table style={avatarUrl && { borderCollapse: 'separate', borderSpacing: '30px' }}>
                <tr>
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
                    <td style={{ width: '100%' }}>
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
                            style={{ ...styles, fontSize: '.85rem', marginTop: '-5px' }}
                        />
                    </td>
                </tr>
            </table>
            <table className="my-8" style={{ width: '100%' }}>
                <tbody>
                    <tr>
                        <td className="pl-6">
                            <ul className="pl-5" style={{ listStyleType: 'disc', color: '#334155' }}>
                                <li>
                                    <input
                                        readOnly={!isEdit}
                                        type="text"
                                        value={formData.phoneNumber}
                                        name="phoneNumber"
                                        onChange={handleChange}
                                        style={{ ...styles, fontSize: '.8rem' }}
                                    />
                                </li>
                                <li>
                                    <input
                                        readOnly={!isEdit}
                                        type="text"
                                        value={formData.email}
                                        name="email"
                                        onChange={handleChange}
                                        style={{ ...styles, fontSize: '.8rem' }}
                                    />
                                </li>
                            </ul>
                        </td>
                        <td>
                            <ul lassName="pl-5" style={{ listStyleType: 'disc', color: '#334155' }}>
                                <li>
                                    <input
                                        readOnly={!isEdit}
                                        type="text"
                                        value={formData.address}
                                        name="address"
                                        onChange={handleChange}
                                        style={{ ...styles, fontSize: '.8rem' }}
                                    />
                                </li>
                                <li>
                                    <input
                                        readOnly={!isEdit}
                                        type="text"
                                        value={formData.website}
                                        name="website"
                                        onChange={handleChange}
                                        style={{ ...styles, fontSize: '.8rem' }}
                                    />
                                </li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>);
}

export default ResumeHeader;