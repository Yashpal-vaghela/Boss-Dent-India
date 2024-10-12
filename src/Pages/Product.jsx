import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { FaCartPlus } from "react-icons/fa";
import { useWatchlist } from "./WatchlistContext";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { BsFillGridFill } from "react-icons/bs";
import AlertSuccess from "../component/AlertSuccess";
import { useDispatch } from "react-redux";
import { Add } from "../redux/Apislice/cartslice";
import BreadCrumbs from "../component/BreadCrumbs";
import Loader1 from "../component/Loader1";
import Category from "../component/Category";
import Loader from "../component/Loader";
import ProductPagination from "../component/ProductPagination";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [stockStatuses, setStockStatuses] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const { watchlist, addToWatchlist, removeFromWatchlist,addToCartList } = useWatchlist();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [getUserData] = useState(JSON.parse(localStorage.getItem("UserData")));
  const [getWatchListData] = useState(
    JSON.parse(localStorage.getItem("watchlist"))
  );
  const [qty, setQty] = useState(1);
  const [wishList, setWishList] = useState([]);
  const [getWishlist] = useState(JSON.parse(localStorage.getItem("watchlist")));
  const [getCartList] = useState(
    JSON.parse(localStorage.getItem("cart_productId"))
  );
  const [cartProductId, setCartProductId] = useState([]);

  const fetchProducts = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        let apiUrl = `https://admin.bossdentindia.com/wp-json/wp/v2/product?per_page=${itemsPerPage}&page=${page}`;
        // const perPage = 100;
        if (category) {
          apiUrl += `&product_cat=${category}`;
        }
        const response = await axios.get(apiUrl);
        const newProducts = response.data;
        setTotalProducts(parseInt(response.headers["x-wp-total"], 10));
        setProducts(newProducts);
        const stockResponse = await axios.get(
          "https://admin.bossdentindia.com/wp-json/custom/v1/stock-status/all"
        );

        const allStockStatuses = stockResponse.data; // Adjust this based on your API response format

        const stockStatusesResults = allStockStatuses.map((product, index) => {
          return {
            [product.product_id]:
              allStockStatuses[index].stock_status || "unknown", // Default to "unknown" if not found
          };
        });
        const combinedStockStatuses = Object.assign(
          {},
          ...stockStatusesResults
        );
        // console.warn("combined",combinedStockStatuses)
        setStockStatuses(combinedStockStatuses);
        // setProducts(paginatedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
      // console.log("Fetching products for category:", category);
    },
    [category, itemsPerPage]
  );
  useEffect(() => {
    const userLoggedIn = !!localStorage.getItem("token");
    setIsLoggedIn(userLoggedIn);
    // setQty(1);
    // wishlist product Id
    // console.log("getWishlist",getWishlist)
    if (getWishlist) {
      setWishList(getWishlist);
    }
    // cart product Id
    // console.log("getCartList",getCartList)
    if (getCartList) {
      setCartProductId(getCartList);
    }
  }, []);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [fetchProducts, currentPage]);

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCategoryClick = (newCategory) => {
    if (newCategory === null) {
      navigate("/products");
    } else if (newCategory !== category) {
      setCurrentPage(1);
      navigate(`?category=${newCategory}`);
    }
  };

  const handleAddToCart = async (e, product) => {
    console.log("product", product, product.variations);
    e.preventDefault();
    const stockStatus = stockStatuses[product.id];
    if (stockStatus === "instock") {
      if (isLoggedIn) {
        try {
          const weightResponse = await axios.get(
            `https://admin.bossdentindia.com/wp-json/custom/v1/product-weight/${product.id}`
          );
          const productWeight = weightResponse.data.weight;
          const userData = JSON.parse(localStorage.getItem("UserData"));
          if (userData) {
            const filterCartData = cartProductId.filter((item) => {
              // console.log("product-=================",Number(item.product_id),item,product);
              return item === product.id;
            });
            // console.log("filterData", filterCartData, cartProductId);

            if (filterCartData.length === 0) {
              await axios
                .post(
                  `https://admin.bossdentindia.com/wp-json/custom/v1/add-to-cart`,
                  {
                    user_id: userData.user_id,
                    product_id: product.id,
                    product_quantity: qty,
                    product_title: product.title.rendered,
                    product_image: product.yoast_head_json.og_image[0].url,
                    product_attributes: product.variations,
                    product_weight: productWeight,
                    product_price: product.price,
                    selected_attribute: {},
                  }
                )
                .then((res) => {
                  // console.log(
                  //   "responsed-add-to-cart",
                  //   res.data.cart_length,
                  //   res
                  // );
                  setCartProductId((prevCartProductId) => {
                    if (!prevCartProductId.includes(product.id)) {
                      const updateCartProductId = [
                        ...prevCartProductId,
                        product.id,
                      ];
                      // console.log(
                      //   "updateCartProductId----",
                      //   prevCartProductId,
                      //   updateCartProductId,
                      //   product.id
                      // );
                      localStorage.setItem(
                        "cart_productId",
                        JSON.stringify(updateCartProductId)
                      );
                      return updateCartProductId;
                    }
                    return prevCartProductId;
                  });
                  addToCartList(product.id,{});
                  // addToWatchlist(product.id, {});
                  // localStorage.setItem("cart_productId", product.id);
                  localStorage.setItem("cart_length", res.data.cart_length);
                  setAlertMessage("Product added to cart!");
                });
            } else {
              await axios
                .post(
                  `https://admin.bossdentindia.com/wp-json/custom/v1/cart/update`,
                  {
                    user_id: getUserData.user_id,
                    product_id: product.id,
                    product_quantity: qty + 1,
                  }
                )
                .then((res) => {
                  setAlertMessage("Product update from cart!");
                  // console.log("res=========", res.data, qty, filterCartData);
                })
                .catch((err) => console.log("err", err));
            }
          }
        } catch (error) {
          console.error("Error fetching product weight:", error);
          setAlertMessage("Error fetching product weight. Please try again.");
        }
      } else {
        setAlertMessage("Please log In! Thank you.");
        navigate("/my-account", { state: { from: location.pathname } });
      }
    } else {
      setAlertMessage(
        "This product is out of stock and cannot be added to the cart."
      );
    }
  };

  const handleAddToWatchlist = async (product) => {
    if (watchlist.includes(product.id)) {
      const deleteData = await axios
        .delete(
          `https://admin.bossdentindia.com/wp-json/custom/v1/wishlist/delete`,
          {
            data: {
              user_id: getUserData.user_id,
              product_id: product.id,
            },
          }
        )
        .then((response) => {
          // console.log("delete", response.data);
          localStorage.setItem(
            "wishlist_length",
            response.data.wishlist_length
          );
        })
        .catch((error) => console.log("error", error));
      removeFromWatchlist(product.id);
      setAlertMessage("Product removed from watchlist.");
    } else {
      const weightResponse = await axios.get(
        `https://admin.bossdentindia.com/wp-json/custom/v1/product-weight/${product.id}`
      );
      const productWeight = weightResponse.data.weight;
      const postData = await axios
        .post(
          "https://admin.bossdentindia.com/wp-json/custom/v1/wishlist/add",
          {
            user_id: getUserData.user_id,
            product_id: product.id,
            product_quantity: 1,
            product_title: product.title.rendered,
            product_image: product.yoast_head_json.og_image[0].url,
            product_variations: product.variations,
            product_price: product.price,
            product_weight: productWeight,
            selected_attribute: {},
          }
        )
        .then((response) => {
          // console.log("product-page", response.data, wishList);
          localStorage.setItem(
            "wishlist_length",
            response.data.wishlist_length
          );
        })
        .catch((error) => console.log("product-page-error", error));
      addToWatchlist(product.id, {});
      setAlertMessage("Product add from watchlist.");
      // setAlertMessage("Product added to watchlist!");
    }
  };

  const handleImageLoad = (event) => {
    event.target.classList.add("loaded");
  };

  return (
    <>
      {loading ? (
        <>
          <Loader1 />
        </>
      ) : (
        <>
          <div className="shop-container">
            <div className="header" data-aos="fade-up">
              <h1 className="shop-title">Shop</h1>
              <BreadCrumbs />
            </div>
            <div className="shop-header">
              {alertMessage && <AlertSuccess message={alertMessage} />}
            </div>

            <div className="shop-content">
              {/* products catgeory component */}
              <Category
                handleCategoryClick={handleCategoryClick}
                category={category}
              />
              {/* fetch all product data in api */}
              {products.length === 0 ? (
                <Loader></Loader>
              ) : (
                <>
                  <div className="products-grid" data-aos="fade-up">
                    {products.map((product) => {
                      let imageUrl = null;
                      if (product.better_featured_image) {
                        imageUrl = product.better_featured_image.source_url;
                      } else if (
                        product.yoast_head_json &&
                        product.yoast_head_json.og_image &&
                        product.yoast_head_json.og_image.length > 0
                      ) {
                        imageUrl = product.yoast_head_json.og_image[0].url;
                      }
                      return (
                        <div className="product-card" key={product.id}>
                          <div className="product-card-link">
                            <Link
                              to={`/products/${product.id}`}
                              className="product-link"
                            >
                              {imageUrl && (
                                <img
                                  src={product.yoast_head_json.og_image[0].url}
                                  alt={product.title.rendered}
                                  className="product-image"
                                  loading="lazy"
                                  onLoad={handleImageLoad}
                                />
                              )}
                              <h3
                                className="product-title"
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  height: "60px",
                                }}
                              >
                                {product.title.rendered}
                              </h3>
                            </Link>
                          </div>
                          <h3
                            className="product-price "
                            style={{
                              textAlign: "center",
                            }}
                          >
                            Price: {product.price} ₹
                          </h3>
                          <div className="product-actions">
                            <button
                              className="btnProductQuickview"
                              data-toggle="tooltip"
                              data-placement="top"
                              data-original-title="Quick view"
                              onClick={() =>
                                navigate(`/products/${product.id}`)
                              }
                            >
                              <BsFillGridFill />
                            </button>
                            <button
                              className={`btn-quick-add ${
                                stockStatuses[product.id] !== "instock"
                                  ? "disable-button"
                                  : ""
                              }`}
                              data-toggle="tooltip"
                              data-placement="top"
                              title=""
                              data-original-title="Quick add"
                              // disabled={stockStatuses[product.id] !== "instock"}
                              onClick={(e) => handleAddToCart(e, product)}
                            >
                              <FaCartPlus />
                            </button>
                            <button
                              className={`item-product__wishlist ${
                                !watchlist.includes(product.id)
                                  ? ""
                                  : "inactive-heart"
                              }`}
                              data-toggle="tooltip"
                              data-placement="top"
                              data-original-title="Add to wishlist"
                              onClick={() => handleAddToWatchlist(product)}
                            >
                              {/* {console.log(
                                "watchlist",watchlist,
                                wishList,
                                "wishlist",
                                getWishlist
                              )} */}
                              {/* {wishList.includes(product.id) ? (
                                <FaHeart />
                              ) : (
                                <FaRegHeart />
                              )} */}
                              {watchlist.includes(product.id) ? (
                                <FaHeart />
                              ) : (
                                <FaRegHeart />
                              )}
                            </button>
                          </div>

                          <Link
                            to={`/products/${product.id}`}
                            className="product-button-main"
                          >
                            <button className="product-button">
                              Learn More
                            </button>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            <ProductPagination
              totalProducts={totalProducts}
              productsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Product;
