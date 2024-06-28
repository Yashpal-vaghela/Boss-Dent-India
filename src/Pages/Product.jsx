// ProductPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests

const Product = ({ name, price, description, image }) => {
  return (
    <div className="product">
      <div className="product-image">
        <img src={image} alt={name} />
      </div>
      <div className="product-details">
        <h2 className="product-name">{name}</h2>
        <p className="product-price">{price}</p>
        <p className="product-description">{description}</p>
        <button className="add-to-cart-btn">Add to Cart</button>
      </div>
    </div>
  );
};

const ProductPage = () => {
  const [products, setProducts] = useState([]);

  
  useEffect(() => {
    // Function to fetch data from API
    const fetchProducts = async () => {
      try {
        const response = await axios.get('1');
        setProducts(response.data); // Assuming the API returns an array of products
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchProducts(); // Call the fetch function
  }, []); // Empty dependency array ensures this runs only once on component mount

  return (
    <div className="product-page">
      {products.map((product) => (
        <Product
          key={product.id}
          name={product.title}
          price={product.price}
          image={product.image}
        />
      ))}
    </div>
  );
};

export default ProductPage;
