import React, { useEffect, useState } from 'react'
import { Card, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Footer from './Footer'
import Navbaar from './Navbaar'
import { useNavigate } from "react-router";
import {Button, Form, FormControl, NavDropdown} from 'react-bootstrap'
import {asscending, descending, fetchProductService, getCatandCol, starsort} from '../config/MyProductService'
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Pagination from 'react-js-pagination'
import Slider from '@material-ui/core/Slider'
import { FaRupeeSign } from "react-icons/fa";
import ReactStars from 'react-stars'
import { useSelector, useDispatch } from 'react-redux';
import './product.css'

export default function Product() {
    const [state, setstate] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [resultperPage, setresultperPage] = useState(0)
    const [productCount, setproductCount] = useState(0)
    const [price, setPrice] = useState([0, 25000]);
    const [sortdata, setSortdata] = useState('all')
    const [categorys, setcategorys] = useState([])
    const [colors, setcolors] = useState([])
    const [fcategorys, setFcategorys] = useState("cate")
    const [fcolor, setFcolor] = useState("color")
    const navigate = useNavigate(); 
    const dispatch = useDispatch();

    const searchProduct = useSelector(state => state.profileReducer)
    useEffect(()=>{
        let prodcount = 0
        let resultPerPage = 0
        let prod = []
        fetchProductService(searchProduct.search,currentPage,  sortdata, fcategorys, fcolor)
        .then(res =>{
            prod=res.data.products
            prodcount= res.data.productsCount
            resultPerPage = res.data.resultPerPage
            setstate(prod)
            setproductCount(prodcount)
            setresultperPage(resultPerPage)
        })
        getCatandCol()
        .then(res=>{
            setcategorys(res.data.category)
            setcolors(res.data.color)
        })

    },[searchProduct.search, currentPage,  sortdata, fcategorys, fcolor])

    //currentpage
    const setCurrentPageNo = (e) => {
        setCurrentPage(e);
      };

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
    const productDetails = (ele)=>{
        navigate("/productdetails", { state: ele })
    }
console.log(state);

//all products
    const alldata = () => {
      setSortdata("all");
        setFcategorys("cate");
        setFcolor("color");
      if (fcategorys !== "cate" || fcolor !== "color") {
        document.getElementById(fcategorys).checked = false;
        document.getElementById(fcolor).checked = false;
        
      }
      dispatch({type:"searchRedux", payload: ''})
    };
  
    //color
    const color = (e) => {
      setFcolor(e);
      setSortdata("alldata");
    };
   
    return (
     <>
         <Navbaar/>
         
        <div className='row side'>
            <div className='col lg-2 md-4 sm-12 pl-5 mt-5 side'>
            <ul className="nav flex-column  ">
                <li className="nav-item">
                    <button className="nav-link btn w-100 mt-2 products font-weight-bold"  onClick={() => alldata()}>All Products</button>
                </li>
            </ul>
            {/* all product filter */}
            <Accordion className="my-3 ">
                <AccordionSummary  
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                <Typography >Categories</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Typography>
                {categorys &&
                    categorys.map((cat) => (
                      <div key={cat._id}>
                        <input
                          type="radio"
                          id={cat._id}
                          onClick={(e) => setFcategorys(e.target.value)}
                          name="categories"
                          value={cat._id}
                        /> {cat.category_name}
                        <br></br>
                      </div>
                    ))}
                  
                </Typography>
                </AccordionDetails>
            </Accordion>

            {fcategorys != "cate" ?
            <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
                >
                <Typography >Colors</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Typography>
                {colors &&
                    colors.map((cat) => (
                      <div key={cat._id}>
                        <input
                          type="radio"
                          id={cat._id}
                          onClick={(e) => color(e.target.value)}
                          name="color"
                          value={cat._id}
                        /> {cat.color_name}
                        <br></br>
                      </div>
                    ))}
                </Typography>
                </AccordionDetails>
            </Accordion>
            : " " }
            
            
            </div>

            <div className='col-9 side'>

            <div className=' text-right mt-2 side' style={{paddingRight:70}}>
               <b style={{fontSize:"1.3rem"}}> Sort By :</b> <span style={{color:"#1E90FF"}}><i class="fa fa-star mx-2" onClick={()=>setSortdata("star")} ></i></span>&nbsp;&nbsp;
                <span style={{color:"#1E90FF"}}><FaRupeeSign style={{fontSize:"0.7rem"}}/><i class="fa fa-arrow-up " onClick={()=>setSortdata("assend")}></i></span>&nbsp; &nbsp;
                <span style={{color:"#1E90FF"}}><FaRupeeSign style={{fontSize:"0.7rem"}}/><i class="fa fa-arrow-down" onClick={()=>setSortdata("desend")}></i></span>
            </div>
           
            {/* product card */}
                <div className='row side'>
                {state.map(ele =>
                    <div className='col my-3 side'>
                    <Card style={{ width: '18rem', boxShadow: "0 0 5px 5px #AEB6BF"}} id='card1'>
              
                <Card.Img variant="top" src={"./images/"+ ele.product_image} height="350" style={{padding:"2rem"}} onClick={()=> productDetails(ele)} />
                <Card.Body style={{backgroundColor:'##f6f6f6'}}>
                    <Card.Title className='font-weight-bold'> {ele.product_name}</Card.Title>
                    <Card.Text>
                   <span className='font-weight-bold text-danger'>Rs.{ele.product_cost}</span>
                   <div>
                   <ReactStars {...starrating(ele)} />
                   </div>
                   <div className='d-flex justify-content-center mt-3 '>
                   <button className='btn card2' onClick={() => dispatch({ type: 'addCart', payload: ele })}>Add to Cart</button>
                   </div>
                  
                    </Card.Text>
                    </Card.Body>
                  </Card>
                    </div>
                      )}
                </div>
            </div>
        </div>

           {/* pagination */}
            <div className="paginationBox d-flex justify-content-center mt-5">
              {fcategorys=='cate' &&
            <Pagination
              activePage={currentPage}
              itemsCountPerPage={resultperPage}
              totalItemsCount={productCount}
              onChange={setCurrentPageNo}
              nextPageText="Next"
              prevPageText="Prev"
              firstPageText="1st"
              itemClass="page-item"
              linkClass="page-link"
              activeClass="pageItemActive"
              activeLinkClass="pageLinkActive"
            /> }
          </div>
         <Footer/>
     </>
    )
}
