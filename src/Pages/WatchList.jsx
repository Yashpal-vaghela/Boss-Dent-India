import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWatchlist } from "./WatchlistContext";
import axios from "axios";
import Loader from "../component/Loader";
import { MdDelete } from "react-icons/md";
import { useCart } from "./AddCartContext";
import '../css/wishlistresponsive.css';

const WatchList = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const responses = await Promise.all(
          watchlist.map((id) =>
            axios.get(`https://bossdentindia.com/wp-json/wp/v2/product/${id}`)
          )
        );
        setProducts(responses.map((response) => response.data));
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch watchlist products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (watchlist.length > 0) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [watchlist]);

  const handleRemove = (id) => {
    removeFromWatchlist(id);
    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
  };

  const handleAddToCart = (product) => {
    addToCart && addToCart({ ...product, quantity: 1 });
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (products.length === 0) {
    return <div>No products in your watchlist.</div>;
  }

  return (
    <div className="watchlist-page">
      <div className="header">
        <h1 className="wishlist-title">Wishlist</h1>
        <nav>
          <a href="/">Home</a> &gt; <span>Wishlist</span>
        </nav>
      </div>
      <div className="watchlist-content">
        <div className="watchlist-items">
          {products.map((product) => (
            <div key={product.id} className="watchlist-item">
              <img
                src={product.yoast_head_json?.og_image?.[0]?.url}
                alt={product.title.rendered}
                className="watchlist-item-image"
              />
              <div className="watchlist-item-details">
                <div className="watchlist-item-info">
                  <Link to={`/products/${product.id}`} className="watchlist-item-link">
                    <h3>{product.title.rendered}</h3>
                  </Link>
                  <p className="watchlist-item-price">Price :- ₹{product.price}</p>
                </div>
                
                <div className="actions">
                  <button
                      className="watchlist-add-to-cart"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                  </button>
                  <button
                    className="watchlist-item-remove"
                    onClick={() => handleRemove(product.id)}
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WatchList;
