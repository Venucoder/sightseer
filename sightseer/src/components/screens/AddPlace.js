import React, {useState, useContext, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { searchContext } from '../../App';
import { FaFire } from "react-icons/fa";
import Ghost from '../assets/Ghost.gif'

const AddPlace = () => {
	const [isLoading, setIsLoading] = useState(false)
	const navigate = useNavigate()
	const {state} = useContext(searchContext)
	const [place, setPlace] = useState({
		sight: '',
		city: '',
		province: '',
		country: '',
		cost: ''
	})
	const [image, setImage] = useState('')
	const [url, setUrl] = useState('')
	const [isAdded, setIsAdded] = useState(false)

	console.log(url)

	useEffect(() => {
		if (url) {
			console.log("HII")
			axios.post("/addplace", {
				sight: place.sight,
				city: place.city,
				province: place.province,
				country: place.country,
				cost: place.cost,
				photo: url,
				user: state.user
			})
			.then(response => {
				if (response.data.err) {
					return toast.error(`${response.data.err}`, {
                    	position: toast.POSITION.TOP_RIGHT
                	});  
				} else {
					console.log(response.data.place)
					toast.success(`Succesfully added place`, {
                    	position: toast.POSITION.TOP_RIGHT
                	});  
                	setIsAdded(true)					
				}
			}).catch(err => {				
				toast.error(`${err.message}`, {
                    position: toast.POSITION.TOP_RIGHT
                });
				console.log(err)
			})
		}
	}, [url])

	useEffect(()=> {
		if(isAdded) {			
			navigate('/explore')
		}
	}, [isAdded])

	function postDetails(e) {
		e.preventDefault()	
		if(!image) {
			return toast.error(`Plaese Enter all fields`, {
            	position: toast.POSITION.TOP_RIGHT
            });            
		}		
		setIsLoading(true)
		const data = new FormData()
		data.append("file", image)
		data.append("upload_preset", "insta-clone")
		data.append("cloud_name", "venucoder")
		fetch("https://api.cloudinary.com/v1_1/venucoder/image/upload", {
			method: "post",
			body: data
		})
		.then(res => res.json())
		.then(data => {
			console.log(data.url)
			setUrl(data.url)
		}).catch(err => {
			console.log(err)
		})
		
	}

    return (
    	<>
    	{isLoading ? (
                <div className='loading'>
                    <img src={Ghost} alt="Loading..." />
                </div>
            ) : (    	        
        <div className='addplace-main'>
            <div className="login-wrapper"> 
                <div className="login-main" style={{width: "50%", margin: "auto"}}>
                    <form className="login" style={{marginLeft: "20%", width:"100%"}}>
                        <h3><FaFire style={
                            {color: "white", borderRadius:"50%", width:"40px", height:"40px", padding:"10px",
                                background: "rgb(139,164,254)",
                                background: "linear-gradient(280deg, rgba(139,164,254,1) 0%, rgba(72,99,253,1) 100%)"
                            }
                        }/></h3>
                        <h2>Add Place</h2>
                        <div className="login-field">
                            <p htmlFor="sight">Place or Sight*</p>
                            <input type="text" placeholder="Enter place or city" value={place.sight}  onChange={(e)=>setPlace(prevState=>({...prevState, sight: e.target.value}))}/> 
                        </div>
                        <div className="login-field">
                            <p htmlFor="city">City*</p>
                            <input type="text" placeholder="Enter city" value={place.city}  onChange={(e)=>setPlace(prevState=>({...prevState, city: e.target.value}))}/> 
                        </div>
                        <div className="login-field">
                            <p htmlFor="state">State*</p>
                            <input type="text" placeholder="Enter state" value={place.province}  onChange={(e)=>setPlace(prevState=>({...prevState, province: e.target.value}))}/>    
                        </div>
                        <div className="login-field">
                            <p htmlFor="country">Country*</p>
                            <input type="text" placeholder="Enter country" value={place.country}  onChange={(e)=>setPlace(prevState=>({...prevState, country: e.target.value}))}/>    
                        </div>
                        <div className="login-field">
                            <p htmlFor="desc">Expenses*</p>
                            <input type="text" placeholder="Ex: 200 (in rupees)" value={place.cost}  onChange={(e)=>setPlace(prevState=>({...prevState, cost: e.target.value}))}/>
                        </div>
                        <div className="login-field">
                            <p htmlFor="image">Upload Image*</p>
                            <input type="file" onChange={(e) => {setImage(e.target.files[0])
                            	console.log(e.target.files)}}/>
                        </div>
                        <button type="submit" className="loginbtn" onClick={postDetails}>Submit</button>
                    </form>                       
                </div>    
            </div>        
            <ToastContainer />  
           </div>
        
        )}        
         </>
    );
};

export default AddPlace;
