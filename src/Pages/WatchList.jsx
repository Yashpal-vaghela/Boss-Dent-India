import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const [getUserData] = useState(JSON.parse(localStorage.getItem("UserData")));
  const [getCartData] = useState(JSON.parse(localStorage.getItem("cart")));
  // console.log("getCartData",getCartData)
  const [getWatchListData] = useState(
    JSON.parse(localStorage.getItem("wishlist"))
  );
  const [WatchListData, setWatchListData] = useState([]);

  // Function to fetch product and stock status data
  const fetchWatchlistData = async () => {
    setLoading(true);
    setError(null);
    const fetchwatchlist = await axios
      .get(
        `https://admin.bossdentindia.com/wp-json/custom/v1/wishlist?user_id=${getUserData.user_id}`
      )
      .then(async (response) => {
        setWatchListData(response.data);
        // localStorage.setItem("wishListProducts", JSON.stringify(response.data));
        // console.log("watchlist-get-Response", response.data);
        fetchStockStatuses(response);
        setLoading(false);
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
      // console.log("stock-api", product);
      try {
        const stockResponse = await axios.get(
          `https://admin.bossdentindia.com/wp-json/custom/v1/stock-status/${product.product_id}`
        );
        // console.log("stockResponse", stockResponse);
        return { [product.product_id]: stockResponse.data.stock_status };
      } catch (error) {
        console.error("Error fetching stock status:", error);
        return { [product.product_id]: "unknown" };
      }
    });

    // Combine stock statuses into a single object
    const stockStatusesResults = await Promise.all(stockStatusPromises);
    const combinedStockStatuses = Object.assign({}, ...stockStatusesResults);
    // console.log(
    //   "combineedStock",
    //   combinedStockStatuses,
    //   "stockStatuses",
    //   stockStatusesResults,
    //   "sto",
    //   stockStatusPromises
    // );
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
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (watchlist.length > 0) {
      if (
        cachedWishListProdcts &&
        cachedStockStatuses &&
        cachedWishListProdcts.length === watchlist.length
      ) {
        // console.log("stockStatuses", cachedStockStatuses);
        setStockStatuses(cachedStockStatuses);
        setLoading(false);
      }
      // else {
      //   console.log("fetch2")
      //   fetchWatchlistData();
      // }
      fetchWatchlistData();
    } else {
      setWatchListData([]);
      setLoading(false);
    }
  }, []);

  // Handle removing item from watchlist
  const handleRemove = async (product) => {
    console.log("id", product, getUserData.user_id);
    // removeFromWatchlist(product.product_id);
    const deleteData = await axios
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
        console.log("remove", response.data, "delete-product", deleteProduct);
        removeFromWatchlist(product.product_id);
        setWatchListData(deleteProduct);
        // setWatchListData((preProducts)=>preProducts.filter((product)=>product.product_id !== product.product_id));
      })
      .catch((error) => console.log("error", error));
    // setProducts((prevProducts) =>
    //   prevProducts.filter((product) => product.id !== product.product_id)
    // );
    // localStorage.removeItem(`selectedAttributes_${id}`);
    // localStorage.setItem(
    //   "watchlistProducts",
    //   JSON.stringify(products.filter((product) => product.id !== id))
    // );
  };

  // Handle adding product to cart based on stock status
  const handleAddToCart = async (product, selectedAttributes) => {
    // e.preventDefault();
    const stockStatus = stockStatuses[product.product_id];
    console.log(
      "product",
      product,
      selectedAttributes,
      stockStatuses,
      getCartData
    );
    if (stockStatus === "instock") {
      try {
        const weightResponse = await axios.get(
          `https://admin.bossdentindia.com/wp-json/custom/v1/product-weight/${product.product_id}`
        );
        const productWeight = weightResponse.data.weight || 0;
        if (getUserData) {
          const filterCartData = getCartData.cart_items.filter((item) => {
            // console.log("sds",item,product  ,weightResponse)
            return item.product_id === product.product_id;
          });
          console.log(
            "filterCartData",
            product,
            getCartData.cart_items,
            filterCartData,
            selectedAttributes
          );
          if (filterCartData.length == 0) {
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
                console.log("watchlist-add-to-cart", res.data, filterData);
                deleteWatchListProduct(product);
                setWatchListData(filterData);
                toast.success("Product added to cart!");
                localStorage.setItem("cart_length", res.data.cart_length);
              })
              .catch((err) => {
                console.log("watchlist-error", err);
              });
          } else {
            console.log("update",product,product.product_quantity,filterCartData[0].product_quantity);
            await axios
              .post(
                `https://admin.bossdentindia.com/wp-json/custom/v1/cart/update`,
                {
                  user_id: getUserData.user_id,
                  product_id: product.product_id,
                  product_quantity: (Number(product.product_quantity)+Number(filterCartData[0].product_quantity)),
                }
              )
              .then((res) => {
                const filterData = WatchListData.filter(
                  (item) => item.product_id !== product.product_id
                );
                console.log("watchlist-update-to-cart", res.data, filterData);
                deleteWatchListProduct(product);
                setWatchListData(filterData);
                toast.success("Product updated to cart!");
              })
              .catch((err) => console.log("err", err));
            // filterCartData.map(async (item) => {
            //   if (item.product_quantity >= 1) {
            //     const a = Number(item.product_quantity) + 1;
            //   }
            // });
          }
        }
        // dispatch(
        //   Add({
        //     ...product,
        //     quantity: 1,
        //     selectedAttributes,
        //     weight: productWeight,
        //   })
        // );
        // removeFromWatchlist(product.id);

        // navigate("/cart");
      } catch (error) {
        console.error("Error fetching product weight:", error);
        toast.error("Failed to fetch product weight. Please try again.");
      }
    } else {
      toast.info("This product is Out of stock.");
    }
  };

  const deleteWatchListProduct = async (product) => {
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
      .then((res) => {
        removeFromWatchlist(product.product_id);
        console.log("delete-watchlist-product", res.data)})
      .catch((error) => console.log("error", error));
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
                    // console.log(
                    //   "product",
                    //   product
                    //   // stockStatuses[product.product_id],
                    //   // "wishlist-display",
                    //   // WatchListData
                    // );
                    return (
                      <WatchlistItem
                        key={product.id}
                        product={product}
                        stockStatus={stockStatuses[product.product_id]}
                        handleAddToCart={handleAddToCart}
                        handleRemove={handleRemove}
                        handleImageLoad={handleImageLoad}
                        imageLoading={imageLoading[product.product_id]}
                        selectedAttributes={selectedAttributes}
                        getUserData={getUserData}
                      ></WatchlistItem>
                    );
                  })}
                  {/* {products.map((product) => {
                    const watchlistItem = watchlist.find(
                      (item) => item.id === product.id
                    );
                    const selectedAttributes =
                      watchlistItem?.selectedAttributes || {};
                    return (
                      <WatchlistItem
                        key={product.id}
                        product={product}
                        stockStatus={stockStatuses[product.id]}
                        handleAddToCart={handleAddToCart}
                        handleRemove={handleRemove}
                        handleImageLoad={handleImageLoad}
                        imageLoading={imageLoading[product.id]}
                        selectedAttributes={selectedAttributes}
                      />
                    );
                  })} */}
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
    const [productVariations, setProductVariations] = useState(() => {
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
      const updateData = await axios
        .post(
          `https://admin.bossdentindia.com/wp-json/custom/v1/wishlist/update`,
          {
            user_id: getUserData.user_id,
            product_id: product.product_id,
            selected_attribute: updatedAttributes,
          }
        )
        .then((response) => {
          // console.log("update-response", response);
          localStorage.setItem(
            `selectedAttributes_${product.id}`,
            JSON.stringify(updatedAttributes)
          );
        })
        .catch((error) => console.log("update-error", error));
      // Store the updated attributes in localStorage
    };
    // const Product_variations = JSON.parse(product.Product_variations);
    // console.log("pro",productVariations,selectedAttributes);
    return (
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
                  {/* {console.log(
                      "Object-attributes",
                      Object.keys(productVariations[0].attributes)
                    )} */}
                  {Object.keys(productVariations[0].attributes).map(
                    (attribute) => {
                      return (
                        <div key={attribute} className="variation-cart-main">
                          <h4>
                            {attribute.replace(/attribute_pa_|attribute_/, "")}:
                            {""}
                          </h4>
                          {attribute === "attribute_pa_color" ? (
                            <div style={{ display: "flex" }}>
                              {productVariations.map((variation, index) => {
                                // console.log(
                                //   "variation",
                                //   variation,
                                //   Object.values(variation?.attributes)[0],
                                //   selectedAttributes
                                // );
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
                                // console.log("vari-size", variation);
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
                                    {typeof variation.attributes[attribute] ===
                                    "string"
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
              onClick={() => handleRemove(product)}
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
