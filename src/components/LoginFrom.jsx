import PropTypes from "prop-types"

const LoginForm = ({ username, setUsername, password, setPassword, handleLogin }) => {
    return (
        <form onSubmit={handleLogin}>
            <h2>Login to the application</h2>
            <p>username</p>
            <input
                type="text"
                value={username}
                name="Username"
                onChange={({ target }) => setUsername(target.value)}
            />
            <p>password</p>
            <input
                type="text"
                value={password}
                onChange={({ target }) => { setPassword(target.value) }}
            />
            <button type='submit' >Login</button>
        </form>
    )
}

LoginForm.PropTypes = {
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    setUsername: PropTypes.func.isRequired,
    setPassword: PropTypes.func.isRequired,
    handleLogin: PropTypes.func.isRequired
}
export default LoginForm