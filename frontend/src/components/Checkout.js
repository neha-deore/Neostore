import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { checkOutService } from '../config/MyProductService'
import jwtdecode from 'jwt-decode';
import { useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import Navbaar from './Navbaar'
import Footer from './Footer';
import Swal from 'sweetalert2'
import { cartSaveService } from '../config/Myservice';


function Checkout() {
    const location = useLocation();
    const navigate = useNavigate()
    const dispatch = useDispatch();


    const [state, setState] = useState({ cardNum: '', cvv: '', name: '', expDate: '', userEmail: '' })
    const [errors, setErrors] = useState({ cardNum: '', cvv: '', name: '', expDate: '' })
    const [isSumbit, setIsSubmit] = useState(false)

    console.log(location.state)

    useEffect(() => {
        if (localStorage.getItem('_token') !== undefined) {
            let token = localStorage.getItem('_token');
            let decode = jwtdecode(token)
            console.log(decode)
            setState({ ...state, userEmail: decode.email })

        }
        else {
            navigate('/login')
        }
    }, [])

    const checkout = () => {
        setErrors(null)
        setIsSubmit(true)
        let temp = validate(state)
        if (state.cardNum != '' && state.cvv != '' && state.expDate != '' && state.name != '' && state.userEmail != '' && temp.length === 0) {
            let formData = {
                user_email: state.userEmail,
                card_name: state.name,
                subtotal: location.state.subTotalState.subTotal,
                gst: location.state.subTotalState.gst,
                totalCart: location.state.cart,
                addresses:location.state.address,
            }
            checkOutService(formData)
                .then(res => {
                    cartSaveService({ data: [], email: state.userEmail })
                    .then(res => {
                        console.log(res.data.token)
                        localStorage.setItem('_token',res.data.token)
                    })
                    alert(res.data.msg)
                    localStorage.removeItem('cart')
                    dispatch({ type: "emptyCart", payload: 0 })
                    navigate('/')
                })
            
        }
        else{
            
			Swal.fire({
				icon: 'warning',
				title: 'Oops...',
				text: 'All fields are Required!!!',
			  })
        }
    }




    const validate = (values) => {
        const e = []
        const errors = {};
        if (!values.cardNum) {
            e.push({ cardNum: "card number required" })
            errors.cardNum = "Card Number is required"
        } else if (values.cardNum.length !== 16) {
            e.push({ cardNum: "Card number should be  16 digits" })
            errors.cardNum = "Card number should be  16 digits"
        }
        if (!values.cvv) {
            e.push({ cvv: "cvv is required" })
            errors.cvv = "CVV  is required"
        } else if (values.cvv.length !== 3) {
            e.push({ cvv: "CVV  should be  3 digits" })
            errors.cvv = "CVV  should be  3 digits"
        }
        if (!values.name) {
            e.push({ name: "Name is required" })
            errors.name = "Name  is required"
        } else if (values.name.length < 3) {
            e.push({ name: "Name  should be greater than 3 letter" })
            errors.name = "Name  should be greater than 3 letter"
        }
        if (!values.expDate) {
            e.push({ expDate: "Expiration Date is required" })
            errors.expDate = "Expiration Date  is required"
        }


        setErrors(errors)
        return e

    }

    useEffect(() => {
        if (Object.keys(errors).length === 0 && isSumbit) {
            console.log(errors);
        }
    }, [errors])

    return (
        <>
       <Navbaar/>
       <h2 className='text-center mt-5 font-weight-bold' >
            MAKE YOUR PAYMENT HERE!!
            </h2>
        <div className='container p-4 mb-5' style={{ marginTop: '4rem', width: '39rem', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', backgroundImage: 'linear-gradient(grey,white)' , fontFamily:"Oswald"}}>
                <div className="row">
                    <div className="col">
                        <label className='mt-3 ml-3 font-weight-bold'>Card Number</label>
                        <input type="text" className="form-control  ml-3" value={state.cardNum} placeholder="1234 1234 1234 1234" maxlength="16" name='cardNum' onChange={e => setState({ ...state, cardNum: e.target.value })} />
                        {errors.cardNum && <p className="alert alert-danger error">{errors.cardNum}</p>}
                    </div>
                    <div className="col">
                        <label className='mt-3 ml-3 font-weight-bold'>CVV</label>
                        <input type="text" className="form-control  mr-3" name='cvv' value={state.cvv} placeholder="123" maxlength="3" onChange={e => setState({ ...state, cvv: e.target.value })} />
                        {errors.cvv && <p className="alert alert-danger error">{errors.cvv}</p>}

                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <label className='mt-4 ml-3 font-weight-bold'>Name On Card</label>
                        <input type="text" className="form-control  ml-3" name='name' value={state.name} placeholder="abc" onChange={e => setState({ ...state, name: e.target.value })} />
                        {errors.name && <p className="alert alert-danger error">{errors.name}</p>}


                    </div>
                    <div className="col">
                        <label className='mt-4 ml-3 font-weight-bold'>Expiration Date</label>
                        <input type="date" className="form-control" name='expDate' value={state.expDate} placeholder="Expiration Date" onChange={e => setState({ ...state, expDate: e.target.value })} />
                        {errors.expDate && <p className="alert alert-danger error">{errors.expDate}</p>}

                    </div>
                </div>
                <button className='btn btn-danger mb-2 mt-2' style={{ marginLeft: '1rem' }} onClick={() => checkout()}>Submit</button>
            </div>  
 <Footer/>
        </>
    )
}

export default Checkout




       
