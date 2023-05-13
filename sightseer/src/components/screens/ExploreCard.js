import React, {useContext, useEffect, useState, useRef} from 'react';
import {useParams, useNavigate} from 'react-router-dom'
import { searchContext } from '../../App';
import GoogleMapReact from 'google-map-react'
import { styled, alpha } from '@mui/material/styles';
import { Paper, Typography, useMediaQuery, Rating } from '@mui/material'
import {MdLocationOn} from 'react-icons/md'
import axios from 'axios'
import {getCoordinates, getAttractions} from '../../api'
import CommentBox from './CommentBox'
import place1 from '../assets/place1.jpg'
import place2 from '../assets/place2.jpg'
import place3 from '../assets/place3.jpg'
import place4 from '../assets/place4.jpg'
import mapStyles from './mapStyles'
import { ToastContainer, toast } from 'react-toastify';
// 1B4470
const ExploreCard = () => {
	const navigate = useNavigate()
	const [place, setPlace] = useState({})
	const [imgs, setImgs] = useState([])
	const isDesktop = useMediaQuery('(min-width:600px)');    
	const {places,state, coordinates, setCoordinates, setBounds, bounds} = useContext(searchContext); 	 
	const {cardid} = useParams()
	const [attractions, setAttractions] = useState([])
	const [image, setImage] = useState('')
	const [url, setUrl] = useState('')

	const fileInput = useRef(null)
	const imgclass = ['']	

	let curPlace = {}
	for(let i = 0; i < places.length; i++) {
		if(cardid === places[i]._id) curPlace = places[i];
	}
	
	const capitalize = (str) => {
      	return str.charAt(0).toUpperCase() + str.slice(1);
   	}

	useEffect(() => {
		console.log(curPlace.city)
        getCoordinates(curPlace.city)
        .then((data) => {             
            setCoordinates({lat: data.lat, lng: data.lon})
        })
        
		console.log(cardid)
		if(cardid) {
			axios.get(`${process.env.REACT_APP_BACKEND_URL}/getplace`, {
			  params: {
			    placeid: cardid,
			  },
			})
			.then(response => {				
				setPlace(response.data.place)				
				setImgs(response.data.place.images)
			})
			.catch(err => console.log(err))
		}
	
    }, [])

    useEffect(() => {    	
    	console.log({coordinates})
    	console.log({bounds})
    	getAttractions(bounds.ne, bounds.sw)
    	.then(data => {
    		console.log(data)
    		setAttractions(data)
    	})
    	.catch(err => console.log(err))
    }, [bounds])

    useEffect(() => {
    	console.log(image)     	
    	if(image) {
    		if(!state.user) {
		         toast.error(`You must be logged in to Upload an Image`, {
		            position: toast.POSITION.TOP_RIGHT
		         }); 
		         navigate('/signin')
		    }
		    else {
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
		    		axios.post(`${process.env.REACT_APP_BACKEND_URL}/uploadimage`, {
		    			photo: data.url,
		    			placeid: cardid	,
		    		})
		    		.then(res => {   
		    			setImgs(res.data.result.images) 
		    			setImage('')   			
		    		})
		    		.catch(err => console.log(err))
		    	})
    		}
    	}
    }, [image])    

    return (
        <div className="explorecard">
        	<h1 className='place_name'>{capitalize(curPlace.sight)}, {capitalize(curPlace.city)}, {capitalize(curPlace.country)}</h1>

        	<div style={{height: '85vh', width: '80%'}} className='map-main'>	            
	            <GoogleMapReact 
	            	className='map'

	                bootstrapURLKeys={{key: 'AIzaSyBjhiiL-ayGlnl3kmCDL8zDiiMUDarYLTY'}}
	                defaultCenter={coordinates}
	                center={coordinates}
	                defaultZoom={12}
	                margin={[50, 50, 50, 50]}                                
	                options={{
            			styles: mapStyles,
        			}}
	                onChange={(e) => { 
	                    console.log(e)                                    
	                    setCoordinates({lat: e.center.lat, lng: e.center.lng})
	                    setBounds({ne: e.marginBounds.ne, sw: e.marginBounds.sw, })
                	}}	 
                	mapContainerStyle={{borderRadius: '20px' }}                	
	            >
	            	{attractions?.map((place, i) => (
                    <div 
                        style={{position: 'absolute', transform: 'translate(-50%, -50%)', zIndex: 1, '&:hover': { zIndex: 2 }}}
                        lat={Number(place.latitude)}
                        lng={Number(place.longitude)}
                        key={i}
                    >
                        {
                            !isDesktop ? (
                                <MdLocationOn color="primary" fontSize="large" />
                            ) : (
                            	i < 10 && place.name &&
                                <Paper elevation={3} style={{padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100px'}} >
                                    <Typography style={{}} variant="subtitle2" gutterBottom>
                                        {place.name}
                                    </Typography>  
                                    <img 
                                        src={place.photo ? place.photo.images.large.url : 'https://img.freepik.com/premium-photo/cozy-restaurant-with-people-waiter_175935-230.jpg?w=2000'}
                                        alt={place.name} 
                                        style={{cursor: "pointer"}}
                                    />  
                                    <Rating size="small" value={Number(place.rating)} readOnly />
                                </Paper>
                            )

                        }
                    </div>
                	))}
	            </GoogleMapReact>

	         </div>
	                     
	        <input type="file" 
	        	onChange={(e) => {setImage(e.target.files[0])}}				
	        	ref={fileInput}
				name='image'  			
				style={{display: 'none'}}			  			
			/>

			<div className='img-upload'>
			<button
  				className='btn-1'
  				onClick={() => fileInput.current.click()}
			>
				Upload Image
			</button>								
			</div>
  				  				 				                              
			<div className='gallery'>
				{					
					imgs.map((img, i) => {
						return (
							i < 14 && <div><img src={img} alt="image" /></div>
						)
					})
				}
			</div>	        

	        <div style={{marginBottom: '20px'}} className='comments-main'>	         	         
	         	<CommentBox placeid={cardid} className='comment-box'/>
	        </div>
	        <ToastContainer />		       
        </div>
    );
};

export default ExploreCard;
