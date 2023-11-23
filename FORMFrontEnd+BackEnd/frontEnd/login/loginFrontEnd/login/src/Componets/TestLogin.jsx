import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

function TesTLogin(props) {
    let [g, setG] = useState({ nnn: '' });

    useEffect(() => {
        fetch('http://localhost:5000/getSrver')
            .then((response) => response.json())
            .then((response) => {
                if (response ) {
                    setG({ nnn: response.register});
                  
                } else {
                    setG({ nnn: 'Error data' });
                }
            })
            .catch((error) => {
                console.error('Fetch error:', error);
            });
    }, []);

    return (
        <div>
            <form>
                <h1>Login</h1>
                <label htmlFor="login" />
                <input
                    type="text"
                    value={props.formL.login}
                    name="login"
                    placeholder="login"
                    onChange={props.onChange}
                    id="login"
                />
                {props.errorInput.loginError && <div style={{ color: 'red' }}>{props.errorInput.loginError}</div>}

                <label htmlFor="password" />
                <input
                    type="password"
                    value={props.formL.password}
                    name="password"
                    placeholder="password"
                    onChange={props.onChange}
                    id="password"
                />
                {props.errorInput.passwordError && <div style={{ color: 'red' }}>{props.errorInput.passwordError}</div>}

                <button onClick={props.click}>Send</button>
            </form>
            <span><Link to="/register">{g.nnn}register</Link> now?</span>
        </div>
    );
}

export default TesTLogin;
