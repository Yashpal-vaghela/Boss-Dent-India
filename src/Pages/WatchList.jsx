import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWatchlist } from "./WatchlistContext";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import "../css/wishlistresponsive.css";
import { useDispatch } from "react-redux";
import { Add } from "../redux/Apislice/cartslice";
import BreadCrumbs from "../component/BreadCrumbs";
import { toast } from "react-toastify";
import Loader1 from "../component/Loader1";

const WatchList = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stockStatuses, setStockStatuses] = useState({});
  const [imageLoading, setImageLoading] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    // const cachedProducts = localStorage.getItem("watchlistProducts");
    // const cachedStockStatuses = localStorage.getItem("stockStatuses");

    // if (cachedProducts && cachedStockStatuses) {
    //   setProducts(JSON.parse(cachedProducts));
    //   setStockStatuses(JSON.parse(cachedStockStatuses));
    //   setLoading(false);
    // } else if (watchlist.length > 0) {
    fetchProducts();
    // }
  }, [watchlist]);

  // Function to fetch product and stock status data
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      // Batch request for products
      const productResponses = await Promise.all(
        watchlist.map((id) =>
          axios.get(
            `https://admin.bossdentindia.com/wp-json/wp/v2/product/${id}`
          )
        )
      );
      const productsData = productResponses.map((response) => response.data);
      setProducts(productsData);
      localStorage.setItem("watchlistProducts", JSON.stringify(productsData));

      // Batch request for stock statuses
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

      // Combine stock statuses into a single object
      const stockStatusesResults = await Promise.all(stockStatusPromises);
      const combinedStockStatuses = Object.assign({}, ...stockStatusesResults);
      setStockStatuses(combinedStockStatuses);
      localStorage.setItem("stockStatuses", JSON.stringify(combinedStockStatuses));
    } catch (error) {
      setError("Failed to fetch watchlist products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle removing item from watchlist
  const handleRemove = (id) => {
    removeFromWatchlist(id);
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
    );
    localStorage.setItem(
      "watchlistProducts",
      JSON.stringify(products.filter((product) => product.id !== id))
    );
  };

  // Handle adding product to cart based on stock status
  const handleAddToCart = async(product, selectedAttributes) => {

    const stockStatus = stockStatuses[product.id];  
    
    if (stockStatus === "instock") {
      try {
        const weightResponse = await axios.get(
          `https://admin.bossdentindia.com/wp-json/custom/v1/product-weight/${product.id}`
        );
        const productWeight = weightResponse.data.weight || 0;
        
        dispatch(Add({ ...product, quantity: 1, selectedAttributes, weight: productWeight }));
        removeFromWatchlist(product.id);
        toast.success("Product added to cart!");
      } catch (error) {
        console.error("Error fetching product weight:", error);
      toast.error("Failed to fetch product weight. Please try again.");
      }    
    } else {
      toast.info("This product is Out of stock.");
    }
  };

  // Handle image load event to update loading state for images
  const handleImageLoad = (productId) => {
    setImageLoading((prevState) => ({
      ...prevState,
      [productId]: true,
    }));
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      {loading ? (
        <Loader1 />
      ) : (
        <div className="watchlist-page">
          <div className="header" data-aos="fade-up">
            <h1>Wishlist</h1>
            <BreadCrumbs />
          </div>
          {products.length === 0 && watchlist.length === 0 ? (
            <div className="cart-page-empty">
              <p>No products in your watchlist</p>
              <button className="btn btn-dark">
                <Link to="/products">Add Now</Link>
              </button>
            </div>
          ) : (
            <div className="watchlist-content">
              <div className="watchlist-items" data-aos="fade">
                {products.map((product) => (
                  <WatchlistItem
                    key={product.id}
                    product={product}
                    stockStatus={stockStatuses[product.id]}
                    handleAddToCart={handleAddToCart}
                    handleRemove={handleRemove}
                    handleImageLoad={handleImageLoad}
                    imageLoading={imageLoading[product.id]}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

// Memoized Watchlist Item to prevent unnecessary re-renders
const WatchlistItem = React.memo(
  ({ product, stockStatus, handleAddToCart, handleRemove, handleImageLoad, imageLoading }) => {
    const [selectedAttributes, setSelectedAttributes] = useState({});

    // Function to handle attribute selection
    const handleAttributeSelect = (attribute, value) => {
      setSelectedAttributes((prev) => ({
        ...prev,
        [attribute]: value,
      }));
    };

    return (
      <div className="watchlist-item">
        <div className="watchlist-item-image-wrapper">
          <img
            src={product.yoast_head_json?.og_image?.[0]?.url}
            alt={product.title.rendered}
            className={`watchlist-item-image ${imageLoading ? "loaded" : "loading"}`}
            loading="lazy"
            onLoad={() => handleImageLoad(product.id)}
          />
        </div>
        <div className="watchlist-item-details">
          <div className="d-lg-block d-md-block">
            <div className="watchlist-item-info">
              <Link to={`/products/${product.id}`} className="watchlist-item-link">
                <h5 className="mb-0">{product.title.rendered}</h5>
              </Link>
              <p className="watchlist-item-price mb-0">Price: ₹{product.price}</p>
            </div>
            {/* Render product variations */}
            {product.variations && product.variations[0]?.attributes && (
              <div className="wishlist-item-attributes">
                {Object.keys(product.variations[0].attributes).map((attribute) => (
                  <div key={attribute} className="variation-cart-main">
                    <h4>{attribute.replace(/attribute_pa_|attribute_/, "")}: </h4>
                    {attribute === "attribute_pa_color" ? (
                      <div style={{ display: "flex" }}>
                        {product.variations.map((variation, index) => (
                          <div
                            key={index}
                            className={`color-option ${Object.values(variation?.attributes)[0]}
                            ${selectedAttributes[attribute] === variation.attributes[attribute] ? "selected" : ""}`}
                            onClick={() => handleAttributeSelect(attribute, variation.attributes[attribute])}
                          ></div>
                        ))}
                      </div>
                    ) : (
                      <div className="variation-buttons">
                        {product.variations.map((variation, index) => (
                          <button
                            key={index}
                            className={`variation-button ${selectedAttributes[attribute] === variation.attributes[attribute] ? "selected" : ""}`}
                            onClick={() => handleAttributeSelect(attribute, variation.attributes[attribute])}
                          >
                            {typeof variation.attributes[attribute] === "string"
                              ? variation.attributes[attribute]
                              : JSON.stringify(variation.attributes[attribute])}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>



          <div className="actions">
            <button
              className={`watchlist-add-to-cart ${stockStatus !== "instock" ? "disable-button" : ""}`}
              disabled={stockStatus !== "instock"}
              onClick={() => handleAddToCart(product, selectedAttributes)}
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
  }
);


export default WatchList;
