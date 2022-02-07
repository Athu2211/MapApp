import React, { useState, useRef } from 'react';
import './Register.css';
import { Room, Cancel } from '@material-ui/icons';
import axios from 'axios';

function Register(props) {
    const [success, setSuccess] = useState(false);
    const [failure, setFailure] = useState(false);
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            username: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value
        }
        try {
            await axios.post('/users/register', newUser);
            setFailure(false);
            setSuccess(true);

        } catch (err) {
            setFailure(true);
            console.log(err)
        }
    }

    return (
        <div className="register-container">
            <div className="logo">
                <Room /> Travel Pin
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Enter Username" ref={nameRef} />
                <input type="email" placeholder="Enter Email" ref={emailRef} />
                <input type="password" placeholder="Enter Password" ref={passwordRef} />
                <button className="register-btn" type="submit">Register</button>
                {success ? <span className="success">Registered Successfully!</span> : null}
                {failure ? <span className="failure">Registeration Failed!</span> : null}
            </form>
            <Cancel className="registerCancel" onClick={() => props.setShowRegister(false)} />

        </div>
    );
}

export default Register;