import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { OutlinedInput } from '@mui/material';
// import '../css/product.css'; // Make sure to import your CSS file

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(9);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://bossdentindia.com/wp-json/wp/v2/product?per_page=${productsPerPage}&page=${currentPage}`);
        setProducts(response.data);
        const total = parseInt(response.headers['x-wp-total']);
        setTotalProducts(total);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage, productsPerPage]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredProducts = products.filter(
    product =>
      product.title.rendered.toLowerCase().includes(searchQuery.toLowerCase())
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
        <div className='shop-sidebar'>
          <h3>Shop by Category</h3>
          <ul>
            <li>Accessories</li>
            <li>General dentist</li>
            <li>LAB Material</li>
            <li>Prosthodontist</li>
          </ul>
        </div>
        <div className='products-grid'>
          {filteredProducts.map(product => {
            const imageUrl = product.yoast_head_json?.og_image?.[0]?.url;
            return (
              <div key={product.id} className='product-card'>
                {imageUrl && <img src={imageUrl} alt={product.title.rendered} className="product-image" />}
                <h3 className='product-title'>{product.title.rendered}</h3>
                {/* <div className='product-description' dangerouslySetInnerHTML={{ __html: product.content.rendered }}></div> */}
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
