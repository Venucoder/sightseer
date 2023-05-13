import React, {useState, useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom'
import { searchContext } from '../App';
import { FaUser, FaAngleDown } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import logo from './assets/sig3.png'

const Navbar = () => {
	const navigate = useNavigate()
	const {search, setSearch, state, setState} = useContext(searchContext)

	function getSearch(e) {
   		setSearch(e.target.value)
    	console.log(e.target.value)
    	navigate('/explore')
  	}

  	function handleSearch() {
	    console.log(search)
	    navigate('/explore')
  	}

  	function renderNavs() {
  		if(state.user) {
  			return [
  				<div className="dropdown">
  					<p className="dropbtn">
  						<img src={state.user.pic} alt="" />
  						<Link to="/profile" className="nav-link">{state.user.name}</Link>	
  						<FaAngleDown style={{color:"#898989", position:"relative", top:"1px"}}/>
  					</p>
  					
  					<div className="dropdown-menu">  					
  						<li><FaUser style={
                            {color: "white", borderRadius:"50%", width:"25px", height:"25px", padding:"4px",
                                background: "rgb(139,164,254)",
                                background: "linear-gradient(280deg, rgba(139,164,254,1) 0%, rgba(72,99,253,1) 100%)"
                            }
                        }/><Link to="/profile" className="drp-link">Profile</Link></li>
  						<li>
  							<TbLogout style={
                            {color: "white", borderRadius:"50%", width:"25px", height:"25px", padding:"4px",
                                background: "rgb(139,164,254)",
                                background: "linear-gradient(280deg, rgba(139,164,254,1) 0%, rgba(72,99,253,1) 100%)"
                            }
                        	}/>
							<button className="drp-link" 
								onClick={() => {
									localStorage.clear()
									state.user = undefined;
									navigate('/signin')
								}}
							>
								Logout
							</button>
						</li>
  					</div>  					
  				</div>,				
				<p><Link to="/addplace" className="nav-link addplace">Add Place <BsFillPlusCircleFill style={
					{position:"relative", top:"2.5px", left:"3px"}
				}/></Link></p>
  			]  			
  		}
  		else {
  			return [
				<li><Link to="/signin" className="nav-link">Log in</Link></li>,
				<li><Link to="/signup" className=" reg-btn">Register</Link></li>	
  			]
  		}
  	}

  	function getNavStyle() {
  		if(state.user) {
  			return {
  				background: "rgba( 255, 255, 255, 0.25)"		
  			}
  		}
  		else {
  			return {
  				backgroundColor: "white"
  			}
  		}
  	}

	return (
		<div className="navbar">
			<div className='nav-brand'>
        		<img src={logo} alt="" />
      		</div>	
			<div className='ser'>
				<BiSearch className="ser-icon"/>
				<input type="text" placeholder="Search for place or city" value={search} onChange={getSearch}/>				
			</div>
			<nav className="nav-menu">
				<li><Link to="/" className="nav-link">Home</Link></li>
				<li><Link to="/explore" className="nav-link">Explore</Link></li>
				{renderNavs()}				
			</nav>
		</div>
	);
};

export default Navbar;
