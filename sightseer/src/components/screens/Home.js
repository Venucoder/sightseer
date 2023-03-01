import React from 'react';
import {Link} from 'react-router-dom'
import camp from '../assets/camp1.jpg'
import {FaArrowRight} from 'react-icons/fa'

const Home = () => {
    return (
        <>
            <img src={camp} alt="Camp" className="bg" />
            <div className="home"> 
                <h1>Explore the World</h1>              
                <h1>Together.</h1>
                <p>Make Someone's Trip Easier</p>
                <Link to="/explore" className="home-link">Explore Places <FaArrowRight className='rgt-arr'/></Link>
            </div>
        </>
    );
};

export default Home;
