import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Loader from '../component/Loader';
import { useCart } from './AddCartContext';
import { FaCartPlus } from "react-icons/fa";
import { useWatchlist } from './WatchlistContext';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import Aos from 'aos';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(9);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [minPrice, setMinPrice] = useState(40);
  const [maxPrice, setMaxPrice] = useState(12500);
  const [stockStatuses, setStockStatuses] = useState({});
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search') || "";
    setSearchQuery(query);
  }, [location.search]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, productsPerPage, selectedCategory, minPrice, maxPrice]);

  useEffect(() => {
    const userLoggedIn = localStorage.getItem('token') ? true : false;
    setIsLoggedIn(userLoggedIn);
  }, []);
  useEffect(() => {
    Aos.init({
      duration: 1000, // Animation duration in milliseconds
      once: false,    // Allow animations to trigger multiple times
      mirror: true,   // Trigger animations on scroll up
    });
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let apiUrl = `https://bossdentindia.com/wp-json/wp/v2/product?per_page=100`; 

      if (selectedCategory) {
        apiUrl += `&product_cat=${selectedCategory}`;
      }

      const response = await axios.get(apiUrl);
      // console.log('Full Product Response:', response.data);
      const filteredProducts = response.data.filter(
        product => parseFloat(product.price) >= minPrice && parseFloat(product.price) <= maxPrice
      );
      
      setTotalProducts(filteredProducts.length);
      const startIndex = (currentPage - 1) * productsPerPage;
      const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);
      const stockStatusPromises = paginatedProducts.map(async (product) =>{
        try{
          const stockResponse = await axios.get(
            `https://bossdentindia.com/wp-json/custom/v1/stock-status/${product.id}`
          );
          return{ [product.id]: stockResponse.data.stock_status};
        } catch(error){
          console.error('Error fetching stock status:', error);
          return {[product.id]: 'unknown'};
        }
      });

      const stockStatusesResults = await Promise.all(stockStatusPromises);
      const combinedStockStatuses = Object.assign({}, ...stockStatusesResults);
      setStockStatuses(combinedStockStatuses);

      setProducts(paginatedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };
  // console.log(response.data);
  
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // const handlePriceRangeChange = () => {
  //   setCurrentPage(1);
  //   fetchProducts();
  // };

  const handleAddToCart = (product) => {
    const stockStatus = stockStatuses[product.id];
    if (stockStatus === 'instock'){
      if (isLoggedIn) {
        const quantity = 1;
        addToCart({ ...product, quantity});
        alert("Product added to cart!");
      } else {
        window.alert('Please log In! Thank you.');
        navigate("/my-account");
      }
    } else {
      alert('This product is out of stock and cannot be added to the cart.');
    }
  };

  const handleAddToWatchlist = (product) => {
    if (isLoggedIn) {
      if (watchlist.includes(product.id)) {
        removeFromWatchlist(product.id);
      } else {
        addToWatchlist(product.id);
      }
    } else {
      window.alert('Please log in! Thank you.');
      navigate("/my-account");
    }
  };
  const handleImageLoad = (event) => {
    event.target.classList.add('loaded');
  };
  const paginationButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === currentPage ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      paginationButtons.push(
        <button
          key={i}
          className={`paginate_button page-item ${currentPage === i ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      paginationButtons.push(
        <span key={i} className="ellipsis">...</span>
      );
    }
  }

  if (loading) {
    return <div><Loader /></div>;
  }

  return (
    <div className='shop-container'>
      <div className='header' data-aos="fade-up">
        <h1 className='shop-title'>Shop</h1>
        <nav>
          <a href='/'>Home</a> &gt; <span>Shop</span>
        </nav>
      </div>
      <div className='shop-header'></div>
      <div className='shop-content'>
        <div className='shop-sidebar-menu' data-aos="fade">
          <div className='shop-sidebar'>
            <h3>Shop by Category</h3>
            <hr />
            <ul>
              <li onClick={() => handleCategoryClick(null)}>All</li>
              <li onClick={() => handleCategoryClick(46)}>Accessories</li>
              <li onClick={() => handleCategoryClick(75)}>General dentist</li>
              <li onClick={() => handleCategoryClick(76)}>LAB Material</li>
            </ul>
          </div>
          {/* <div className='price-range'>
            <h3>Price Range</h3>
            <input
              type='range'
              min="40"
              max="12500"
              value={minPrice}
              onChange={(e) => setMinPrice(parseInt(e.target.value))}
              step="1"
            />
            <input
              type='range'
              min="41"
              max="12500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              step="1"
            />
            <button onClick={handlePriceRangeChange}>Apply</button>
            <div className='price-range-values'>
              <span>Min: {minPrice} Rs</span>
              <span>Max: {maxPrice} Rs</span>
            </div>
          </div> */}
        </div>
        <div className='products-grid' data-aos="fade">
          {products.map(product => {
            let imageUrl = null;
            if (product.better_featured_image) {
              imageUrl = product.better_featured_image.source_url;
            } else if (product.yoast_head_json && product.yoast_head_json.og_image && product.yoast_head_json.og_image.length > 0) {
              imageUrl = product.yoast_head_json.og_image[0].url;
            }

            return (
              <div className='product-card' key={product.id}>
                <div className='product-card-link'>
                  <Link to={`/products/${product.id}`} className='product-link'>
                  {imageUrl && (
                      <img 
                        src={imageUrl} 
                        alt={product.title.rendered} 
                        className="product-image"
                        loading='lazy'
                        onLoad={handleImageLoad} 
                      />
                    )}
                    <h3 className='product-title'>{product.title.rendered}</h3>
                  </Link>
                </div>
                <h3 className='product-price'>Price: {product.price} ₹</h3>
                <Link to={`/products/${product.id}`} className='product-button-main'>
                  <button className='product-button'>Learn more</button>
                </Link>
                <button
                  className={`add-to-cart-button ${stockStatuses[product.id] !== 'instock' ? 'disable-button': ''}`}
                  disabled={stockStatuses[product.id] !== 'instock'}
                  onClick={() => handleAddToCart(product)}
                >
                  <FaCartPlus />
                </button>
                <span className={`watchlist-icon ${!watchlist.includes(product.id) ? "" : "inactive-heart"}`} 
                  onClick={() => handleAddToWatchlist(product)}    
                >
                  {watchlist.includes(product.id) ? <FaHeart /> : <FaRegHeart />}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        <div className="pagination-list">
          {paginationButtons}
        </div>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default Product;
