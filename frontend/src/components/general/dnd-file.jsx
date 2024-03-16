// framer motion 
import { AnimatePresence, motion } from "framer-motion";
// icons 
import { SlPicture } from "react-icons/sl";
import { LuArrowBigDown } from "react-icons/lu";

function DnDFile({ getRootProps, getInputProps, isDragActive }) {
    return (
        <div {...getRootProps()} className="mx-auto w-fit p-4 bg-background flex justify-center items-center cursor-pointer rounded-md">
            <input {...getInputProps()} />
            <div className="w-fit flex items-center flex-col">
                {
                    isDragActive ?
                        <div className="flex flex-col items-center">
                            <AnimatePresence>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ rotate: 360, scale: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20
                                    }}
                                    exit={{ opacity: 0 }}

                                >
                                    <LuArrowBigDown className="text-8xl text-gray-400" />
                                </motion.div>
                            </AnimatePresence>

                            <p className="text-lg font-semibold text-primary">Drag & Drop your picture here</p>
                            <p className="text-gray-400 text-sm">You can let go</p>
                        </div>
                        :
                        <div className="flex flex-col items-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ rotate: 360, scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20
                                }}
                                exit={{ opacity: 0 }}
                            >
                                <SlPicture className="text-8xl text-gray-400" />
                            </motion.div>
                            <p className="text-lg font-semibold text-primary">Drag & Drop your picture here</p>
                            <p className="text-gray-400 text-sm">or click to browse</p>
                        </div>
                }
            </div>
        </div>
    );
}

export default DnDFile;