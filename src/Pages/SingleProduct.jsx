import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const SingleProduct = () => {
    const [data,setData]= useState("")
    const {id} = useParams()
    useEffect(()=>{
        axios.get(`https://bossdentindia.com/wp-json/wp/v2/product?per_page${id}`)
        .then((res)=>{
            setData(res.data);
        })
        .catch((err)=>{
            console.log(err);
        })
    },[])
  return (
    <div>
        <img src={data.image} alt=""/>
        <h2>Name:{data.title.rendered}</h2>
        <h3>Price:{data.price}</h3>
        <h4>Category:{data.category}</h4>
        <h6>Description:{data.description}</h6>
        <button>Where to Buy</button>
    </div>
  )
}

export default SingleProduct