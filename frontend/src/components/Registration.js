import React, { useState } from 'react'
import { addPost } from '../config/Myservice';
import { useNavigate } from "react-router";
import Swal from 'sweetalert2'
import SocialButton from './SocialButton';
import "./Registration.css";
import { Link } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import Navbaar from './Navbaar';
import Footer from './Footer';
const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const regForName = RegExp(/^[A-Za-z]{3,30}$/);
const regForContact = RegExp(/^[6-9][0-9]{9}/);
const regForpassword = RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");

export default function Registration() {
    const [errors, seterrors] = useState({errfirstname:'', errlastname:'', erremail:'', errcontact:'', errpassword:'', errcpassword:'', errgender:'', pass: null})
    const [data, setdata] = useState({firstname:'', lastname:'', email:'', contact:'',password:'', cpassword:'', gender:''})
    const navigate = useNavigate()

    const handler = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case "firstname":
                let error1 = regForName.test(value) ? "" : "Invalid Name";
                seterrors({ ...errors, errfirstname: error1 });
                break;

            case "lastname":
                let error2 = regForName.test(value) ? "" : "Invalid Name";
                seterrors({ ...errors, errlastname: error2 });
                break;

            case "email":
                let error3 = regForEmail.test(value) ? "" : "Invalid Email";
                seterrors({ ...errors, erremail: error3 });
                break;

            case "contact":
                let error4 = regForContact.test(value) ? "" : "Invalid Contact";
                seterrors({ ...errors, errcontact: error4 });
                break;

            case "password":
                let error5 = regForpassword.test(value) ? "" : "Invalid Password";
                seterrors({ ...errors, errpassword: error5, pass: value });
                break;

            case "cpassword":
                let error6 = value === errors.pass ? "" : "Password does not match";
                seterrors({ ...errors, errcpassword: error6 });
                break;
        }
        setdata({...data, [name]: value})
    }

    //validation check
    const validate = async () => {
        if(data.firstname != '' && data.lastname != '' && data.email != '' && data.contact != '' && data.password != '' && data.cpassword != '' && data.gender != ''){
            let formData = {
                firstname:data.firstname,
                lastname:data.lastname,
                email:data.email,
                contact:data.contact,
                password:data.password,
                cpassword:data.cpassword,
                gender:data.gender
            }
            await addPost(formData)
            .then(res =>{
                if (res.data.err == 0){
                    alert(res.data.msg)
                    navigate("/login")
                }
                else{
                    
                    Swal.fire({
                        icon: 'warning',
                        title: 'Oops...',
                        text: res.data.msg,
                      })
                }
            })
        }
        else{
           
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Enter All Registration Details',
              })
        }
    }


    //sociallogin function
    const handleSocialLogin = async (user) => {
            let formData = {
                firstname: user._profile.firstName,
                lastname: user._profile.lastName,
                email: user._profile.email,
                contact: 9999999999,
                password: user._profile.id,
                gender: 'undefined'
              };
             await addPost(formData)
             .then(res =>{
                 if (res.data.err == 0){
                     alert(res.data.msg)
                     navigate("/")
                 }
                 else{
                   
                    Swal.fire({
                        icon: 'warning',
                        title: 'Oops...',
                        text: res.data.msg,
                      })
                 }
             })
      };


    //social login failure function
    const handleSocialLoginFailure = (err) => {
        console.error(err);
      };

    return (
        < div id="register">
      <Navbaar/>
        <div class="h-100 h-custom">
          <div class="d-flex justify-content-center">
            <div class="card rounded-3-center here" style={{ width: "60%" ,marginTop:"3%"}}>
              <div class="container-fluid">
                <div class="row">
                  <div class=" form-box text-center ">
                    <div  style={{ marginTop: "10%",marginLeft:"10px" }}>
                      <h1 id="heading">Create an Account!!</h1>
                    </div>
  
                    <div class="form-input">
                      <input
                        type="text"
                        className="w-100 form-control-center"
                        id="firstname"
                        name="firstname"
                        value={data.firstname}
                        onChange={handler}
                        placeholder="First Name"
                        style={{height:"35px",marginLeft:"5em",borderRadius:"10px",border: "none",borderBottom: "2px solid red",padding:"1em"}}
                      />
                      <span className="text-danger">{errors.errfirstname}</span>
                    </div>
                    <br/>
  
                    <div class="form-input">
                      <input
                        type="text"
                        className="w-100 form-control-center"
                        id="lastname"
                        name="lastname"
                        value={data.lastname}
                        onChange={handler}
                        placeholder="Last Name"
                        style={{height:"35px",marginLeft:"5em",borderRadius:"10px",border: "none",borderBottom: "2px solid red",padding:"1em"}}
                      />
                      <span className="text-danger">{errors.errlastname}</span>
                    </div>
                    <br/>
  
                    <div class="form-input">
                      <input
                        type="email"
                        className="w-100 form-control-center"
                        id="email"
                        name="email"
                        value={data.email}
                        onChange={handler}
                        placeholder="Email Address"
                        style={{height:"35px",marginLeft:"5em",borderRadius:"10px",border: "none",borderBottom: "2px solid red",padding:"1em"}}
                      />
                      <span className="text-danger">{errors.erremail}</span>
                    </div>
                    <br/>
  
                    <div class="form-input">
                      <input
                        type="text"
                        className="w-100 form-control-center"
                        id="contact"
                        name="contact"
                        value={data.contact}
                        onChange={handler}
                        placeholder="Contact Number"
                        style={{height:"35px",marginLeft:"5em",borderRadius:"10px",border: "none",borderBottom: "2px solid red",padding:"1em"}}
                      />
                      <span className="text-danger">{errors.errcontact}</span>
                    </div>
                    <br/>
  
                    <div class="form-input">
                      <input
                        type="password"
                        className="w-100 form-control-center"
                        id="password"
                        name="password"
                        value={data.password}
                        onChange={handler}
                        placeholder="Password"
                        style={{height:"35px",marginLeft:"5em",borderRadius:"10px",border: "none",borderBottom: "2px solid red",padding:"1em"}}
                      />
                      <span className="text-danger">{errors.errpassword}</span>
                    </div>
                    <br/>
  
                    <div class="form-input">
                      <input
                        type="password"
                        className="w-100 form-control-center"
                        id="cpassword"
                        name="cpassword"
                        value={data.cpassword}
                        onChange={handler}
                        placeholder="Confirm Password"
                        style={{height:"35px",marginLeft:"5em",borderRadius:"10px",border: "none",borderBottom: "2px solid red",padding:"1em"}}
                      />
                      <span className="text-danger">{errors.errcpassword}</span>
                    </div>
                    <br/>
  
                    <div className="text-start" style={{marginLeft:"110px",marginLeft:"5em"}}>
                      Gender
                      <input
                        type="radio"
                        id="male"
                        name="gen"
                        value="male"
                        onClick={(e) =>
                          setdata({ ...data, gender: e.target.value })
                        }
                      />{" "}
                      <span className="text-dark font-weight-bold mr-3">
                        {" "}
                        Male
                      </span>
                      <input
                        type="radio"
                        id="female"
                        name="gen"
                        value="female"
                        onClick={(e) =>
                          setdata({ ...data, gender: e.target.value })
                        }
                      />{" "}
                      <span className="text-dark font-weight-bold mr-3">
                        {" "}
                        Female
                      </span>
                    </div>
  
                    <div class="my-3">
                      <button class="btn btn-dark register_button" onClick={validate}>
                        Register
                      </button>
                    </div>
  
                    <div class="text-dark mb-3 register_with">
                      or register with
                    </div>
                    <div class="row mb-3">
                      <div class="col-6">
                        <SocialButton
                          style={{ color: "white", marginLeft: "2rem" }}
                          provider="facebook"
                          appId="2171649733000264"
                          onLoginSuccess={handleSocialLogin}
                          onLoginFailure={handleSocialLoginFailure}
                          className="btn btn-info"
                        >
                          <i
                            class="fa fa-facebook"
                            style={{ paddingRight: "0.5em" }}
                          ></i>
                          Continue With facebook
                        </SocialButton>
                      </div>
                      
                      <div class="col-6">
                        <SocialButton
                          provider="google"
                          appId="151638728182-5vc7vhb1hv7jamr02f2hlqlds98434m9.apps.googleusercontent.com"
                          onLoginSuccess={handleSocialLogin}
                          onLoginFailure={handleSocialLoginFailure}
                          className="btn btn-danger"
                        >
                          <i
                            class="fa fa-google"
                            style={{ paddingRight: "0.5em" }}
                          ></i>
                          Continue With Google
                        </SocialButton>
                      </div>
                    </div>
                    <div class="text-dark account">
                      Already have an account?
                      <Link
                        to="/login"
                      
                      >
                        {" "}
                        Login here
                      </Link>
                    </div>
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
