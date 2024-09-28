import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWatchlist } from "./WatchlistContext";
import axios from "axios";
import Loader from "../component/Loader";
import { MdDelete } from "react-icons/md";
import "../css/wishlistresponsive.css";
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
  const [imageLoading, setImageLoading] = useState({});
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Number of products to load per page

  useEffect(() => {
    // Check for cached products and stock statuses in localStorage
    const cachedProducts = localStorage.getItem("watchlistProducts");
    const cachedStockStatuses = localStorage.getItem("stockStatuses");

    if (cachedProducts && cachedStockStatuses) {
      setProducts(JSON.parse(cachedProducts));
      setStockStatuses(JSON.parse(cachedStockStatuses));
      setLoading(false);
    } else if (watchlist.length > 0) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [watchlist]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch products for the current page
      const idsForPage = watchlist.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      );
      const responses = await Promise.all(
        idsForPage.map((id) =>
          axios.get(
            `https://admin.bossdentindia.com/wp-json/wp/v2/product/${id}`
          )
        )
      );
      const productsData = responses.map((response) => response.data);
      setProducts((prevProducts) => [...prevProducts, ...productsData]);
      localStorage.setItem(
        "watchlistProducts",
        JSON.stringify([...products, ...productsData])
      );

      // Fetch stock statuses for the current products
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
      const combinedStockStatuses = Object.assign({}, ...stockStatusesResults);
      setStockStatuses((prevStatuses) => ({
        ...prevStatuses,
        ...combinedStockStatuses,
      }));
      localStorage.setItem(
        "stockStatuses",
        JSON.stringify({
          ...stockStatuses,
          ...combinedStockStatuses,
        })
      );
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch watchlist products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (id) => {
    removeFromWatchlist(id);
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
    );
    // Update localStorage after removal
    localStorage.setItem(
      "watchlistProducts",
      JSON.stringify(products.filter((product) => product.id !== id))
    );
  };

  const handleAddToCart = (product) => {
    const stockStatus = stockStatuses[product.id];
    if (stockStatus === "instock") {
      dispatch(Add({ ...product, quantity: 1 }));
    } else {
      toast.info("This product is Out of stock.");
    }
  };

  const handleImageLoad = (productId) => {
    setImageLoading((prevState) => ({
      ...prevState,
      [productId]: true,
    }));
  };

  const loadMoreProducts = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    fetchProducts();
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
        <BreadCrumbs />
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
                return (
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
                );
              })}
            </div>
            {/* load more */}
            {watchlist.length > products.length && (
              <div className="load-more">
                <button onClick={loadMoreProducts}>Load More</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default WatchList;
