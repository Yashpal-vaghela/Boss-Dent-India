import React, { useEffect, useState } from "react";
import { useWatchlist } from "./WatchlistContext";
import axios from "axios";
import Loader from "../component/Loader";
import { MdDelete } from "react-icons/md";
import { useCart } from "./AddCartContext";

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
    <div className="watchlist-page-main">
      <div className="header">
        <h1 className="wishlist-title">Wishlist</h1>
        <nav>
          <a href="/">Home</a> &gt; <a href="/products">Wishlist</a> 
        </nav>
      </div>
      <table className="watchlist-table">
        <thead>
          <tr>
            <th>Remove</th>
            <th>Image</th>
            <th>Title</th>
            <th>Price</th>
            <th>Add to Cart</th>
          </tr>
        </thead>
        <tbody className="watchlist-product-main">
          {products.map((product) => (
            <tr key={product.id} className="watchlist-product">
              <td className="watchlist-remove" onClick={() => handleRemove(product.id)}> <i className="remove-icon"><MdDelete /></i> </td>
              <td className="watchlist-img">
                <img
                  src={product.yoast_head_json?.og_image?.[0]?.url}
                  alt={product.title?.rendered}
                />
              </td>
              <td className="watchlist-title">
               <h1 className="w-title"> {product.title?.rendered} </h1>
              </td>
              <td className="watchlist-price">
                {product.price}
              </td>
              <td className="watchlist-btn-main">
                <button className="w-btn"  onClick={() => handleAddToCart(product)}>Add to Cart</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WatchList;
