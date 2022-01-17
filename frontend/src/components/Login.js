import React, {useState} from 'react'
import { useNavigate } from "react-router";
import SocialButton from './SocialButton';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'
import Footer from './Footer';
import { forgetService, loginpage } from '../config/Myservice';
import jwtDecode from 'jwt-decode'
import  {useDispatch} from 'react-redux'
import Navbaar from './Navbaar'
import "./Login.css"

export default function Login() {
    const [state, setstate] = useState({email:'', password:''})
    const navigate = useNavigate(); 
    const dispatch = useDispatch();

    //cart 
    const cartData = (data)=>{   
        let decode = jwtDecode(data)
        let cart = JSON.parse(localStorage.getItem('cart'))
        if(localStorage.getItem('cart')!=undefined){
          let arr=[...cart]
          decode.cart.forEach(element=>{
            if(!cart.find(ele =>ele._id === element._id)){
              arr.push(element)
            }
          });
            localStorage.setItem('cart',JSON.stringify([...arr]))
          }
        else{
          if(decode.cart!=null){
            localStorage.setItem('cart',JSON.stringify([...decode.cart]))
        }
        else{
            localStorage.setItem('cart',JSON.stringify([]))
           }
        }
        dispatch({ type: "onLogin", payload:decode.cart})    
        return 10
    }

    //login success
    const checkdata = () => {
        if(state.email != '' && state.password != ''){
          loginpage({email:state.email, password:state.password})
            .then(res=>{
                if(res.data.err==0){
                  console.log(res.data)
                   localStorage.setItem("_token",res.data.token);
                   cartData(res.data.token)
                   navigate("/")
                }
                else{
                  
                    Swal.fire({
                        icon: 'warning',
                        title: 'Oops...',
                        text: 'Email and Password Does Not Match',
                      })
                }
            })
        }
        else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please Enter Login Details',
              })
        }
    }

    //social login success
    const handleSocialLogin = (user) => {
        console.log(user._profile)
        loginpage({email:user._profile.email, password:user._profile.id})
            .then(res=>{
              console.log(res.data.error);
                if(res.data.err==0){
                  console.log(res.data)
                   localStorage.setItem("_token",res.data.token);
                   let c= cartData(res.data.token)
                   navigate("/")
                }
                else{
                    Swal.fire({
                      icon:'error',
                      'title':'Oops..',
                      text:res.data.msg,
                    })
                }
            })
    }

    //sociallogin failure
    const handleSocialLoginFailure = (err) => {
        console.error(err);
      };

      //forget password
    const forgetpass = () => {
        if(state.email != ''){
            forgetService({email:state.email})
            .then(res=>{
                if(res.data.err==0){
                     navigate("/forgetpassword", {state:{email:state.email, otp:res.data.otp}})
                  }
                  else{
                        alert(res.data.msg)
                  }
            })
        }
        else{
            
          Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Please Enter Email',
            })
            }
    }

    return (
        < div id="login">
   <Navbaar/>
    <div  >
      <div class="container-fluid " >
        <div class="row d-flex justify-content-center align-items-center" >
          <div class="col-md-9 col-lg-6 col-xl-5" >
          </div>
          <div class="col-md-8 mt-5 p-2 loginbox">
           <div  >
                <h2 class="heading " >LogIn Here...</h2><br/>
                <h5 class="text-dark" style={{marginLeft:"3rem"}}  >Sign in with</h5>
               <div class="row mb-3">
              
              {/* sociallogin facebook */}
                <SocialButton style={{marginTop:"10px",width:"40%",marginLeft:"4rem"}}
                                    provider="facebook"
                                    appId="2171649733000264"
                                    onLoginSuccess={handleSocialLogin}
                                    onLoginFailure={handleSocialLoginFailure} 
                                    className="btn btn-info  text-white  " >
                                    <i class="fa fa-facebook" style={{paddingRight:"0.5em"}}> </i>
                                    Facebook
                                </SocialButton>

                 {/* sociallogin google */}
                 <SocialButton style={{marginTop:"10px",marginLeft:"1em",width:"40%"}}
                                provider="google"
                                appId="151638728182-5vc7vhb1hv7jamr02f2hlqlds98434m9.apps.googleusercontent.com" 
                                onLoginSuccess={handleSocialLogin}
                                onLoginFailure={handleSocialLoginFailure}
                                className="btn btn-danger "> 
                                <i class="fa fa-google " style={{paddingRight:"0.5em"}}> </i>
                                Google
                            </SocialButton >

</div>
              </div>

             <h6 style={{textAlign:"center"}}>OR</h6> 

              {/* <!-- Email input --> */}
              <div class="form-outline mb-4">
                <input
                  type="email"
                  id="form3Example3"
                  class="form-control form-control-lg w-75" style={{marginLeft:"2.4em",borderRadius:"10px",border: "none",borderBottom: "2px solid red"}}
                  onChange={(e) =>
                    setstate({ ...state, email: e.target.value })
                  }
                  value={state.email}
                  placeholder="Enter Email"
                />
               
              </div>

              {/* <!-- Password input --> */}
              <div class="form-outline mb-3">
                <input
                  type="password"
                  id="form3Example4"
                  class="form-control form-control-lg w-75 " style={{marginLeft:"2.4em",borderRadius:"10px", border: "none",borderBottom: "2px solid red"}}
                  onChange={(e) =>
                    setstate({ ...state, password: e.target.value })
                  }
                  value={state.password}
                  placeholder="Enter password"
                />
                
              </div>

               <div class="d-flex  align-items-center">
               <a
                  href="#!"
                  class="text-body" 
                  onClick={() => forgetpass()}
                  style={{
                    textDecoration: "none",
                    color: "black",
                    cursor: "pointer",
                    padding:"4px",
                  
                    marginLeft:"5em",
                    fontWeight:"bold"
                  }}
                >
                  Forgot password?
                </a>
              </div>

              <div class="text-center text-lg-start mt-4 pt-2" style={{marginLeft:"3em"}}>
                <button
                  type="button"
                  class="btn btn-primary btn-lg"
                  style={{"paddingLeft": "2.5rem" , "paddingRight": "2.5rem"}}
                  onClick={() => checkdata()}
                >
                  Login
                </button>
                
                <div class="text-black  fw-bold mt-2 pt-1 mb-0" style={{marginLeft:"3em"}}>Don't have an account?
						<Link to="/registration" className='font-weight-bold' style={{textDecoration:"none",color:"black"}}> Register here</Link>
						</div>
              </div>
           
          </div>
        </div>
      </div>
     </div>
    &nbsp;
    <Footer/>
    </div>
        
 )
}
