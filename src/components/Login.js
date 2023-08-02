import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';


const Login = (props) => {

    console.log(process.env.REACT_APP_SECRET_CODE);

    const navigate = useNavigate();         //in V6 of React, useHistory is replaced by useNavigate

    const [credentials, setCredentials] = useState({ email: "", password: "" });

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        //API Call
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });
        const json = await response.json();
        // console.log(json);

        if (json.success) {
            //save the auth token and redirect
            localStorage.setItem('token', json.authToken);
            localStorage.setItem('name', json.userName);
            props.showAlert("Logged in successfully!", "success")
            navigate('/');
        }
        else {
            props.showAlert("Invalid credentials", "danger")
        }
    }
    return (
        <>
            
            <div className="container">
                <h2 className='my-5 d-flex justify-content-center'>Welcome, login to continue to iNotebook</h2>
                <form onSubmit={handleSubmit}>
                    <div className="my-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="email" value={credentials.email} onChange={onChange} name="email" aria-describedby="emailHelp" />
                    </div>
                    <div className="my-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" value={credentials.password} onChange={onChange} name="password" />
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                    <div className='my-3'>
                    <strong>Don't have an account?</strong> <Link className="btn btn-primary mx-2" to='/signup' role="button">Sign up</Link>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Login