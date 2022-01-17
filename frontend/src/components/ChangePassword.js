import React, {useState, useEffect} from 'react'
import jwtdecode from 'jwt-decode'
import { changePasswordService } from '../config/Myservice'   
import Swal from 'sweetalert2'
import bcrypt from 'bcryptjs'
import { Navigate } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
export default function ChangePassword() {
    const [state, setstate] = useState({oldpassword: "", newpassword: "", confpassword: "" })
    const [pass, setpass] = useState({password:'',email:''})

    useEffect(()=>{ 
        if(localStorage.getItem('_token')!== undefined){
            let token = localStorage.getItem('_token');
            let decode = jwtdecode(token)
            console.log(decode)     
            setpass({password:decode.password,email:decode.email})
        }
       },[])

    const handler = (event) => {
        const { name, value } = event.target
        setstate({ ...state, [name]: value })
    }

    //onsubmit
    const submit = () => {
        if (state.oldpassword !== '' && bcrypt.compareSync(state.oldpassword,pass.password)) {
            if(state.newpassword !== '' && state.confpassword !== '' && state.newpassword === state.confpassword){
                changePasswordService({ email:pass.email, password: state.newpassword})
				.then(res => {
					
                    Swal.fire({
                        icon:'success',
                        title: res.data.msg,
                    })
                    localStorage.setItem("_token",res.data.token);				
				})
            }
            else{
                
                Swal.fire({
                    icon: 'warning',
                    title: 'Oops...',
                    text: 'Password Does Not Match',
                  })
            }            
        }
        else {
            
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please Enter Correct Password',
              })
        }
    }

    return (
        <>
          {localStorage.getItem('_token') !=undefined ?
        <>
            <div className='d-flex justify-content-center'>
            <Card className='mt-5 trans font-weight-bold w-75 mb-5' style={{background:" linear-gradient(#a0d6b4 , #5f9ea0)",color:"navy"}}>
                <Card.Title className='text-center mt-3'>
                 <h3 style={{fontFamily:"Oswald"}}>Change Password</h3>
                </Card.Title>

                <Card.Body>
                <Card.Text style={{fontFamily: "Lusitana",fontWeight:"bold"}}>
                    <div className='form-input'>
                    Old Password :
                    <input type="password" class="form-control mt-2" style={{ border: "none",borderBottom: "2px solid navy"}} id="oldpassword" placeholder="Old password" name="oldpassword" onChange={handler} value={state.oldpassword} />
                    </div>
                    <div className='my-3'>
                    New Password :
                        <input type="password" class="form-control mt-2"  style={{ border: "none",borderBottom: "2px solid navy"}} id="newpassword" placeholder="New password" name="newpassword" onChange={handler} value={state.newpassword}/>
                    </div>
                    <div>
                    Confirm Password :
                        <input type="password" class="form-control mt-2" style={{ border: "none",borderBottom: "2px solid navy"}} id="confpassword" placeholder="Confirm password" name="confpassword" value={state.confpassword} onChange={handler}/>
                        <button class="btn btn-primary mt-4" onClick={() => submit()}>Submit</button>
                   </div>
                </Card.Text>
                </Card.Body>
            </Card>
            </div>
           
            </>
            :<Navigate to="/login"></Navigate>
         }
        </>
    )
}
