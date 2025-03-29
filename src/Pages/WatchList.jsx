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
  const { watchlist, removeFromWatchlist, addToCartList, addToWatchlist } =
    useWatchlist();
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  // const [stockStatuses, setStockStatuses] = useState({});
  const [imageLoading, setImageLoading] = useState({});
  const [getUserData] = useState(JSON.parse(localStorage.getItem("UserData")));
  const [getCartData] = useState(JSON.parse(localStorage.getItem("cart")));
  const [WatchListData, setWatchListData] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [productToRemove, setProductToRemove] = useState(null);
  const [salePrice, setSalePrice] = useState(null);
  const [regularPrice, setRegularPrice] = useState(null);
  const [minValue, setMinvalue] = useState([]);
  const [maxValue, setMaxvalue] = useState([]);

  // Function to fetch product and stock status data
  const fetchWatchlistData = async () => {
    setLoading(true);
    // setError(null);
    await axios
      .get(
        `https://admin.bossdentindia.com/wp-json/custom/v1/wishlist?user_id=${getUserData.user_id}`
      )
      .then((response) => {
        // console.log("watchlist", response.data);
        setWatchListData(response.data);
        // setStockStatuses(response.data)
        // fetchStockStatuses(response);

        if (response.data && response.data.length > 0) {
          console.log("response-variations", response.data);
          // Extract sale prices, convert them to numbers, and filter valid values
          const salePrices = response.data.map((item) => {
            console.log("variations", item);
            return item.product_variations.map((variation) => {
              console.log(
                "variation price",
                variation,
                Math.min(variation.price)
              );
              return Math.min(variation.price);
            });
          });
          const minMaxByProductId = response.data.reduce((acc, item) => {
            const prices = item.product_variations.map(
              (variation) => variation.price
            );
            acc[item.product_id] = [Math.min(...prices), Math.max(...prices)];
            return acc;
          }, {});
          setSalePrice(minMaxByProductId);
          Object.entries(minMaxByProductId).map(([productId, [min, max]]) => {
            maxValue.push(max);
            minValue.push(min);
            // setMinvalue([...minValue,min]);
            // setMaxvalue([...maxValue,max]);
          });
          console.log("sale", salePrices, "minValyue", minMaxByProductId);
        }

        setLoading(false);
        response.data.map((item) => {
          return addToWatchlist(Number(item.product_id));
        });
      })
      .catch((err) => {
        setLoading(false);
        console.log("error", err);
      });
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
        setLoading(false);
      }
      fetchWatchlistData();
    } else {
      setWatchListData([]);
      setLoading(false);
    }
  }, []);

  const confirmDelete = (e, product) => {
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
        removeFromWatchlist();
        localStorage.setItem("watchlist_length", response.data.wishlist_length);
        setWatchListData(deleteProduct);
      })
      .catch((error) => console.log("error", error));
  };

  // Handle adding product to cart based on stock status
  const handleAddToCart = async (product, selectedAttributes) => {
    // const stockStatus = stockStatuses[product.product_id];
    if (product.stock_status === "instock") {
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
                product_weight: product.product_weight,
                product_price: product.product_price,
                selected_attribute: selectedAttributes,
                stock_status: product.stock_status,
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
            })
            .catch((err) => {
              console.error("watchlist-error", err);
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
                selected_attribute: selectedAttributes,
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
                        stockStatus={product.stock_status}
                        handleAddToCart={handleAddToCart}
                        handleRemove={(e) => confirmDelete(e, product)}
                        handleImageLoad={handleImageLoad}
                        imageLoading={imageLoading[product.product_id]}
                        selectedAttributes={selectedAttributes}
                        getUserData={getUserData}
                        salePrice={salePrice}
                        regularPrice={regularPrice}
                        setMinvalue={setMinvalue}
                        setMaxvalue={setMaxvalue}
                        minValue={minValue}
                        maxValue={maxValue}
                        setWatchListData={setWatchListData}
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
    salePrice,
    minValue,
    maxValue,
    setWatchListData,
    setMaxvalue,
    setMinvalue,
  }) => {
    const [selectedAttributes, setSelectedAttributes] = useState(() => {
      const storedAttributes = product.selected_attribute;
      return storedAttributes ? product.selected_attribute : {};
    });
    const [productVariations] = useState(() => {
      const storedProdcutvariation = product.product_variations;
      return storedProdcutvariation ? product.product_variations : {};
    });
    // console.log("productdata", product);
    // Function to handle attribute selection
    const handleAttributeSelect = async (
      attribute,
      attributes1,
      value,
      keys,
      minValue,
      maxValue
    ) => {
      console.log(
        "attribute--",
        attribute,
        "attribute1",
        attributes1,
        "value--",
        value,
        "keys--",
        keys,
        "max--",
        maxValue,
        "min--",
        minValue
      );
      if (attribute && value) {
        const updatedAttributes = {
          ...selectedAttributes,
          [attribute]: value,
        };
        setSelectedAttributes(updatedAttributes);
        // const selectedVariation = variations.find((variation) => {
        //   // console.log("va", Object.keys(variation.attributes));
        //   return Object.keys(variation.attributes).every((key) => {
        //     // console.log("select", newSelectedAttributes[key], variation.attributes[key]);
        //     return updatedAttributes[key] === variation.attributes[key];
        //   });
        // });
        // setWatchListData({...product,"price":selectedVariation.price})
        // if (selectedVariation) {
        //   setMinvalue(selectedVariation.price);
        //   setMaxvalue([]);

        // } else {
        //   setMinvalue(minValue);
        //   setMaxvalue(maxValue);
        // }
      } else {
        setSelectedAttributes(value);
      }

      // await axios
      //   .post(
      //     `https://admin.bossdentindia.com/wp-json/custom/v1/wishlist/update`,
      //     {
      //       user_id: getUserData.user_id,
      //       product_id: product.product_id,
      //       selected_attribute: updatedAttributes,
      //     }
      //   )
      //   .then((response) => {
      //     // console.log("update-wishlist-response", response.data);
      //   })
      //   .catch((error) => console.log("update-error", error));
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
                  to={`/products/${product.product_slug}`}
                  className="watchlist-item-link"
                >
                  <h5 className="mb-0">{product?.product_title}</h5>
                </Link>
                <p className="watchlist-item-price mb-0">
                  {/* {console.log("product",salePrice,regularPrice)} */}
                  {console.log(
                    "salePrice",
                    salePrice,
                    // minValue,
                    // maxValue,
                    Object.entries(salePrice)
                  )}

                  {/* {
                    product.product_variations.length > 0 ? 
                    <>
                      <span className="sale-price">
                        price :  ₹{minValue}
                        {
                          selectedAttributes === undefined ? <>-₹{maxValue}</> : <></>
                        }
                      </span>
                    </>
                    :<></>
                  } */}
                  {salePrice !== null
                    ? Object.entries(salePrice).map(
                        ([productId, [min, max]]) => {
                          // console.log("pro", productId, product.product_id);
                          return productId === product.product_id ? (
                            <span className="sale-price" key={productId}>
                              Price: ₹{min}
                              {selectedAttributes !== undefined ? (
                                <>- ₹{max}</>
                              ) : (
                                <></>
                              )}
                            </span>
                          ) : ( 
                            <></>
                            // `Price: ₹${product.product_price}`
                          );
                        }
                      )
                    : `Price: ₹${product.product_price}`}
                  {/* {product.product_variations.length > 0 ? "": (
                    <>
                      {salePrice && regularPrice ? (
                        <>
                          {salePrice !== regularPrice ? (
                            <>
                              <span className="regular-price">
                                ₹{regularPrice}
                              </span>
                              <span className="sale-price">₹{salePrice}</span>
                            </>
                          ) : (
                            <span className="sale-price">₹{salePrice}</span>
                          )}
                        </>
                      ) : (
                        `Price: ₹${product.product_price}`
                      )}
                    </>
                  )} */}
                  {/* {product.product_price} */}
                  {/* price: {product.regularprice} */}
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
                            {/* {console.log("min", minValue, "max", maxValue)} */}
                            {attribute === "attribute_pa_color" ||
                            attribute === "color" ? (
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
                                          variation.attributes[attribute],
                                          Object.values(
                                            variation.attributes
                                          )[0],
                                          // Object.keys(variation.attributes)[0],
                                          // minValue,
                                          // maxValue
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
                                          variation.attributes[attribute],
                                          Object.values(
                                            variation.attributes
                                          )[0],
                                          // Object.keys(variation.attributes)[0],
                                          // minValue,
                                          // maxValue
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
