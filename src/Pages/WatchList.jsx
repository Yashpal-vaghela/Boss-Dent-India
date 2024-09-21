import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWatchlist } from "./WatchlistContext";
import axios from "axios";
import Loader from "../component/Loader";
import { MdDelete } from "react-icons/md";
// import { useCart } from "./AddCartContext";
import "../css/wishlistresponsive.css";
// import Aos from "aos";
import { useDispatch } from "react-redux";
import { Add } from "../redux/Apislice/cartslice";
import BreadCrumbs from "../component/BreadCrumbs";
import { toast } from "react-toastify";

const WatchList = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stockStatuses, setStockStatuses] = useState({});
  // const { addToCart } = useCart();
  const [imageLoading, setImageLoading] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const responses = await Promise.all(
          watchlist.map((id) =>
            axios.get(`https://admin.bossdentindia.com/wp-json/wp/v2/product/${id}`)
          )
        );
        const productsData = responses.map((response) => response.data);
        setProducts(productsData);

        const stockStatusPromises = productsData.map(async (product) => {
          try {
            const stockResponse = await axios.get(
              `https://admin.bossdentindia.com/wp-json/custom/v1/stock-status/${product.id}`
            );
            return { [product.id]: stockResponse.data.stock_status };
          } catch (error) {
            console.error("Error fetching stock status:", error);
            return { [product.id]: "unknown" };
          }
        });

        const stockStatusesResults = await Promise.all(stockStatusPromises);
        const combinedStockStatuses = Object.assign(
          {},
          ...stockStatusesResults
        );
        setStockStatuses(combinedStockStatuses);
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

  // useEffect(() => {
  //   Aos.init({
  //     duration: 1000, // Animation duration in milliseconds
  //     once: false, // Allow animations to trigger multiple times
  //     mirror: true, // Trigger animations on scroll up
  //   });
  // }, []);

  const handleRemove = (id) => {
    removeFromWatchlist(id);
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
    );
  };

  const handleAddToCart = (product) => {
    const stockStatus = stockStatuses[product.id];
    if (stockStatus === "instock") {
      dispatch(Add({ ...product, quantity: 1 }));
      // addToCart && addToCart({ ...product, quantity: 1 });
    } else {
      toast.info("This product is Out of stock.");
      // alert('This product is Out of stock.')
    }
  };

  const handleImageLoad = (productId) => {
    setImageLoading((prevState) => ({
      ...prevState,
      [productId]: true,
    }));
  };
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div className="watchlist-page">
      <div className="header" data-aos="fade-up">
        <h1>Wishlist</h1>
        <BreadCrumbs></BreadCrumbs>
      </div>
      {products.length === 0 ? (
        <div className="cart-page-empty">
          <p>No products in your watchlist</p>
          <button className="btn btn-dark">
            <Link to="/products">Add Now</Link>
          </button>
        </div>
      ) : (
        <>
          <div className="watchlist-content">
            <div className="watchlist-items" data-aos="fade">
              {products.map((product) => {
                // let  imageUrl= product.yoast_head_json?.og_image?.[0]?.url;
            return     (
                <div key={product.id} className="watchlist-item">
                  <div className="watchlist-item-image-wrapper">
                    <img
                      src={product.yoast_head_json?.og_image?.[0]?.url}
                      alt={product.title.rendered}
                      className={`watchlist-item-image ${
                        imageLoading[product.id] ? "loaded" : "loading"
                      }`}
                      loading="lazy"
                      onLoad={() => handleImageLoad(product.id)}
                    />
                  </div>
                  <div className="watchlist-item-details">
                    <div className="watchlist-item-info">
                      <Link
                        to={`/products/${product.id}`}
                        className="watchlist-item-link"
                      >
                        <h3>{product.title.rendered}</h3>
                      </Link>
                      <p className="watchlist-item-price">
                        Price :- ₹{product.price}
                      </p>
                    </div>

                    <div className="actions">
                      <button
                        className={`watchlist-add-to-cart ${
                          stockStatuses[product.id] !== "instock"
                            ? "disable-button"
                            : ""
                        }`}
                        disabled={stockStatuses[product.id] !== "instock"}
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
              )
})}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WatchList;
