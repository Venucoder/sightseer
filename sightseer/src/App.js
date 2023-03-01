
import React, {createContext, useState, useEffect} from 'react'
import { BrowserRouter, Routes, Route, useNavigate} from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './components/screens/Home';
import Signup from './components/screens/Signup';
import Signin from './components/screens/Signin';
import Explore from './components/screens/Explore';
import ExploreCard from './components/screens/ExploreCard';
import AddPlace from './components/screens/AddPlace';
import Profile from './components/screens/Profile';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from './components/assets/sig2.png'


export const searchContext = createContext();

const Routing = ({state, setState}) => {
  const navigate = useNavigate()
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if(user) {
      setState(prevState=> {
          return {
              user: user
          }
      })  
      navigate('/')
    }else {
      navigate('/signin')
    }
  }, [])
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/explorecard/:cardid" element={<ExploreCard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/addplace" element={<AddPlace />} />
    </Routes>
  )
}

function App() {
  const [ spinner, setSpinner ] = useState(true);
  const [search, setSearch] = useState('')
  const [state, setState] = useState({user: undefined})
  const [places, setPlaces] = useState([])

  const [coordinates, setCoordinates] = useState({lat: 0, lng: 0})
  const [bounds, setBounds] = useState({})
  console.log(state)

  useEffect(() => {
    setTimeout(() => setSpinner(false), 2300)
  })

  if(spinner) {
    return (
      <div className='entry'>
        <img src={logo} alt="" />
      </div>
    )
  }
  else {

  return (
      <searchContext.Provider 
        value={{search, setSearch, state, setState, places, setPlaces, coordinates, setCoordinates, bounds, setBounds}}
      >
      <BrowserRouter>
        <Navbar />
        <Routing state={state} setState={setState}/>
        <ToastContainer />
      </BrowserRouter>
      </searchContext.Provider>
    );
  }
}

export default App;