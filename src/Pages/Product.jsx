import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, Link } from 'react-router-dom';
import Loader from '../component/Loader';
import { useCart } from './AddCartContext';

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
  const location = useLocation();
  const { addToCart } = useCart();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search') || "";
    setSearchQuery(query);
  }, [location.search]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, productsPerPage, selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let apiUrl = `https://bossdentindia.com/wp-json/wp/v2/product?per_page=${productsPerPage}&page=${currentPage}`;

      // Append category filter to API URL if a category is selected
      if (selectedCategory) {
        apiUrl += `&product_cat=${selectedCategory}`;
      }
      // console.log("Fetching products from URL:", apiUrl);

      const response = await axios.get(apiUrl);
      // console.log("Products fetched:", response.data);
      setProducts(response.data);
      const total = parseInt(response.headers['x-wp-total']);
      setTotalProducts(total);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCategoryClick = (category) => {
    // console.log("selected Category:", category);
    setSelectedCategory(category);
    setCurrentPage(1);
  }
  const handlePriceRangeChange = () => {
    fetchProducts();
  };

  const handleAddToCart = (product) => {
    addToCart && addToCart({ ...product, quantity: 1 }); // Assuming quantity is 1 by default
    alert("Product added to cart!");
  };
  const filteredProducts = products.filter(
    product =>
      product.title.rendered.toLowerCase().includes(searchQuery.toLowerCase()) &&
      parseFloat(product.price) >= minPrice &&
      parseFloat(product.price) <= maxPrice
  );

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
    return <div>
      <Loader />
    </div>;
  }
  return (
    <div className='shop-container'>
      <div className='header'>
        <h1 className='shop-title'>Shop</h1>
        <nav>
          <a href='/'>Home</a> &gt; <span>Shop</span>
        </nav>
      </div>
      <div className='shop-header'>
        {/* <div className="rows-per-page">
          <span style={{margin:"0 20px",fontWeight:"600"}}>Rows per page :</span>
          <input
            type="number"
            style={{width:"100px"}}
            min="1"
            value={productsPerPage}
            onChange={(e) => setProductsPerPage(e.target.value)}
          />
        </div> */}
      </div>
      <div className='shop-content'>
        <div className='shop-sidebar-menu'>
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
          <div className='price-range'>
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
          </div>
        </div>
        <div className='products-grid'>
          {filteredProducts.map(product => {
            const imageUrl = product.yoast_head_json?.og_image?.[0]?.url;
            return (
              <div className='product-card'>
                <Link key={product.id} to={`/products/${product.id}`} >
                  {imageUrl && <img src={imageUrl} alt={product.title.rendered} className="product-image" />}
                  <h3 className='product-title'>{product.title.rendered}</h3>
                  <h3 className='product-price'>Price: {product.price}</h3>
                  {/* <div className='product-description' dangerouslySetInnerHTML={{ __html: product.content.rendered }}></div> */}
                  <Link to={`/products/${product.id}`} className='product-button-main'>
                    <button className='product-button'>Learn more</button>
                  </Link>
                </Link>
                <button
                  className="add-to-cart-button"
                  onClick={() => handleAddToCart(product)}
                >
                  ADD TO CART
                </button>
              </div>

            );
          })}
        </div>
      </div>
      <div className="pagination">
        {/* <span>Showing {filteredProducts.length} of {totalProducts} results</span> */}
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
