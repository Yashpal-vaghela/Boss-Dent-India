import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWatchlist } from "./WatchlistContext";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import "../css/wishlistresponsive.css";
import BreadCrumbs from "../component/BreadCrumbs";
import { toast } from "react-toastify";
import Loader1 from "../component/Loader1";
import ConfirmationDialog from "../component/ConfirmationDialog";

const WatchList = () => {
  const { watchlist, removeFromWatchlist, addToCartList,addToWatchlist } = useWatchlist();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stockStatuses, setStockStatuses] = useState({});
  const [imageLoading, setImageLoading] = useState({});
  const [getUserData] = useState(JSON.parse(localStorage.getItem("UserData")));
  const [getCartData] = useState(JSON.parse(localStorage.getItem("cart")));
  const [WatchListData, setWatchListData] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [productToRemove, setProductToRemove] = useState(null);

  // Function to fetch product and stock status data
  const fetchWatchlistData = async () => {
    setLoading(true);
    setError(null);
    await axios
      .get(
        `https://admin.bossdentindia.com/wp-json/custom/v1/wishlist?user_id=${getUserData.user_id}`
      )
      .then((response) => {
        // console.log("watchlist", response.data,Object.keys(response.data));
        setWatchListData(response.data);
        fetchStockStatuses(response);
        setLoading(false);
        response.data.map((item)=>{
          addToWatchlist(Number(item.product_id))
        })
      })
      .catch((err) => {
        setLoading(false);
        console.log("error", err);
      });
  };
  // fetch stock status data
  const fetchStockStatuses = async (response) => {
    // Batch request for stock statuses
    const stockStatusPromises = response.data.map(async (product) => {
      try {
        const stockResponse = await axios.get(
          `https://admin.bossdentindia.com/wp-json/custom/v1/stock-status/${product.product_id}`
        );
        return { [product.product_id]: stockResponse.data.stock_status };
      } catch (error) {
        console.error("Error fetching stock status:", error);
        return { [product.product_id]: "unknown" };
      }
    });
    
    // Combine stock statuses into a single object
    const stockStatusesResults = await Promise.all(stockStatusPromises);
    const combinedStockStatuses = Object.assign({}, ...stockStatusesResults);
    setStockStatuses(combinedStockStatuses);
    localStorage.setItem(
      "stockStatuses",
      JSON.stringify(combinedStockStatuses)
    );
  };

  useEffect(() => {
    const cachedWishListProdcts = JSON.parse(
      localStorage.getItem("wishListProducts")
    );
    const cachedStockStatuses = JSON.parse(
      localStorage.getItem("stockStatuses")
    );
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    if (watchlist.length > 0) {
      if (
        cachedWishListProdcts &&
        cachedStockStatuses &&
        cachedWishListProdcts.length === watchlist.length
      ) {
        setStockStatuses(cachedStockStatuses);
        setLoading(false);
      }
      fetchWatchlistData();
    } else {
      setWatchListData([]);
      setLoading(false);
    }
  }, []);

  const confirmDelete = (e, product) => {
    // console.log("confirmDelete", e, product);
    setProductToRemove(product);
    setShowDialog(true);
  };
  const handleConfirmRemove = () => {
    // console.log("productConfirmRemove", productToRemove, WatchListData);
    handleRemove(productToRemove);
    setShowDialog(false);
  };
  const handleCancel = () => {
    setShowDialog(false);
  };

  // Handle removing item from watchlistf
  const handleRemove = async (product) => {
    removeFromWatchlist(product.product_id);
    await axios
     await axios
      .delete(
        `https://admin.bossdentindia.com/wp-json/custom/v1/wishlist/delete`,
        {
          data: {
            user_id: getUserData.user_id,
            product_id: product.product_id,
          },
        }
      )
      .then((response) => {
        const deleteProduct = WatchListData.filter(
          (item) => item.product_id !== product.product_id
        );
        removeFromWatchlist()
        localStorage.setItem("watchlist_length", response.data.wishlist_length);
        setWatchListData(deleteProduct);
      })
      .catch((error) => console.log("error", error));
  };

  // Handle adding product to cart based on stock status
  const handleAddToCart = async (product, selectedAttributes) => {
    const stockStatus = stockStatuses[product.product_id];
    if (stockStatus === "instock") {
      try {
        const weightResponse = await axios.get(
          `https://admin.bossdentindia.com/wp-json/custom/v1/product-weight/${product.product_id}`
        );
        const productWeight = weightResponse.data.weight || 0;
        if (getUserData) {
          const filterCartData = getCartData.cart_items.filter((item) => {
            return item.product_id === product.product_id;
          });
          if (filterCartData.length === 0) {
            await axios
              .post(
                `https://admin.bossdentindia.com/wp-json/custom/v1/add-to-cart`,
                {
                  user_id: getUserData.user_id,
                  product_id: product.product_id,
                  product_quantity: 1,
                  product_title: product.product_title,
                  product_image: product.product_image,
                  product_attributes: product.product_variations,
                  product_weight: productWeight,
                  product_price: product.product_price,
                  selected_attribute: selectedAttributes,
                }
              )
              .then((res) => {
                const filterData = WatchListData.filter(
                  (item) => item.product_id !== product.product_id
                );
                handleRemove(product);
                setWatchListData(filterData);
                addToCartList(product.product_id, {});
                toast.success("Product added to cart!");
                localStorage.setItem("cart_length", res.data.cart_length);
              })
              .catch((err) => {
                console.log("watchlist-error", err);
              });
          } else {
            const updateQty =
              Number(product.product_quantity) +
              Number(filterCartData[0].product_quantity);
            await axios
              .post(
                `https://admin.bossdentindia.com/wp-json/custom/v1/cart/update`,
                {
                  user_id: getUserData.user_id,
                  product_id: product.product_id,
                  product_quantity: updateQty,
                  selected_attribute:selectedAttributes
                }
              )
              .then((res) => {
                const filterData = WatchListData.filter(
                  (item) => item.product_id !== product.product_id
                );
                handleRemove(product);
                setWatchListData(filterData);
                toast.success("Product updated to cart!");
              })
              .catch((err) => console.log("err", err));
          }
        }
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
        <div className="container">
          {showDialog && (
            <ConfirmationDialog
              onConfirm={handleConfirmRemove}
              onCancel={handleCancel}
              title={productToRemove?.product_title}
            ></ConfirmationDialog>
          )}
          <div className="watchlist-page">
            <div className="header" data-aos="fade-up">
              <h1>Wishlist</h1>
              <BreadCrumbs />
            </div>
            {WatchListData.length === 0 ? (
              <div className="cart-page-empty">
                <p>No products in your watchlist</p>
                <button className="btn btn-dark">
                  <Link to="/products">Add Now</Link>
                </button>
              </div>
            ) : (
              <div className="watchlist-content">
                <div className="watchlist-items" data-aos="fade">
                  {WatchListData?.map((product) => {
                    const watchlistItem = watchlist.find(
                      (item) => item.product_id === product.product_id
                    );
                    const selectedAttributes =
                      watchlistItem?.selected_attribute || {};

                    return (
                      <WatchlistItem
                        key={product.id}
                        product={product}
                        stockStatus={stockStatuses[product.product_id]}
                        handleAddToCart={handleAddToCart}
                        handleRemove={(e) => confirmDelete(e, product)}
                        handleImageLoad={handleImageLoad}
                        imageLoading={imageLoading[product.product_id]}
                        selectedAttributes={selectedAttributes}
                        getUserData={getUserData}
                      ></WatchlistItem>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// Memoized Watchlist Item to prevent unnecessary re-renders
const WatchlistItem = React.memo(
  ({
    product,
    stockStatus,
    handleAddToCart,
    handleRemove,
    handleImageLoad,
    imageLoading,
    getUserData,
  }) => {
    const [selectedAttributes, setSelectedAttributes] = useState(() => {
      const storedAttributes = product.selected_attribute;
      return storedAttributes ? product.selected_attribute : {};
    });
    const [productVariations] = useState(() => {
      const storedProdcutvariation = product.product_variations;
      return storedProdcutvariation ? product.product_variations : {};
    });

    // Function to handle attribute selection
    const handleAttributeSelect = async (attribute, value) => {
      const updatedAttributes = {
        ...selectedAttributes,
        [attribute]: value,
      };
      setSelectedAttributes(updatedAttributes);
      await axios
       await axios
        .post(
          `https://admin.bossdentindia.com/wp-json/custom/v1/wishlist/update`,
          {
            user_id: getUserData.user_id,
            product_id: product.product_id,
            selected_attribute: updatedAttributes,
          }
        )
        .then((response) => {
          console.log("update-wishlist-response", response.data);
        })
        .catch((error) => console.log("update-error", error));
    };

    return (
      <>
        <div className="watchlist-item">
          <div className="watchlist-item-image-wrapper">
            <img
              src={product.product_image}
              alt={product.product_title}
              className={`watchlist-item-image ${
                imageLoading ? "loaded" : "loading"
              }`}
              loading="lazy"
              onLoad={() => handleImageLoad(product.product_id)}
            />
          </div>
          <div className="watchlist-item-details">
            <div className="d-lg-block d-md-block">
              <div className="watchlist-item-info">
                <Link
                  to={`/products/${product.product_id}`}
                  className="watchlist-item-link"
                >
                  <h5 className="mb-0">{product?.product_title}</h5>
                </Link>
                <p className="watchlist-item-price mb-0">
                  Price: ₹{product.product_price}
                </p>
              </div>
              {/* Render product variations */}
              {productVariations.length !== 0 &&
                productVariations[0].attributes !== undefined && (
                  <div className="wishlist-item-attributes">
                    {Object.keys(productVariations[0].attributes).map(
                      (attribute) => {
                        return (
                          <div key={attribute} className="variation-cart-main">
                            <h4>
                              {attribute.replace(
                                /attribute_pa_|attribute_/,
                                ""
                              )}
                              :{""}
                            </h4>
                            {attribute === "attribute_pa_color" ? (
                              <div style={{ display: "flex" }}>
                                {productVariations.map((variation, index) => {
                                  return (
                                    <div
                                      key={index}
                                      className={`color-option ${
                                        Object.values(variation?.attributes)[0]
                                      } ${
                                        selectedAttributes[attribute] ===
                                        variation.attributes[attribute]
                                          ? "selected"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        handleAttributeSelect(
                                          attribute,
                                          variation.attributes[attribute]
                                        )
                                      }
                                    ></div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="variation-buttons">
                                {productVariations.map((variation, index) => {
                                  return (
                                    <button
                                      key={index}
                                      className={`variation-button ${
                                        selectedAttributes[attribute] ===
                                        variation.attributes[attribute]
                                          ? "selected"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        handleAttributeSelect(
                                          attribute,
                                          variation.attributes[attribute]
                                        )
                                      }
                                    >
                                      {typeof variation.attributes[
                                        attribute
                                      ] === "string"
                                        ? variation.attributes[attribute]
                                        : JSON.stringify(
                                            variation.attributes[attribute]
                                          )}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
            </div>

            <div className="actions">
              <button
                className={`watchlist-add-to-cart ${
                  stockStatus !== "instock" ? "disable-button" : ""
                }`}
                disabled={stockStatus !== "instock"}
                onClick={() => handleAddToCart(product, selectedAttributes)}
              >
                Add to Cart
              </button>
              <button
                className="watchlist-item-remove"
                onClick={(e) => handleRemove(e, product)}
              >
                <MdDelete />
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
);

export default WatchList;
