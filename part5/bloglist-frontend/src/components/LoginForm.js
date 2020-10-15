import React from 'react'

const LoginForm = ({
  username,
  password,
  usernameHandler,
  passwordHandler,
  handleLogin
}) => {
  return (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={(e) => usernameHandler(e)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={(e) => passwordHandler(e)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm