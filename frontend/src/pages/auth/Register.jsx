function Register() {
    return (
        <>
            <form>
                <input type="text" name="email" placeholder="email" />
                <input type="password" name="password" placeholder="password" />
                <input type="password" name="password_confirmation" placeholder="confirm password" />
                <button type="submit">register</button>
            </form>
        </>
    );
}

export default Register;