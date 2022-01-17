import React, { useEffect, useState } from 'react'
import { Link, Outlet,Navigate } from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import Navbaar from './Navbaar'
import Footer from './Footer'
import { useDispatch, useSelector} from 'react-redux'
import './account.css'

export default function Account() {
    const [state, setstate] = useState({})
    const userProfile = useSelector(state => state.profileReducer)
    const dispatch = useDispatch();

    useEffect(() => {
        if (localStorage.getItem('_token') !== undefined) {
            let token = localStorage.getItem('_token');
            let decode = jwtDecode(token)
            console.log(decode)
            setstate(decode)
      dispatch({type: "updateProfile", payload:decode.firstname + " "+ decode.lastname})
      dispatch({type: "updatePicture", payload: decode.profilepic})
        }
    }, [])

    return (
        <>
        {localStorage.getItem('_token') !=undefined ?
        <>
        <Navbaar/>
        <div id='account' className='container-fluid' >
            <div>
              
                <div className='row'>

                    <div id='side_account' className='pt-5 col-3 text-dark'>
                        <div className='text-center bg_img' id='bg_img'>
                            {userProfile.profile==undefined ?
                            <img src={`../images/profile.jpg`}  alt='default Images' className='profile_img'/>
                          :  <img src={`../images/${userProfile.profile}`}  alt='Profile' className='profile_img'/> }
                        </div>
                        <h1 className='text-center mt-3' style={{fontFamily:"Oswald"}}>{userProfile.name}</h1>
                        <ul className='text-center mr-4 mt-4'> 
                        <li className='ull fa fa-user'><Link style={{textDecoration:'none', color:'navy', fontWeight:'bold',fontSize:"1.5rem"}} to="profile">Profile</Link></li> <br/>
                        <li className='ull fa fa-address-book my-2'><Link style={{textDecoration:'none', color:'navy', fontWeight:'bold',fontSize:"1.5rem"}} to="address">Address</Link></li> <br/>
                        <li className='ull fa fa-shopping-cart'> <Link style={{textDecoration:'none', color:'navy', fontWeight:'bold',fontSize:"1.5rem"}} to="order">Orders</Link></li> <br/>
                        <li className='ull fa fa-retweet my-2'> <Link style={{textDecoration:'none', color:'navy', fontWeight:'bold',fontSize:"1.5rem"}} to="changepassword">Change Password</Link></li> <br/>
                        </ul>
                    </div>

                    <div id='main_account' className='col-9'>
                        <Outlet/>
                    </div>
                    
                </div>
            </div>
            </div>
            <Footer/>
            </>
            :<Navigate to="/login"></Navigate>
         }
        </>
    )
}
