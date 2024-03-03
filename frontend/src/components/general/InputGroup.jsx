function InputGroup({ label = '', name = '', type = 'text', placeholder = '', register }) {
    return (
        <div className="w-full flex flex-col gap-1">
            <label className="text-sm text-label" htmlFor={name}>{label}</label>
            <input className="px-3 py-2 border border-lgray rounded-lg hover:border-primary transition-border duration-300 focus:outline-1 outline-primary" id={name} type={type} placeholder={placeholder} {...register(name)} autoComplete={name} />
        </div>
    );
}

export default InputGroup;