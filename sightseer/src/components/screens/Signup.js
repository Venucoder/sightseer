import React, {useState, useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios";
import travelgirl1 from '../assets/travelgirl4.jpg'
import loginbg from '../assets/loginbg1.png'
import { searchContext } from '../../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaFire } from "react-icons/fa";
import Ghost from '../assets/Ghost.gif'
import {BsFillEyeFill, BsFillEyeSlashFill} from 'react-icons/bs'

const Signup = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false)
    const {state, setState} = useContext(searchContext)

    const navigate = useNavigate()

    const [loginDetails, setLoginDetails] = useState({
        username: '',
        email: '',
        password: ''
    });

    function handleUsername(e) {
        setLoginDetails(prevState=>({...prevState, username: e.target.value}))
        console.log(loginDetails.username)
    }

    function handleEmail(e) {
        setLoginDetails(prevState=>({...prevState, email: e.target.value}))
        console.log(loginDetails.email)
    }

    function handlePassword(e) {
        setLoginDetails(prevState=>({...prevState, password: e.target.value}))
        console.log(loginDetails.password)
    }

    const handleShowPassword = () => {
        setShowPassword(prevState => !prevState);
    }

    function handleSignup(e) {         
        e.preventDefault();    
        if (loginDetails.email && !(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(loginDetails.email))) {            
            return toast.error(`Invalid Email`, {
                position: toast.POSITION.TOP_RIGHT
            });
        }        
        setIsLoading(true)
        axios
          .post("/signup", {
            name: loginDetails.username,
            email: loginDetails.email,
            password: loginDetails.password
          })
          .then((response) => {
            console.log("Data Received")
            if(response.data.err) {
                setIsLoading(false)
                console.log(response.data.err)  
                toast.error(`${response.data.err}`, {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            else {                
                toast.success(`Successfully signed in`, {
                    position: toast.POSITION.TOP_RIGHT
                })  
                localStorage.setItem("user", JSON.stringify(response.data.user))
                setState(prevState=> {
                    return {
                        user: response.data.user
                    }
                })
                navigate('/')
            }
          });                            
    }

    return (
        <>
        {isLoading ? (
                <div className='loading'>
                    <img src={Ghost} alt="Loading..." />
                </div>
            ) : (
        
        
            <div className="login-wrapper"> 
                <div className="login-main">
                    <form className="login" onSubmit={handleSignup}>
                        <h3><FaFire style={
                            {color: "white", borderRadius:"50%", width:"40px", height:"40px", padding:"10px",
                                background: "rgb(139,164,254)",
                                background: "linear-gradient(280deg, rgba(139,164,254,1) 0%, rgba(72,99,253,1) 100%)"
                            }
                        }/></h3>
                        <h2>Register</h2>
                        <p className="lg-tag">Let's get Started</p>
                        <div className="login-field">
                            <p htmlFor="username">Username*</p>
                            <input type="text" placeholder="Enter your username" value={loginDetails.username} onChange={handleUsername}/>    
                        </div>
                        <div className="login-field">
                            <p htmlFor="email">Email*</p>
                            <input type="text" placeholder="Enter your email" value={loginDetails.email}  onChange={handleEmail}/>    
                        </div>
                        <div className="login-field">
                            <p htmlFor="password">Password*</p>
                            <input type={showPassword ? 'text' : 'password'} placeholder="Enter your Password" value={loginDetails.password}  onChange={handlePassword}/>    
                            {!showPassword ? (<BsFillEyeFill onClick={handleShowPassword} className='show-password'/>) : (<BsFillEyeSlashFill onClick={handleShowPassword} className='show-password'/>)}
                        </div>    
                        <button type="submit" className="loginbtn">Register</button>
                        <Link to='/signin' className="loginbtn2">Login</Link>
                    </form>
                    <div className="login-image">
                        <img src={travelgirl1} alt="travelgirl" />
                        <h4>Let's explore the <br/>world together</h4>
                    </div>    
                </div>    
                <ToastContainer />
            </div>   
                 
        
        )}        
        </>
    )
};

export default Signup;
