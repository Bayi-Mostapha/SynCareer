import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, name, register, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-background p-5 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...register && register(name)}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }
