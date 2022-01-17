import React, { Component } from 'react'

class ErrorBoundary extends Component {
   constructor(props){
       super(props)

       this.state={
           hasError:false
       }
   }

   static getDerivedStateFromError(error){
       return{
           hasError: true
       }
   }
    render() {
        if(this.state.hasError){
            return <img src="https://cdn.dribbble.com/users/1715186/screenshots/4014147/untitled-3.gif"/>
        }
        return this.props.children
    }
}
export default ErrorBoundary