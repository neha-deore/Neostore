import React, { useState, useEffect } from 'react'
import { BsStarFill, BsStarHalf } from 'react-icons/bs';
import Footer from './Footer'
import Navbaar from './Navbaar'
import {useLocation } from 'react-router-dom'
import ReactStars from 'react-stars'
import ReactImageMagnify from 'react-image-magnify'
import {WhatsappShareButton, FacebookShareButton, TwitterShareButton,EmailShareButton, 
  PinterestShareButton, FacebookIcon, PinterestIcon,TwitterIcon,WhatsappIcon,EmailIcon} from 'react-share';
import { Box, Tab } from '@mui/material'
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ShareIcon from '@mui/icons-material/Share';
import Swal from 'sweetalert2'
import { FaRupeeSign } from "react-icons/fa";
import { useDispatch } from 'react-redux'
import { fetchRateProduct,rateProductService } from '../config/MyProductService'
export default function ProductDetails() {
  const location = useLocation();
  const [value, setValue] = useState('1');
  const [state, setstate] = useState({})
 const dispatch=useDispatch();
 const [index, setIndex] = useState(0);

 useEffect(() => {
  fetchRateProduct({id:location.state._id}).then(res=>{
   setstate(res.data)
 })
}, [])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const options = {
    edit: false,
    color:"rgba(20,20,20,0.1)",
    activeColor:"tomato",
    size:window.innerWidth<600?20:25,
   
    value:location.state.product_rating,
    isHalf:true,
  };


  
//rating 
 const rating = (ele) => {
  return{
  edit: false,
  color:"rgba(20,20,20,0.1)",
  activeColor:"tomato",
  size:window.innerWidth<600?20:25,
  value:ele.product_rating/ele.rated_by,
  isHalf:true,
  };
}
const rateProduct = {
  size: 20,
  count: 5,
  color: "black",
  activeColor: "red",
  value: 7.5,
  a11y: true,
  isHalf: true,
  emptyIcon: <BsStarFill />,
  halfIcon: <BsStarHalf />,
  filledIcon: <BsStarFill />,
  onChange: newValue => {
      chngeRating(newValue)
  }
};

//product rating change function
const chngeRating = (value) => {
rateProductService({ value:(state.product_rating + value/state.rated_by), rated: state.rated_by + 1,id:state._id }).then(res =>
    setstate(res.data)
 )
    Swal.fire({
      icon:'success',
      title:'Thanks for Rating...',
    })
   
  
}
    return (
        <>
        <Navbaar/>
        <div className="container-fluid">
         <div className="row">
             <div className="col lg-6 md-6 sm-12 mt-5">
             <ReactImageMagnify
                    {...{
                        smallImage: {
                            alt: "product",
                            src: `images/${location.state.product_subimages[index]}`,
                            width: 300,
                            height: 300
                        },
                        largeImage: {
                            src: `images/${location.state.product_subimages[index]}`,
                            width: 800,
                            height: 1000,
                        },
                    }}
                />
               
                
             </div>
             
             <div className="col lg-6 md-6 sm-12">
                 <h2 className="mt-5">{state.product_name}</h2>
                 <ReactStars {...rating(state)} />
                  <hr/>
                  <div>
                     <b>Price:</b>  <span style={{color:"green",fontWeight:"bold",fontSize:"1rem"}}><FaRupeeSign style={{fontSize:"0.7rem"}}/>{state.product_cost}</span> <br/>
                     <b> Color: <span style={{ display: "inline-block",marginTop:"1.4rem", height: '20px', width: "50px", borderRadius: "0px", background: location.state.color_id.color_name}} ></span></b>
                  </div>
                   &nbsp;
                  <div>
                    <span className="mt-3" style={{fontSize:"1.4rem",fontWeight:"bolder"}}>Share </span> <ShareIcon style={{marginTop:"0.5rem"}}/>
  
                    <div className='mt-2'>
                     
                    <FacebookShareButton
                            url="https://www.amazon.in/"
                           
                            hashtag="#react"
                            className='mx-2' 
                            >
                           <FacebookIcon
                              logofillColor="white"
                              round={true}
                              size="2rem"
                            ></FacebookIcon>
                          </FacebookShareButton>

                          <EmailShareButton
                            url="https://www.amazon.in/"
                           
                            hashtag="#react"
                            
                            >
                           <EmailIcon
                              logofillColor="white"
                              round={true}
                              size="2rem"
                            ></EmailIcon>
                          </EmailShareButton>


                    <WhatsappShareButton
                            url="https://www.amazon.in/"
                            className='mx-2' 
                           
                            hashtag="#react">
                            <WhatsappIcon
                              logofillColor="white"
                              round={true}
                              size="2rem"

                            ></WhatsappIcon>
                          </WhatsappShareButton>
                         


                          <TwitterShareButton
                            url="https://www.amazon.in/"
                           
                            hashtag="#react">
                            <TwitterIcon
                              logofillColor="white"
                              round={true}
                              size="2rem"
                            ></TwitterIcon>
                          </TwitterShareButton>
                         

                          <PinterestShareButton
                            url="https://www.amazon.in/"
                            className='mx-2' 
                           
                            hashtag="#react">
                            <PinterestIcon
                              logofillColor="white"
                              round={true}
                              size="2rem"
                            ></PinterestIcon>
                          </PinterestShareButton>
                          &nbsp;&nbsp;

                     </div>
                     <div className="mt-4">
                     <button className="btn btn-info mr-3" onClick={() => dispatch({ type: 'addCart', payload: state })}>ADD TO CART</button>
                     <ReactStars {...rateProduct}/><button className="btn btn-warning">RATE PRODUCT</button>
                     </div>
                  </div>
             </div>
         </div>
         <div className='row'>
             <div className='col lg-6 md-6 sm-12 my-4 ml-3'>
                 <img src={`images/${location.state.product_subimages[0]}`}  onClick={()=>setIndex(0)} height="100" width="100" className='mr-5'/>
                 <img src={`images/${location.state.product_subimages[1]}`}  onClick={()=>setIndex(1)} height="100" width="100"/>
                 <img src={`images/${location.state.product_subimages[2]}`} onClick={()=>setIndex(2)} width="100" className='mx-5'/>
                 <img src={`images/${location.state.product_subimages[3]}`} onClick={()=>setIndex(3)} width="100"/>
             </div>
             <div className='col lg-6 md-6 sm-12'></div>
         </div>

         <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Description" value="1" />
                <Tab label="Feature" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1"  style={{fontFamily:"inherit"}}>{location.state.product_desc}</TabPanel>
            <TabPanel value="2" > <h6>{location.state.product_features.slice(0,100)}</h6>
          </TabPanel>
          </TabContext>
        </Box>
         </div>
         <Footer/>
        </>
    )
}
