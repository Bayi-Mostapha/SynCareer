
import { forwardRef } from "react";
import { useState } from "react";
// icons 
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
// shadcn 
import { Input } from "../ui/input";

const PasswordInput = forwardRef(({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="relative">
            <Input
                type={showPassword ? 'text' : 'password'}
                className={className}
                ref={ref}
                {...props} />
            <button type="button" className="absolute top-3 right-4 text-gray-400" onClick={() => setShowPassword(prev => !prev)}>
                {
                    showPassword ? <FaRegEyeSlash /> : <FaRegEye />
                }
            </button>
        </div>
    );
});

export default PasswordInput;