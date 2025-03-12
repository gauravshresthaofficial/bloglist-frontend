import PropTypes from "prop-types"
import propTypes from "prop-types"

const LoginForm = ({ username, setUsername, password, setPassword, handleLogin }) => {
    return (
        <form onSubmit={handleLogin}>
            <h2>Login to the application</h2>
            <p>username</p>
            <input
                type="text"
                value={username}
                name="Username"
                data-testid='username'
                onChange={({ target }) => setUsername(target.value)}
            />
            <p>password</p>
            <input
                type="text"
                value={password}
                data-testid='password'
                onChange={({ target }) => { setPassword(target.value) }}
            />
            <button type='submit' >Login</button>
        </form>
    )
}

LoginForm.propTypes = {
    username: propTypes.string.isRequired,
    password: propTypes.string.isRequired,
    setUsername: propTypes.func.isRequired,
    setPassword: propTypes.func.isRequired,
    handleLogin: propTypes.func.isRequired
}
export default LoginForm