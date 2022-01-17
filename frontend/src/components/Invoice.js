import React, { useEffect, useState } from 'react'
import './invoice.css'
import jwtDecode from 'jwt-decode'
import ReactToPdf from 'react-to-pdf';
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const options = {
    orientation: 'potrait',
    unit: 'in',
    format: 'A4'
};

export default function Invoice() {
    const [state, setstate] = useState({})
    const location = useLocation()
    const navigate = useNavigate()
    const ref = React.createRef();

    useEffect(()=>{
        let token = localStorage.getItem('_token');
        let decode = jwtDecode(token)
        setstate(decode)
    },[])
    console.log(location.state)

    const download = () => {
        console.log("dfytr")
    }
    return (
        <>  
            <div className='container invoicecard mt-3 d-flex justify-content-between'> 
                <button className='btn btn-warning' onClick={()=> navigate("/account/order")}>Go back</button>
                <ReactToPdf targetRef={ref} filename={`_invoice.pdf`} options={options} x={0.6} y={0.3} scale={0.6}>
                            {({ toPdf }) => (
                                <button className='btn btn-warning' onClick={() => {
                                    toPdf();
                                }} variant="contained">
                                    Download
                                </button>
                            )}
                        </ReactToPdf> 
            </div>
            <div ref={ref} id='divToPrint' className="container my-4 page">
                <div className="p-5">
            <section className="top-content bb d-flex justify-content-between">
                <div className="logo">
                    <img src="images/logo.PNG" alt="" className="img-fluid"/>
                </div>
                <div className="top-left">
                    <div className="graphic-path">
                        <p>Invoice</p>
                    </div>
                    
                </div>
            </section>

            <div className="store-user mt-5">
                <div className="col-10">
                    <div className="row bb pb-3">
                        <div className="col-7">
                            <p>Supplier,</p>
                            <h2>NEO<span className='text-danger'>STORE</span></h2>
                            <p className="address"> Hinjawadi Phase 1 Rd, <br/> Symbiosis Uni, Rajiv Gandhi It Park, <br/> Pune, Maharashtra 411057  </p>
                        </div>
                        <div className="col-5">
                            <p>Client,</p>
                            <h2>{state.firstname}{' '}{state.lastname}</h2>
                            {location.state.addresses.map(ele=>
                            <p className="address">{ele.address}, <br/> {ele.city}{" "}{ele.states}- {ele.pincode} <br/>{ele.country}</p>
                            )}
                        </div>
                    </div>
                    <div className="row extra-info pt-3">
                        <div className="col-7">
                            <p>Payment Method: <span>Online Mode</span></p>
                            <p>Order Number: <span>#868</span></p>
                        </div>
                        <div className="col-5">
                           
                            <p>Order Date: <span>{location.state.created_at}</span></p>
                         
                        </div>
                    </div>
                </div>
            </div>

            <section className="product-area mt-4">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <td>Item Description</td>
                            <td>Price</td>
                            <td>Quantity</td>
                            <td>Total</td>
                        </tr>
                    </thead>
                    <tbody>
                     {location.state.totalCart.map(ele=>
                        <tr>
                        
                            <td>
                                <div className="media">
                                    <img className="mr-3 img-fluid" src={`./images/${ele.product_image}`} alt="Product 01"/>
                                    <div className="media-body">
                                        <p className="mt-0 title">{ele.product_name}</p>
                                    </div>
                                </div>
                            </td>
                            <td>Rs.{ele.product_cost}</td>
                            <td>{ele.quantity}</td>
                            <td>Rs.{ele.product_cost * ele.quantity} </td>
                        </tr>
                       )}
                    </tbody>
                </table>
            </section>

            <section className="balance-info">
                <div className="row">
                    <div className="col-8">
                        <p className="m-0 font-weight-bold"> Note: </p>
                        <p>Keep Shopping!!!Visit Again!!</p>
                    </div>
                    <div className="col-4">
                        <table className="table border-0 table-hover">
                            <tr>
                                <td>Sub Total:</td>
                                <td>Rs.{location.state.subtotal}</td>
                            </tr>
                            <tr>
                                <td>GST(5%):</td>
                                <td>Rs.{location.state.gst}</td>
                            </tr>
                            <tfoot>
                                <tr>
                                    <td>Total:</td>
                                    <td>Rs.{location.state.subtotal + location.state.gst}</td>
                                </tr>
                            </tfoot>
                        </table>

                    
                       
                    </div>
                </div>
            </section>

            <footer>
                <hr/>
            </footer>
        </div>
    </div>
        </>
    )
}