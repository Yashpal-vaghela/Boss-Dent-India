import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://bossdentindia.com/wp-json/wp/v2/product"
        );
        console.log("Fetched products:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="shop-container">
      <div className="header">
        <h1 className="shop-title">Shop</h1>
        <nav>
          <a href="/">Home</a> &gt; <span>Shop</span>
        </nav>
      </div>
      <div className="shop-header">
        <span>
          Showing 1-{products.lenght} of {products.length} result
        </span>
        <select className="sorting-select">
          <option value="default">Default sorting</option>
        </select>
      </div>
      <div className="shop-content">
        <div className="shop-sidebar">
          <h3>Shop by Category</h3>
          <ul>
            <li>Accessories</li>
            <li>General dentist</li>
            <li>LAB Material</li>
            <li>Prosthodontist</li>
          </ul>
        </div>
        <div className="products-grid">
          {products.map((product) => {
            // Extract the image URL from the og_image property
            const imageUrl = product.yoast_head_json?.og_image?.[0]?.url;

            return (
              <Link className="product-card-main" to={`./${product.id}`}>
                <div key={product.id} className="product-card">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={product.title.rendered}
                      className="product-image"
                    />
                  )}
                  <h3 className="product-title">{product.title.rendered}</h3>
                  {/* <div className='product-description' dangerouslySetInnerHTML={{ __html: product.content.rendered }}></div> */}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Product;
