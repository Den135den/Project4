import React, {  useState} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TestLogin from './Componets/TestLogin';
import Register from './Componets/Register';
import png from './img/1.png';

function App() {
  const [state, setState] = useState({
    login: '',
    password: '',
  });

  const [errorInput, setErrorInput] = useState({
    login: '',
    password: '',
  });

  const [success, setSuccess] = useState(false);


  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
    setErrorInput({ ...errorInput, [e.target.name]: '' });
  };

  const login = (e) => {
    e.preventDefault();
    let objectInput = {};
  
    if (!state.login) {
      objectInput.loginError = 'The login is empty';
    }
    if (!state.password) {
      objectInput.passwordError = 'The password is empty';
    } else {
      setErrorInput({});
    }
  
    if (objectInput.loginError || objectInput.passwordError) {
      return setErrorInput(objectInput);
    } else {
      setErrorInput({});
  
      fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({
          login: state.login,
          password: state.password,
        }),
      })
        .then((response) => {
          if (response.status === 200) {
            setSuccess(true);
            return response.json();
          } else {
            console.log('Failed login');
          }
        })
        .then((response) => {
          if(response.jwtToken){
            console.log(response.jwtToken)
              localStorage.setItem("key", response.jwtToken)
              let JWT = localStorage.getItem('key')
              fetch('http://localhost:5000/logToken',{
                method:'POSt',
                headers: JWT?{
                   'Authorization': `Bearer ${response.jwtToken}`,
                  'Content-Type': 'application/json',
                }:{
                  'Content-Type': 'application/json',
                }
              })
              .then(response=>response.json())
              .then(response=>console.log(response))
              .catch(error=>error)
           
          }
          //console.log(response.jwtToken) 
         
        })
        .catch((error) => console.log(error));
    }
  };
  
  

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            success ? (
              <h1>
                <img src={png} width={'30px'} alt="img" /> 
              </h1>
            ) : (
              <Login onChange={onChange} formL={state} errorInput={errorInput} click={login} />
            )
          }
        />
        <Route path="/register" element={<RegisterCompponent />} />
      </Routes>
    </BrowserRouter>
  );
}

function Login(props) {
  return <TestLogin onChange={props.onChange} formL={props.formL} errorInput={props.errorInput} click={props.click} />;
}

function RegisterCompponent() {
  return <Register />;
}

export default App;

// Function to get a specific cookie by name
