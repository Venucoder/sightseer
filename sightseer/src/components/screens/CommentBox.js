import React, {useEffect, useState, useContext} from 'react';
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import Rating from '@mui/material/Rating';
import { searchContext } from '../../App';
import {AiOutlineSend} from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify';

const CommentBox = ({placeid}) => {
	const navigate = useNavigate()
	const {state} = useContext(searchContext);
	const [addComment, setAddComment] = useState('')
	const [rating, setRating] = useState(0);

	const [comments, setComments] = useState([])	

	useEffect(() => {
		console.log(placeid)
		if(placeid) {
			axios.get('/allcomments', {
			  params: {
			    placeid,
			  },
			})
			.then(response => {		
			console.log(response)						
				setComments(response.data.comments.comments)
			})
			.catch(err => console.log(err))
		}
	}, [])

	const handleSubmit = (e) => {		
		e.preventDefault()
		setRating(0)		
		if(!state.user) {
	         toast.error(`You must be logged in to write review`, {
	            position: toast.POSITION.TOP_RIGHT
	         }); 
	         navigate('/signin')
	    }
	    else if(!addComment) {
	    	toast.error(`Please fill the review field`, {
	            position: toast.POSITION.TOP_RIGHT
	        }); 	         	
	    }
		else {
			axios.put('/addcomment', {
				text: addComment,
				rating,
				postedBy: state.user._id,
				placeid
			})
			.then(response => {
				console.log(response.data.comments)
				setComments(response.data.comments)			
				setAddComment('')
				toast.success(`Succesfully Posted your Comment`, {
	                    position: toast.POSITION.TOP_RIGHT
	            }); 
			})
			.catch(err => {
				toast.error(`Something went wrong`, {
	                    position: toast.POSITION.TOP_RIGHT
	            }); 
	            console.log(err)
			})
		}
	}

	const handleCommentDelete = (e, commentid) => {
		e.preventDefault()
		axios.delete(`/deletecomment/${placeid}/${commentid}`)
		.then(response => {
			console.log(response.data)
			setComments(response.data.comments)
		})
		.catch(err =>  console.log(err))
	}

    return (
      	<div className='comment-box'>      		
				<form onSubmit={(e) => handleSubmit(e)} className='comment-form'>
					<textarea					  
			          value={addComment}
			          onChange={(e) => setAddComment(e.target.value)}			          
			          placeholder='Add your review...'
	        		/>	
	        		<div className='comment-post'>
	        			<Rating name="no-value" value={rating} precision={0.1} onChange={(e, n) => setRating(n)} />	
	        			<button className='cmt_postbtn'>
	        				<AiOutlineSend style={{fontSize: '15px'}}/>
	        				<p>Post</p>
	        			</button>
	        		</div>	      			
				</form>	
				
				<CommentList comments={comments} handleCommentDelete={handleCommentDelete} state={state} className='comment-list'/>		
				<ToastContainer />
      	</div>
    );
};

const CommentList = ({comments, handleCommentDelete, state}) => {	
	return (
		<div className='comment-list'>
			{
				comments.map(comment => {
					return (
						<Comment comment={comment} handleCommentDelete={handleCommentDelete} state={state} />
					)
				})
			}
		</div>
	)
}

const Comment = ({comment, handleCommentDelete, state}) => {
	return (
		<div className='comment'>			
			<div className='cmt_text'>
				<p>{comment.text}</p>
			</div>
			<div className='comment-profile'>
				<div className='cmt_by'>
					<img src={comment.postedBy.pic} alt="" className='cmt_pic' />
					<h3>{comment.postedBy.name}</h3>				
				</div>
				{comment.postedBy._id == state.user?._id && <button onClick={(e) => handleCommentDelete(e, comment._id)}>Delete</button>}
				
				<div className='cmt_rating'>
					<Rating value={comment.rating} precision={0.5} readOnly />	
					<h4>{comment.rating} of 5</h4>
				</div>
			</div>
		</div>
	)
}

export default CommentBox;
