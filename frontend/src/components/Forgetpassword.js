import React, { useState,useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import PasswordIcon from '@mui/icons-material/Password';
import { useNavigate } from "react-router";
import Swal from 'sweetalert2'
import "./style.css"
import { forgetService, resetpassService } from '../config/Myservice';
import Navbaar from './Navbaar';
import Footer from './Footer';

const regForpassword = RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");

export default function Forgetpassword() {
    const [state, setstate] = useState({otp:null, flag:false,  pass:'', cpass:''})
    const navigate = useNavigate(); 
	const location =  useLocation();
	const [otp,setOtp] = useState(0);

	useEffect(()=>{
		setOtp(location.state.otp)

	},[])

	//submit otp
      const submitotp = () => {
      setOtp(location.state.otp)
			if(state.otp != null){
            if(state.otp == otp){
					Swal.fire({
						position:'top-end',
						icon:'success',
						title:'OTP Matched!',
						showConfirmButton:false,
						timer:1500
					})
					setstate({...state, flag:true})
		}
       else{
                
				 Swal.fire({
                    icon: 'warning',
                    title: 'Oops...',
                    text: 'OTP Does Not Match',
                   })
            }
        }
        else{
           
			Swal.fire({
				icon: 'warning',
				title: 'Oops...',
				text: 'Enter OTP',
			  })
        }
	}

	//resend otp
	const resendotp=()=>{
		forgetService({email:location.state.email})
		.then(res=>{
			setOtp(res.data.otp)
		})
	}

	//reset password
      const resetpass = () => {
        if(regForpassword.test(state.pass) && state.pass === state.cpass){
            resetpassService({email:location.state.email, password: state.pass})
            .then(res=> {
                alert(res.data.msg)
                navigate("/login")
            })
        }
        else{
            
			Swal.fire({
				icon: 'warning',
				title: 'Oops...',
				text: 'Enter Strong Password',
			  })
        }
      }

    return (
        <div>
          
<Navbaar/>
			<div class="container-fluid"  style={{background:" linear-gradient(#a0d6b4 , #5f9ea0)",height:"100vh"}}  >
	
            {state.flag != true ?
						<div class=" d-flex justify-content-center form-container" style={{background:" linear-gradient(#a0d6b4 , #5f9ea0)"}}>
				<div className="col-lg-8 form-box">
					<div className="reset-form d-block">
						<div className="reset-password-form">
							<h3 className="mb-3" style={{color:"navy"}}>Reset Your Password</h3>
							<p className="mb-3" style={{color:"#006994",fontFamily:"serif",fontSize:"1.2em"}}>
								 An 4 digit OTP is sent to your registered email address
							</p>
							<div className="form-input w-50">
								<span><i className="fa fa-envelope"></i></span>   
								<input type="email" placeholder="Email Address" value={location.state.email} disabled/>
							</div>
                            <div className="form-input w-50">
								<span><PasswordIcon/></span>
								<input type="text" value={state.otp} onChange={(e)=> setstate({...state,otp:e.target.value})} placeholder="Enter OTP"/>
							</div>
							<div className="mb-3">
								<button className="btn btn-dark w-25" onClick={()=>submitotp()}>Submit</button>
							</div>
							<div className="mb-3">
								<button className="btn btn-dark w-25" onClick={()=>resendotp()}>Resend OTP</button>
							</div>
						</div>
					</div>
			
				</div>
			</div>
            :  
            
            <div className="d-flex justify-content-center form-container">
				<div className="col-lg-8 col-md-12 col-sm-9 col-xs-12 form-box">
					<div className="reset-form d-block">
						<div className="reset-password-form">
							<h4 className="mb-3" style={{color:"navy"}}>Reset Your Password</h4>
							<p className="mb-3" style={{color:"#006994",fontFamily:"serif",fontSize:"1.2em"}}>
								 Enter Your New Password
							</p>
							<div className="form-input">
								<span><PasswordIcon/></span>   
								<input type="password" style={{ border: "none",borderBottom: "2px solid navy"}} value={state.pass} placeholder="New Password" onChange={(e)=> setstate({...state, pass:e.target.value})}/>
							</div>
                            <div className="form-input">
								<span><PasswordIcon/></span>
								<input type="password"  style={{ border: "none",borderBottom: "2px solid navy"}} value={state.cpass} onChange={(e)=> setstate({...state,cpass:e.target.value})} placeholder="Confirm Password"/>
							</div>
							<div className="mb-3">
								<button className="btn btn-dark" onClick={()=>resetpass()}>Reset</button>
							</div>
							
						</div>
					</div>
			
				</div>
			</div>
                
            }
</div>
		<Footer/>
	</div>
        
    )
}
