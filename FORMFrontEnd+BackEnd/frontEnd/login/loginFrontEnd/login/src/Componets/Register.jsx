import React, { useState } from 'react';
import img from '../img/2.png'


function Register() {
  const [state, setState] = useState({
    username: '',
    login: '',
    password: '',
    password_confirmation: '',
  });

  const [error, setError] = useState({
    username: '',
    login: '',
    password: '',
    password_confirmation: '',
  });
  const [registered, setRegistered] = useState(false);
  // const [registered, setRegistered] = useState(false); // Доданий стан для відстеження реєстрації

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
    setError({ ...error, [e.target.name]: '' });
  };

  const register = (e) => {
    let errorNetwork = {};
    e.preventDefault();
    if (!state.username) {
      errorNetwork.usernameError = 'The username is empty';
    }
    if (!state.login) {
      errorNetwork.loginError = 'The login is empty';
    }
    if (!state.password) {
      errorNetwork.passwordError = 'The password is empty';
    } else if (state.password !== state.password_confirmation) {
      errorNetwork.passwordMatchError = 'Password mismatch';
    } else {
      setError(null || {});
    }
    if (!state.password_confirmation) {
      errorNetwork.passwordConfirmationError = 'The password_confirmation is empty';
    }

    if (state.password.length > 10) {
      errorNetwork.passwordStateError = 'Password is more than 10 characters';
    }

    if (Object.keys(errorNetwork).length > 0) {
      return setError(errorNetwork);
    } else {
      setError(null || {});
      fetch('http://localhost:5000/register', {
        method: 'POST',
        body: JSON.stringify({
          username: state.username,
          login: state.login,
          password: state.password,
          password_confirmation: state.password_confirmation,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        
      })
      .then((response) => {
        if (response.status === 200) {
          setRegistered(true); // Встановлюємо registered в true після успішної реєстрації
        } else {
          console.log('Error')
        }
        return response.json();
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
    }
  };

  const { usernameError, loginError, passwordError, passwordConfirmationError, passwordMatchError, passwordStateError } = error;

  return (
    <div >
    {registered? (<div>
      <h1  style={{alignItems:'center', display:'flex'}}><img src={img} alt='img' width={'35px'}/>Користувач зареєструвався</h1>
    </div>):(
       <form>
          <h1>Register</h1>
          <label htmlFor="username" />
          <input
            type="text"
            value={state.username}
            name="username"
            placeholder="username"
            onChange={onChange}
            id="username"
          />
          {usernameError && <div style={{ color: 'red' }}>{usernameError}</div>}

          <label htmlFor="login" />
          <input
            type="text"
            value={state.login}
            name="login"
            placeholder="login"
            onChange={onChange}
            id="login"
          />
          {loginError && <div style={{ color: 'red' }}>{loginError}</div>}

          <label htmlFor="password" />
          <input
            type="password"
            value={state.password}
            name="password"
            placeholder="password"
            onChange={onChange}
            id="password"
          />
          {passwordError && <div style={{ color: 'red' }}>{passwordError}</div>}
          {passwordMatchError && <div style={{ color: 'red' }}>{passwordMatchError}</div>}
          {passwordStateError && <div style={{ color: 'red' }}>{passwordStateError}</div>}

          <label htmlFor="password_confirmation" />
          <input
            type="password"
            value={state.password_confirmation}
            name="password_confirmation"
            placeholder="password_confirmation"
            onChange={onChange}
            id="password_confirmation"
          />
          {passwordConfirmationError && <div style={{ color: 'red' }}>{passwordConfirmationError}</div>}
          <button onClick={register}>Send</button>
        </form>
      
    )}
    </div>
      
  );
}

export default Register;
