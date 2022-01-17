import React,{useEffect,useState} from 'react'
import {useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { cartService } from '../config/MyProductService';
import Footer from './Footer';
import Navbaar from './Navbaar';
import { FaRupeeSign } from "react-icons/fa";  
import { AiTwotoneDelete } from "react-icons/ai"; 
import { useDispatch } from 'react-redux'
import jwtDecode from 'jwt-decode';
import Swal from 'sweetalert2'

function Cart() {
    const [state,setState] = useState([])
    const [count,setCount] = useState(0)
    const [subTotalState,setSubTotalState] = useState({subTotal:0,gst:0,grandTotal:0})
    const cartId = useSelector(state => state.cartData)
    const dispatch = useDispatch();
    const navigate = useNavigate()

    useEffect(() => {
        if (localStorage.getItem('cart') != undefined) {
            let data = [...JSON.parse(localStorage.getItem('cart'))]   
                setState([...data])
                totalCount(data)
        }
        
    }, [cartId.count,count])

    //product increasing count
    const countUp = (id) =>{
        let data = state
        data[id].quantity+=1;
        localStorage.setItem('cart',JSON.stringify(data))
        setCount(count+1)
        
    }
    console.log(state);

    //product decreasing count
    const countDown = (id) =>{
        let data = state
        if(data[id].quantity>1)
       { 
        data[id].quantity-=1;
        localStorage.setItem('cart',JSON.stringify(data))
        setCount(count+1)
}
else{
    dispatch({ type: "deleteCart", payload:id})
}
    }

    //totalcount
    const totalCount = (data) =>{
        let totalValue = 0;
        data.forEach(ele=> {
            totalValue = totalValue+(ele.quantity*ele.product_cost)
        })
        let gst = (totalValue * 5)/100;
        setSubTotalState({subTotal:totalValue,gst:gst,grandTotal:totalValue+gst})
    }
    const proceed = ()=>{
        navigate("/account/address", { state: {subTotalState:subTotalState,cart:state} })
    }
    return (
        <>
        { console.log(state,"after p")}
        <Navbaar/>
        <div className='container-justify'>
            {state.length > 0 ?
            <div className='row mt-5 ml-3 mr-3'>
                <div className='col-lg-9 '>
                    <div className='container m-2'style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', backgroundColor: 'white' }}>
                  
                        <table className='table mt-4 ' style={{width: "100%" ,maxHeight:'10vh',overflow:'auto'}} >
                            <thead style={{fontSize:"1.3rem"}}>
                                <tr>
                                    <th>Products</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody >
                                {state.map((data,index)=>
                                   <tr>
                                      <td><img src={`images/${data.product_image}`} height='50px' width='50px' className='mr-3'  /><b>{data.product_name}</b></td> 

                                      <td><button className='btn mr-1' onClick={()=>countDown(index)}> - </button>{data.quantity}<button className='btn ml-1' onClick={()=>countUp(index)}>+</button></td> 

                                      <td><FaRupeeSign/>{data.product_cost} /-</td> 
                                      <td><FaRupeeSign/>{data.quantity * data.product_cost}</td> 
                                      
                                      <td><button className='btn btn-danger' 
                                      onClick={()=>dispatch({ type: "deleteCart", payload:index})}><AiTwotoneDelete/></button></td> 
                                   </tr>
                                    
                                    
                                    )}
                            </tbody>

                        </table>


                    </div>

                </div>
                <div className='col-lg-3 '>
                    <div className='container max-height-75 m-2 mt-4'style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', backgroundColor: 'white' }}>
                        <h4 className='mx-3 py-4 font-weight-bold'>Review Order</h4>
                        <table className='table'>
                            <tbody>
                                <tr>
                                    <td>Subtotal</td>
                                    <td><FaRupeeSign/>{subTotalState.subTotal}</td>
                                </tr>
                                <tr>
                                    <td>GST (5%)</td>
                                    <td><FaRupeeSign/>{subTotalState.gst}</td>
                                </tr> 
                                <tr>
                                    <td>Order Total</td>
                                    <td><FaRupeeSign/>{subTotalState.grandTotal}</td>
                                </tr>
                                <tr>
                                    {localStorage.getItem('_token')!= undefined ?
                                     <td colSpan='2'> <button className='w-100 mt-5 btn btn-primary' onClick={() =>proceed()} >Proceed</button></td>
                                     :
                                     <td colSpan='2'> <button className='w-100 mt-5 btn btn-primary' onClick={() =>navigate('/login')} >Proceed</button></td>
                                    }
                                   
                                   
                                </tr>
                            </tbody>
                        </table>

                    </div>
                </div>

            </div>
   : <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqqdVXvir49zN5OqBsWQWbBnoAWnYE7g5SLA&usqp=CAU" style={{marginLeft:"35em"}}  height="350px" width="350px"/>
   }
          </div>  
        <Footer/>
            
        </>
    )
}

export default Cart