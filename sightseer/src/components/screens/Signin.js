import React, {useState, useContext, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios";
import travelgirl1 from '../assets/travelgirl4.jpg'
import { searchContext } from '../../App';
import { FaFire } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {BsFillEyeFill, BsFillEyeSlashFill} from 'react-icons/bs'
import Ghost from '../assets/Ghost.gif'

const Signin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const {state, setState} = useContext(searchContext)
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)    
    const [loginDetails, setLoginDetails] = useState({
        email: '',
        password: ''
    });

    useEffect(()=> {

    }, [state])

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
        setIsLoading(true)
        axios
          .post(`${process.env.REACT_APP_BACKEND_URL}/signin`, {
            name: loginDetails.username,
            email: loginDetails.email,
            password: loginDetails.password
          })
          .then((response) => {     
            if(response.data.err) {                
                console.log(response.data.err)    
                return toast.error(`${response.data.err}`, {
                    position: toast.POSITION.TOP_RIGHT
                });                                                        
            }
            else {                     
                console.log(response.data.user)                           
                localStorage.setItem("user", JSON.stringify(response.data.user))
                setState(prevState=> {
                    return {
                        user: response.data.user
                    }
                })  
                setIsLoading(false)
                toast.success(`Succesfully signed in`, {
                    position: toast.POSITION.TOP_RIGHT
                }); 
                navigate('/')                                        
            }
          });       
          e.preventDefault();   
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
                        <h2>Login</h2>
                        <p className="lg-tag">Welcome back!!😃</p>
                        <div className="login-field">
                            <p htmlFor="email">Email*</p>                    
                            <input type="text" placeholder="Enter your email" value={loginDetails.email}  onChange={handleEmail}/>    
                        </div>
                        <div className="login-field">
                            <p htmlFor="password">Password*</p>
                            <input type={showPassword ? 'text' : 'password'} placeholder="Enter your Password" value={loginDetails.password}  onChange={handlePassword}/>    
                            {!showPassword ? (<BsFillEyeFill onClick={handleShowPassword} className='show-password'/>) : (<BsFillEyeSlashFill onClick={handleShowPassword} className='show-password'/>)}
                        </div>
                        <Link to='/forgotpass' style={{fontSize: "14px", textDecoration: "none", margin: "10px", display: "block"}}>forgot password?</Link>
                        <button type="submit" className="loginbtn">Login</button>
                        <Link to='/signup' className="loginbtn2">Register</Link>
                    </form>
                    <div className="login-image">
                        <img src={travelgirl1} alt="travelgirl" />
                        <h4>Let's explore the <br/>world together</h4>
                    </div>    
                </div>    
            </div>  
            )}
            <ToastContainer />  
        </>        
    );
};

export default Signin;
