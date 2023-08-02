import React, { useEffect } from 'react'
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from 'react-router-dom';


const Navbar = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token')   //token ko clear karle jab bhi logout par click kare tab
        localStorage.removeItem('name')
        navigate('/login')
    }

    // const handleName = () => {
    //     if(localStorage.getItem('token')){
    //         return true
    //     }
    // }

    let location = useLocation();

    useEffect(() => {
        // console.log(location.pathname);
    }, [location]);

    // let name = localStorage.getItem('name');

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">iNotebook</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === "/about" ? "active" : ""}`} to="/about">About</Link>
                        </li>
                    </ul>
                </div>
                <div className="text-white">{localStorage.getItem('token') ? `Welcome, ${localStorage.getItem('name')}!`:''}</div>
            </div>

            {!localStorage.getItem('token') ?
                <><Link className="btn btn-primary mx-2" to='/login' role="button">Login</Link>
                    <Link className="btn btn-primary mx-2" to='/signup' role="button">Signup</Link></>
                :
                <button className="btn btn-primary mx-2" onClick={handleLogout}>Logout</button>
            }

        </nav>
    )
}

export default Navbar
