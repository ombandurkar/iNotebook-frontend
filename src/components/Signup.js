import React, { useState } from 'react';
import { useNavigate , Link } from 'react-router-dom';

const Signup = (props) => {

    const navigate = useNavigate();         //in V6 of React, useHistory is replaced by useNavigate

    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        //API Call

        // eslint-disable-next-line
        const { name, email, password } = credentials;  //destructuring kar rahe hai

        const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password })
        });
        const json = await response.json();
        // console.log(json);

        if (json.success) {
            //save the auth token and redirect
            localStorage.setItem('token', json.authToken);
            localStorage.setItem('name', json.userName);
            navigate('/');
            props.showAlert("Account created successfully!", "success")
        }
        else {
            props.showAlert("Invalid credentials", "danger")
        }
    }

    return (
        <div className='container'>
            <h2 className='my-5 d-flex justify-content-center'>Create an account on iNotebook</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name="name" onChange={onChange} aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" onChange={onChange} aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" onChange={onChange} minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" name="cpassword" onChange={onChange} minLength={5} required />
                </div>
                <button type="submit" className="btn btn-primary">Sign up</button>
                <div className='my-3'>
                    <strong>Already have an account?</strong> <Link className="btn btn-primary mx-2" to='/login' role="button">Login</Link>
                </div>
            </form>
        </div>
    )
}

export default Signup
