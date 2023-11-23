import React, { useState } from 'react';

function App() {
  const [state, setState] = useState({
    login: '',
    password: '',

  });

  const [errorInput, setErrorInput] = useState({
    login: '',
    password: '',
 
  });

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
    setErrorInput({ ...errorInput, [e.target.name]: '' });
  };

  const login = (e) => {
    let objectInput = {};
    e.preventDefault();
  
    if (!state.login) {
      objectInput.loginError = 'The login is empty';
    }
    if (!state.password) {
      objectInput.passwordError = 'The password is empty';
    } 
     else {
      setErrorInput(null || {});
    }
  

    if (Object.keys(objectInput).length > 0) {
      return setErrorInput(objectInput);
    } else {
      setErrorInput(null || {});
      fetch('http://localhost:5000/register', {
        method: 'POST',
        body: JSON.stringify({
          login: state.login,
          password: state.password, 
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        
      })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
    }
  };

  const {  loginError, passwordError } = errorInput;

  return (
    <div>
       <form>
          <h1>Register</h1>
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
        

          <button onClick={login}>Send</button>
        </form>
    </div>
      
  );
}