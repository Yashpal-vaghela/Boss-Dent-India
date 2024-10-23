import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FaCartPlus } from "react-icons/fa";
import { useWatchlist } from "./WatchlistContext";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { BsFillGridFill } from "react-icons/bs";
import AlertSuccess from "../component/AlertSuccess";
import BreadCrumbs from "../component/BreadCrumbs";
import Loader1 from "../component/Loader1";
import Category from "../component/Category";
import Loader from "../component/Loader";
import { toast } from "react-toastify";
import ProductPagination from "../component/ProductPagination";
import { Link } from "react-router-dom";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [stockStatuses, setStockStatuses] = useState({});
  const [currentPage, setCurrentPage] = useState(() => {
    const a = localStorage.getItem("Product_page");
    return a ? Number(localStorage.getItem("Product_page")) : 1;
  });
  const [itemsPerPage] = useState(() => {
    return window.innerWidth >= 1400 ? 12 : 9;
  });
  const {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    addToCartListProduct,
  } = useWatchlist();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const navigate = useNavigate();
  const location = useLocation();
  const [getUserData] = useState(JSON.parse(localStorage.getItem("UserData")));
  const [qty] = useState(1);
  const [getcartProductData, setgetcartProductData] = useState(
    JSON.parse(localStorage.getItem("cart"))
  );
  const [getCartList] = useState(
    JSON.parse(localStorage.getItem("cart_productId"))
  );
  const [cartProductId, setCartProductId] = useState([]);

  // fetch product data
  const fetchProducts = useCallback(
    async (currentPage1) => {
      // console.log("curre",currentPage,currentPage1)
      setLoading(true);
      try {
        let apiUrl = `https://admin.bossdentindia.com/wp-json/wp/v2/product?per_page=${itemsPerPage}&page=${currentPage1}`;
        // const perPage = 100;
        if (category) {
          apiUrl += `&product_cat=${category}`;
        }
        window.scrollTo(0, 0);
        const response = await axios.get(apiUrl);
        const newProducts = response.data;
        setTotalProducts(parseInt(response.headers["x-wp-total"], 10));
        setProducts(newProducts);
        const stockResponse = await axios.get(
          "https://admin.bossdentindia.com/wp-json/custom/v1/stock-status/all"
        );

        const allStockStatuses = stockResponse.data;
        const stockStatusesResults = allStockStatuses.map((product, index) => {
          return {
            [product.product_id]:
              allStockStatuses[index].stock_status || "unknown",
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
    setgetcartProductData(JSON.parse(localStorage.getItem("cart")));
  }, [alertMessage]);


  const handlePageChange = (page) => {
    setCurrentPage(page);
    localStorage.setItem("Product_page", page);
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
    e.preventDefault();
    if (getUserData) {
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
                return item === product.id;
              });
              // console.log("filterData", filterCartData, cartProductId);
              const filterCartProduct = getcartProductData.cart_items.filter(
                (item) => Number(item.product_id) === product.id
              );
              // console.log("filter",filterCartProduct)
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
                    setCartProductId((prevCartProductId) => {
                      if (!prevCartProductId.includes(product.id)) {
                        const updateCartProductId = [
                          ...prevCartProductId,
                          product.id,
                        ];
                        localStorage.setItem(
                          "cart_productId",
                          JSON.stringify(updateCartProductId)
                        );
                        return updateCartProductId;
                      }
                      return prevCartProductId;
                    });
                    addToCartListProduct(product.id, {}, userData);
                    localStorage.setItem("cart_length", res.data.cart_length);
                    toast.success("Product added to cart!");
                  });
              } else {
                await axios
                  .post(
                    `https://admin.bossdentindia.com/wp-json/custom/v1/cart/update`,
                    {
                      user_id: getUserData.user_id,
                      product_id: product.id,
                      product_quantity:
                        Number(filterCartProduct[0].product_quantity) + 1,
                    }
                  )
                  .then((res) => {
                    // setAlertMessage("Product update from cart!");
                    toast.success("Product update from cart!");
                    addToCartListProduct(product.id, {}, userData);
                  })
                  .catch((err) => console.log("err", err));
              }
            }
          } catch (error) {
            console.error("Error fetching product weight:", error);
            // setAlertMessage("Error fetching product weight. Please try again.");
            toast.error("Error fetching product weight.");
          }
        } else {
          toast.error("Please log In! Thank you!");
          // setAlertMessage("Please log In! Thank you.");
          setTimeout(() => {
            navigate("/my-account", { state: { from: location.pathname } });
          }, 2000);
        }
      } else {
        toast.error(
          "This product is out of stock and cannot be added to the cart."
        );
      }
    } else {
      toast.error("Please login to add product to cart!");
      setTimeout(() => {
        navigate("/my-account", { state: { from: location.pathname } });
      }, 2000);
    }
  };

  const handleAddToWatchlist = async (product) => {
    if (isLoggedIn) {
      if (watchlist.includes(product.id)) {
        await axios
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
              "watchlist_length",
              response.data.wishlist_length
            );
          })
          .catch((error) => console.log("error", error));
        removeFromWatchlist(product.id);
        // setAlertMessage("Product removed from watchlist.");
        toast.success("Product removed from watchlist.");
      } else {
        const weightResponse = await axios.get(
          `https://admin.bossdentindia.com/wp-json/custom/v1/product-weight/${product.id}`
        );
        const productWeight = weightResponse.data.weight;
        await axios
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
              "watchlist_length",
              response.data.wishlist_length
            );
          })
          .catch((error) => console.log("product-page-error", error));
        addToWatchlist(product.id, null, getUserData);
        // setAlertMessage("Product add from watchlist.");
        toast.success("Product added to wishlist!");
        // setAlertMessage("Product added to watchlist!");
      }
    } else {
      toast.error("Please login to add product to wishlist!");
      setTimeout(() => {
        navigate("/my-account", { state: { from: location.pathname } });
      }, 2000);
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
                              className="product-link"
                              to={`/products/${encodeURIComponent(
                                product.slug
                              )}`}
                            >
                              {imageUrl && (
                                <img
                                  src={product.yoast_head_json.og_image[0].url}
                                  alt={product.title.rendered}
                                  className="product-image"
                                  // loading="lazy"
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
                            className="product-price"
                            style={{
                              textAlign: "center",
                            }}
                          >
                            Price: {product.price} ₹
                          </h3>
                          <div className="product-actions">
                            <Link
                              to={`/products/${encodeURIComponent(
                                product.slug
                              )}`}
                              className="btnProductQuickview"
                              data-toggle="tooltip"
                              data-placement="top"
                              data-original-title="Quick view"
                            >
                              <BsFillGridFill />
                            </Link>
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
                              {watchlist.includes(product.id) ? (
                                <FaHeart />
                              ) : (
                                <FaRegHeart />
                              )}
                            </button>
                          </div>
                          <Link
                            to={`/products/${encodeURIComponent(product.slug)}`}
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
