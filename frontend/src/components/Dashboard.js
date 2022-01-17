import React, { useEffect, useState } from 'react'
import Footer from './Footer'
import Navbaar from './Navbaar'
import './dashboard.css'
import { Card } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import ReactStars from 'react-stars'
import {getPopularProducts} from '../config/MyProductService'
import { Button, Grid } from '@mui/material'


export default function Dashboard() {
    const [state, setstate] = useState([])
    const dispatch = useDispatch()
    const navigate = useNavigate(); 

    useEffect(() => {
        let prod = [];
        getPopularProducts().then((res) => {
          prod = res.data.products;
          setstate(prod);
        });
      }, []);

      //starrating
    const starrating = (ele)=>{
        return  {
            edit: false,
            color:"rgba(20,20,20,0.1)",
            activeColor:"tomato",
            size:window.innerWidth<600?20:25,
            value:ele.product_rating/ele.rated_by,
            isHalf:true,
        };
    }

    //productdetails
    const productDetails = (ele)=>{
        navigate("/productdetails", { state: ele })
    }
    return (
        <div>
            <Navbaar />
            <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
                <div className="carousel-inner">
                    <div style={{ width: "100%", height: "80%" }}>

                        <div className="carousel-item active" >
                        
                            <img src="https://my-furniture.com.au/media/wysiwyg/slideshow/sb-carousel.jpg" alt="First slide" style={{ width: "100%", height: "35rem" }} />
                            <Link to="/product" class="seeMore"> See More...

                                <div class="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"></path><path fill="currentColor" d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path></svg>
                                </div>
                            </Link>
                        </div>


                        <div className="carousel-item">
                            <img src="https://www.asics.com/dw/image/v2/BBTN_PRD/on/demandware.static/-/Sites-asics-us-Library/default/dw0b8183dc/asics_homepage_hero_desktop_nimbus23_112720.jpg" alt="Second slide" style={{ width: "100%", height: "35rem" }} />
                            <Link to="/product" class="seeMore"> See More...
                                <div class="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"></path><path fill="currentColor" d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path></svg>
                                </div>
                            </Link>
                         
                        </div>
                        <div className="carousel-item">
                            <img src="https://kdvr.com/wp-content/uploads/sites/11/2021/10/1040x585-2021-0920-best-kate-spade-bags-70b46a.jpg?w=960&h=540&crop=1" alt="Third slide" style={{ width: "100%", height: "35rem" }}  />
                            <Link  to="/product" class="seeMore"> See More...
                                <div class="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"></path><path fill="currentColor" d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path></svg>
                                </div>
                            </Link>
                           
                        </div>
                    </div>
                </div>
                <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                </a>
 </div>

 
 <div  className='text-center mt-3'  >
 <h1 style={{ fontSize: "40px",color:"lightcoral",fontWeight:"bold",fontFamily:"cursive"}}>Popular Products</h1>
       
        <h5 style={{ fontFamily:"inherit",color:"black" }}>
        <Link to="/product">View All</Link>
        </h5>
 </div>
 <Grid container spacing={2}>
 {state.map(ele =>
  <Grid item xs={12} sm={12} md={4} key={ele._id} className='my-2'>
  <Card className="products_pop" style={{ width: "320px" }} className="mx-auto products_pop shadowCus">
      <img variant="top" src={"./images/" + ele.product_image} height="320" width='315' style={{padding:"2rem"}} className="mx-auto" alt="..." onClick={() => navigate("/productDetails", { state: ele })} />
      <Card.Body>
          <Card.Title className='text-center'> {ele.product_name}</Card.Title>
          <Card.Title style={{ color: "#FF703B" }} className='d-flex justify-content-between'>
              <span>&#8377; {ele.product_cost}</span>
              <ReactStars {...starrating(ele)} />
          </Card.Title>
          <div className='text-center'>
              <Button className='button_fun' variant="contained" color='error' onClick={() => dispatch({ type: 'addCart', payload: ele })}>Add Cart</Button>
          </div>
      </Card.Body>
  </Card>
</Grid>

 )}
  </Grid>
            
            <Footer />
        </div>
    )
}
