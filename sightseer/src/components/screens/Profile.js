import React, {useContext, useRef, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom'
import { searchContext } from '../../App';
import axios from 'axios'
import {BiPencil} from 'react-icons/bi'
import {IoMdGrid, IoMdHeart} from 'react-icons/io'

const Profile = () => {
	const navigate = useNavigate()
	const {places, state, setState} = useContext(searchContext);
	const fileInput = useRef(null)
	const [image, setImage] = useState('')

	useEffect(() =>{
		if(image){
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
				axios.put('/updatepic', {					
					pic: data.url,
					userid: state.user._id,
				})				
				.then(result => {					
					localStorage.setItem("user", JSON.stringify({user: {...state.user, pic: result.data.pic}}))
					setState(prevState => {
						return {
							user: {...state.user, pic: result.data.pic}
						}
					})
				})
			}).catch(err => {
				console.log(err)
			})
		}
	}, [image])

	const capitalize = (str) => {
      	return str.charAt(0).toUpperCase() + str.slice(1);
   	}

   	const goToExploreCard = (id) => {
   		navigate('/explorecard/'+id)
   	}

    return (
        <div className='profile'>        	
        	<div className='profile-top'>

        		<div className='prf-pic'>
        			<input type="file" 
			        	onChange={(e) => {setImage(e.target.files[0])}}				
			        	ref={fileInput}
						name='image'  			
						style={{display: 'none'}}			  			
					/>
        			<img src={state.user?.pic} alt={state.user.name} />
        			<BiPencil className='edit' onClick={() => fileInput.current.click()}/>
        		</div>
        		
        		<div className='prf-info'>
        			<h2>{state.user?.name}</h2>
        			<h4>{state.user?.email}</h4>
        		</div>
        	</div>
        	<div className='widget'>
        		<div className='tabs'>
        			<input id='tab-1' type="radio" name='group' checked />
        			<input id='tab-2' type="radio" name='group'/>
        		
		    		<div className='buttons'>
		    			<label htmlFor="tab-1" className=''><IoMdGrid className='radio-icon' /></label>
		    			<label htmlFor="tab-2" className=''><IoMdHeart className='radio-icon' /></label>
		    			<div className='underline'></div>
		    		</div>
		    		<div className='content'>	
	    				<div className='content-inner'>
	    					<div>	
	    						<h2>My Posts</h2>
	    						<div className='prf_places'>
	    							{
		    							places.map(place => {
		    								return (
		    									state.user?._id == place.postedBy &&
		    									<div className='prf_place' onClick={() => goToExploreCard(place._id)} key={place._id}>
					    							<img src={place.photo} alt={place.sight} />
					    							<div className='place_loc'>
								                        <h2>{capitalize(place.sight)}</h2>
								                        <h3>{capitalize(place.city)}, {capitalize(place.country)}</h3>								                        
					                 				</div>
					    						</div>			
		    								)
		    							})
		    						}	
	    						</div>	    							    						
	    					</div>
	    					<div>	
	    						<h2>Saved</h2>
	    						<div className='prf_places'>
	    							{
		    							places.map(place => {
		    								return (
		    									place.likes.includes(state.user?._id) &&
		    									<div className='prf_place' onClick={() => goToExploreCard(place._id)} key={place._id}>
					    							<img src={place.photo} alt={place.sight} />
					    							<div className='place_loc'>
								                        <h2>{capitalize(place.sight)}</h2>
								                        <h3>{capitalize(place.city)}, {capitalize(place.country)}</h3>								                        
					                 				</div>
					    						</div>			
		    								)
		    							})
		    						}	
	    						</div>
	    					</div>
	    				</div>
		    		</div>
			    </div>
        	</div>
        </div>
    );
};

export default Profile;
