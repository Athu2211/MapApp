import React, { useRef, useState } from 'react';
import { Cancel, Room } from '@material-ui/icons';
import './Login.css';
import axios from 'axios';

function Login({setCurrentUser, setShowLogin, myStorage}) {
    const [failure, setFailure] = useState(false);
    const usernameRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
            username: usernameRef.current.value,
            password: passwordRef.current.value,
        };
        try {
            const res = await axios.post("/users/login", user);
            setCurrentUser(res.data.username);
            myStorage.setItem('user', res.data.username);
            setShowLogin(false)
        } catch (err) {
            console.log(err);
            setFailure(true);
        }
    };

    return (
        <div className="loginContainer">
            <div className="logoIcon">
                <Room/>Travel Pin
            </div>
            <form onSubmit={handleSubmit}>
                <input autoFocus placeholder="username" ref={usernameRef} />
                <input
                    type="password"
                    min="6"
                    placeholder="password"
                    ref={passwordRef}
                />
                <button className="loginBtn" type="submit">
                    Login
                </button>
                {failure && <span className="failure">Something went wrong!</span>}
            </form>
            <Cancel className="loginCancel" onClick={() => setShowLogin(false)} />
        </div>
    );
}

export default Login;