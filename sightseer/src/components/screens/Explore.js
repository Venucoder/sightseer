import React, {useContext, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom'
import { searchContext } from '../../App';
import axios from "axios";
import { AiOutlineHeart } from "react-icons/ai";
import { MdOutlineLocationOn } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import Rating from '@mui/material/Rating';

const Explore = () => {
   const navigate = useNavigate()
   const {search, places, setPlaces, state} = useContext(searchContext);      
   console.log(places)
   console.log(state)
   useEffect(() => {      
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/allplaces`)
      .then(response => {         
         setPlaces(response.data.places)                  
      })
      .catch(err => console.log(err)) 
   }, [])

   const addLikes = (response) => {
      setPlaces(prevState => (            
            prevState.map(place => {
               return (
                  place._id == response.data._id ? {
                     ...place,
                     likes: response.data.likes,
                  } : place
               )
            })            
        ))
   }
   
   function handleLike(e, placeid) {
      e.preventDefault()
      if(!state.user) {
         toast.error(`You must be logged in to save the place`, {
            position: toast.POSITION.TOP_RIGHT
         }); 
         navigate('/signin')
      }
      else {
         axios.put(`${process.env.REACT_APP_BACKEND_URL}/like`, {
            placeid,
            userid: state.user?._id,
         })
         .then(response => {
           console.log(response.data)
           addLikes(response) 
         })
         .catch(err => {
            console.log(err)
            return toast.error(`Something went wrong`, {
               position: toast.POSITION.TOP_RIGHT
            }); 
         })
      }
   }

   function handleUnLike(e, placeid) {
   e.preventDefault()      
      axios.put(`${process.env.REACT_APP_BACKEND_URL}/unlike`, {
         placeid,
         userid: state.user?._id,
      })
      .then(response => {
        console.log(response.data)
        addLikes(response)         
      })
      .catch(err => {
         console.log(err)
         return toast.error(`Something went wrong`, {
            position: toast.POSITION.TOP_RIGHT
         }); 
      })      
   }

   const capitalize = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
   }

   let filter = places.filter(place => (place.sight.includes(search) || place.city.includes(search) || place.province.includes(search) || place.country.includes(search)))
   console.log(filter)

   return (
      <div className="explore">
         {
            filter.map(place => {
               let rating = 0
               for (var i = 0; i < place.comments.length; i++) {
                  rating = rating + Number(place.comments[i].rating)
               }
               rating = rating / place.comments.length
               return (                                  
                  <div className="exp-card">                  
                     <img src={place.photo} alt={place.sight} />
                     <div className='place_loc'>
                        <h2>{capitalize(place.sight)}</h2>
                        <h3>{capitalize(place.city)}, {capitalize(place.country)}</h3>
                        <div className='rtg'>
                           <div>
                              <Rating value={rating} precision={0.1} readOnly />
                              <p style={{fontSize: '12px', marginLeft: '5px'}}>{place.comments.length} reviews</p>   
                           </div>
                           <div>
                              <p>₹{place.cost}</p>
                              <p style={{fontSize: '12px'}}>expenses</p>   
                           </div>                           
                           
                        </div>
                     </div>
                     <div className='place_btm'>
                        <Link to={'/explorecard/'+place?._id} className='exp_link'>Show Details</Link>
                        
                     {
                        place.likes.includes(state.user?._id) ? (
                           <div className='exp_like active'>
                              <AiOutlineHeart style={{fontSize: '15px'}} />
                              <p onClick={(e) => handleUnLike(e, place._id)}>Saved for later</p>
                           </div>
                        ) : (
                           <div className='exp_like'>
                              <AiOutlineHeart style={{fontSize: '15px'}} />
                              <p onClick={(e) => handleLike(e, place._id)}>Save for later</p>
                           </div>
                        )                              
                     }                                                
                     </div>                     
                  </div>                  
               )
            })
         }
         <ToastContainer />
      </div>
   )
};

export default Explore;
