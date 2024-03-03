function PrimaryBtn({ className, type, body, disabled = false }) {
    return (
        <button className={'w-fit px-10 py-2 bg-primary text-white font-semibold capitalize rounded-lg hover:opacity-95 transition-opacity duration-300 active:opacity-90 '+className} type={type} disabled={disabled}>
            {body}
        </button>
    );
}

export default PrimaryBtn;