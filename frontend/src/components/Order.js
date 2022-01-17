import React, { useEffect, useState } from 'react'
import { orderService } from '../config/MyProductService'
import { useNavigate } from "react-router";
import jwtdecode from 'jwt-decode';

//order function
function Order() {
    const [state, setState] = useState([])
    const navigate = useNavigate(); 
    useEffect(() => {
        let token = localStorage.getItem('_token');
        let decode = jwtdecode(token)
        orderService({email:decode.email}).then(res => {
            console.log(res.data);
            setState(res.data)
        })

    }, [])
    console.log(state);

    //invoice
    const productInvoice =(ele)=>{
        console.log(ele,"line 20")
        navigate("/invoice",{state:ele})
    }
    return (
        <>
            <div className='container-justify  mb-4 ml-5 mt-5 trans' style={{padding:"2rem", border: "2px solid black", borderRadius: " 10px", boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px", fontFamily: "'Bree Serif', serif", width: "90%", maxHeight: '60vh', overflow: 'auto' }}>
                {
                    state.map(ele =>
                        <>
                            <h4><span style={{color:"#ba8759",fontStyle:"bold",fontFamily:"fantasy"}}>TRANSIT</span> <b>Order By:{ele.card_name}</b></h4>
                            <h6><b>Placed On : {ele.created_at} / <span style={{color:"#008000"}}>Rs. {ele.subtotal+ele.gst}</span></b></h6>
                            <hr />
                            <div>
                                {ele.totalCart.map(data =>
                                    <>
                                        <img src={`/images/${data.product_image}`} height='100px' width='100px' className="ml-3" alt="..." />
                                    </>
                                )}
                            </div>
                            <hr />
                            <button className='btn btn-primary' onClick={()=>productInvoice(ele)}>Download Invoice as pdf</button><hr/>
                        </>
                    )
                }



            </div>

        </>
    )
}

export default Order