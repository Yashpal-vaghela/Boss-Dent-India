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
// import { parseInt } from "yet-another-react-lightbox";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [stockStatuses, setStockStatuses] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

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
    e.preventDefault();
    const stockStatus = stockStatuses[product.id];
    if (stockStatus === "instock") {
      if (isLoggedIn) {
        try {
          const weightResponse = await axios.get(
            `https://admin.bossdentindia.com/wp-json/custom/v1/product-weight/${product.id}`
          );
          const productWeight = weightResponse.data.weight;
          const prodcutWithWeight = {
            ...product,
            weight: productWeight,
          };
          dispatch(Add(prodcutWithWeight));
          setAlertMessage("Product added to cart!");
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

  const handleAddToWatchlist = (product) => {
    if (watchlist.includes(product.id)) {
      removeFromWatchlist(product.id);
      setAlertMessage("Product removed from watchlist.");
    } else {
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
