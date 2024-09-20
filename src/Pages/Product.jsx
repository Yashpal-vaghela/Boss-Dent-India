import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Loader from "../component/Loader";
import { FaCartPlus } from "react-icons/fa";
import { useWatchlist } from "./WatchlistContext";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { BsFillGridFill } from "react-icons/bs";
// import Aos from "aos";
import AlertSuccess from "../component/AlertSuccess";
import { useDispatch } from "react-redux";
import { Add } from "../redux/Apislice/cartslice";
import BreadCrumbs from "../component/BreadCrumbs";
import { FaStar } from "react-icons/fa";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9);
  const [totalProducts, setTotalProducts] = useState(0);
  // const [selectedCategory, setSelectedCategory] = useState(null);
  const [minPrice] = useState(40);
  const [maxPrice] = useState(12500);
  const [stockStatuses, setStockStatuses] = useState({});
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchProducts = useCallback(
    async (page = 1, prevProducts = []) => {
      setLoading(true);
      try {
        let apiUrl = `https://bossdentindia.com/wp-json/wp/v2/product?per_page=100`;
        // const baseurl = "https://bossdentindia.com/wp-json/wp/v2/product";
        const perPage = 100;
        // console.log(`Fetching products for category: ${category}`);
        if (category) {
          apiUrl += `&product_cat=${category}`;
        }

        const response = await axios.get(apiUrl, {
          params: {
            // per_page: perPage,
            page: page,
          },
        });
        const newProducts = response.data;
        const allProducts = [...prevProducts, ...newProducts];
        if (newProducts.length === perPage) {
          return fetchProducts(page + 1, allProducts);
        }

        // console.log('Full Product Response:', response.data);
        const filteredProducts = allProducts.filter((product) => {
          return (
            parseFloat(product.price) >= minPrice &&
            parseFloat(product.price) <= maxPrice
          );
        });
        // console.log(
        //   "response",
        //   response.data,
        //   "allProducts",
        //   allProducts,
        //   "filterDatA",
        //   filteredProducts
        // );
        setTotalProducts(filteredProducts.length);
        const startIndex = (currentPage - 1) * productsPerPage;
        const paginatedProducts = filteredProducts.slice(
          startIndex,
          startIndex + productsPerPage
        );
        const stockStatusPromises = paginatedProducts.map(async (product) => {
          try {
            const stockResponse = await axios.get(
              `https://bossdentindia.com/wp-json/custom/v1/stock-status/${product.id}`
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

        setProducts(paginatedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
      // console.log("Fetching products for category:", category);
    },
    [category, currentPage, minPrice, maxPrice, productsPerPage]
  );
  useEffect(() => {
    const userLoggedIn = !!localStorage.getItem("token");
    setIsLoggedIn(userLoggedIn);
    // Aos.init({
    //   duration: 1000, // Animation duration in milliseconds
    //   once: false, // Allow animations to trigger multiple times
    //   mirror: true, // Trigger animations on scroll up
    // });
  }, []);

  useEffect(() => {
    if (category !== undefined) {
      fetchProducts();
    }
  }, [
    currentPage,
    productsPerPage,
    category,
    minPrice,
    maxPrice,
    fetchProducts,
  ]);

  // useEffect(() => {
  //   if (alertMessage) {
  //     const timer = setTimeout(() => {
  //       setAlertMessage("");
  //     }, 3000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [alertMessage]);

  // console.log(response.data);
  // useEffect(() => {
  //   fetchProducts();
  // }, [fetchProducts]);

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
    console.log("category", newCategory);
    if (newCategory !== category) {
      setCurrentPage(1);
      navigate(`?category=${newCategory}`);
    }
  };

  // const handlePriceRangeChange = () => {
  //   setCurrentPage(1);
  //   fetchProducts();
  // };
  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    const stockStatus = stockStatuses[product.id];
    if (stockStatus === "instock") {
      if (isLoggedIn) {
        // var quantity = 1;
        // dispatch(AddCartItem({...product,qty:quantity}))
        // addToCart({ ...product, quantity});
        // const getProduct = JSON.parse(localStorage.getItem('cart'))
        // getProduct.length != 0 && getProduct.map((item)=>{
        //   if(item.id == product.id){universal@2024
        //     setAlertMessage('Product already exists in cart')
        //   }else{
        //     addToCart({ ...product, quantity});
        //     setAlertMessage("Product added to cart!");
        //   }
        // })
        try {
          const weightResponse = await axios.get(
            `https://bossdentindia.com/wp-json/custom/v1/product-weight/${product.id}`
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

        // dispatch(Add({...product}))
        // setAlertMessage("Product added to cart!");
      } else {
        setAlertMessage("Please log In! Thank you.");
        navigate("/my-account");
      }
    } else {
      setAlertMessage(
        "This product is out of stock and cannot be added to the cart."
      );
    }
  };

  const handleAddToWatchlist = (product) => {
    if (isLoggedIn) {
      if (watchlist.includes(product.id)) {
        removeFromWatchlist(product.id);
        setAlertMessage("Product removed from watchlist.");
      } else {
        addToWatchlist(product.id);
        setAlertMessage("Product added to watchlist!");
      }
    } else {
      setAlertMessage("Please log in! Thank you.");
      navigate("/my-account");
    }
  };
  const handleImageLoad = (event) => {
    event.target.classList.add("loaded");
  };
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const paginationButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === currentPage ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      paginationButtons.push(
        <button
          key={i}
          className={`paginate_button page-item ${
            currentPage === i ? "active" : ""
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      paginationButtons.push(
        <span key={i} className="ellipsis">
          ...
        </span>
      );
    }
  }

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
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
              <div className="shop-sidebar-menu" data-aos="fade">
                <div className="shop-sidebar">
                  <h3>Shop by Category</h3>
                  <hr />
                  <ul>
                    <li
                      className={`category ${
                        category === null ? "active" : ""
                      }`}
                      onClick={() => handleCategoryClick(null)}
                    >
                      All
                    </li>
                    <li
                      className={`category ${
                        category === "46" ? "active" : ""
                      }`}
                      onClick={() => handleCategoryClick(46)}
                    >
                      Accessories
                    </li>
                    <li
                      className={`category ${
                        category === "75" ? "active" : ""
                      }`}
                      onClick={() => handleCategoryClick(75)}
                    >
                      General dentist
                    </li>
                    <li
                      className={`category ${
                        category === "116" ? "active" : ""
                      }`}
                      onClick={() => handleCategoryClick(116)}
                    >
                      All Gloves
                    </li>
                    <li
                      className={`category ${
                        category === "117" ? "active" : ""
                      }`}
                      onClick={() => handleCategoryClick(117)}
                    >
                      All Caps
                    </li>
                    <li
                      className={`category ${
                        category === "118" ? "active" : ""
                      }`}
                      onClick={() => handleCategoryClick(118)}
                    >
                      All Mask
                    </li>
                    <li
                      className={`category ${
                        category === "119" ? "active" : ""
                      }`}
                      onClick={() => handleCategoryClick(119)}
                    >
                      All Draps
                    </li>
                    <li
                      className={`category ${
                        category === "122" ? "active" : ""
                      }`}
                      onClick={() => handleCategoryClick(122)}
                    >
                      All Sleeve
                    </li>
                    <li
                      className={`category ${
                        category === "125" ? "active" : ""
                      }`}
                      onClick={() => handleCategoryClick(125)}
                    >
                      All Retractor
                    </li>
                    <li
                      className={`category ${
                        category === "123" ? "active" : ""
                      }`}
                      onClick={() => handleCategoryClick(123)}
                    >
                      All Tips
                    </li>
                    <li
                      className={`category ${
                        category === "124" ? "active" : ""
                      }`}
                      onClick={() => handleCategoryClick(124)}
                    >
                      All Trays
                    </li>
                    <li
                      className={`category ${
                        category === "126" ? "active" : ""
                      }`}
                      onClick={() => handleCategoryClick(126)}
                    >
                      All Wedges
                    </li>
                    <li
                      className={`category ${
                        category === "120" ? "active" : ""
                      }`}
                      onClick={() => handleCategoryClick(120)}
                    >
                      Polishing Kits
                    </li>
                    <li
                      className={`category ${
                        category === "121" ? "active" : ""
                      }`}
                      onClick={() => handleCategoryClick(121)}
                    >
                      Endo Categories
                    </li>
                    <li
                      className={`category ${
                        category === "127" ? "active" : ""
                      }`}
                      onClick={() => handleCategoryClick(127)}
                    >
                      Vincismiles
                    </li>
                  </ul>
                </div>
              </div>
              <div className="products-grid" data-aos="fade"> 
                {/* fetch all product data in api */}
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
                              src={imageUrl}
                              alt={product.title.rendered}
                              className="product-image"
                              loading="lazy"
                              onLoad={handleImageLoad}
                            />
                          )}
                          <h3 className="product-title" style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              height:'60px'
                            }}>
                            {product.title.rendered}
                          </h3>
                        </Link>
                        <h3
                          className="product-price"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          Price: {product.price} ₹
                          <span
                            style={{ color: "#bf8e22" }}
                            id="top_nav"
                          >
                            <div className="dropdown has-border">
                              <div
                                className="dropdown-toggle align-self-center text-center w-100"
                                data-bs-toggle="dropdown"
                              >
                                <span
                                  style={{
                                    fontSize: "12px",
                                    marginRight: "5px",
                                    color: "#222",
                                  }}
                                >
                                  5
                                </span>
                                <FaStar size={10} />
                                <FaStar size={10} />
                                <FaStar size={10} />
                                <FaStar size={10} />
                                <FaStar size={10} />
                              </div>
                              <div className="dropdown-menu dropdown-menu-right">
                                <Link
                                  className="dropdown-item"
                                  href="#"
                                  title="Open a Support Ticket"
                                >
                                  5&nbsp;
                                  <FaStar size={10} />
                                  <FaStar size={10} />
                                  <FaStar size={10} />
                                  <FaStar size={10} />
                                  <FaStar size={10} />
                                </Link>
                                <Link
                                  href="#"
                                  className="dropdown-item"
                                  title="Order Status Update"
                                >
                                  4&nbsp;
                                  <FaStar size={10} />
                                  <FaStar size={10} />
                                  <FaStar size={10} />
                                  <FaStar size={10} />
                                </Link>
                                <Link
                                  className="dropdown-item"
                                  href="#"
                                  title="FAQs"
                                >
                                  3&nbsp;
                                  <FaStar size={10} />
                                  <FaStar size={10} />
                                  <FaStar size={10} />
                                </Link>
                                <Link
                                  className="dropdown-item"
                                  href="#"
                                  title="Chat With Us"
                                >
                                  2&nbsp;
                                  <FaStar size={10} />
                                  <FaStar size={10} />
                                </Link>
                                <Link
                                  className="dropdown-item"
                                  href="#"
                                  title="Email Us"
                                >
                                  1&nbsp;
                                  <FaStar size={10} />
                                </Link>
                              </div>
                            </div>
                          </span>
                        </h3>
                        <div className="product-actions" onClick={()=>navigate(`/products/${product.id}`)}>
                          <button
                            className="btnProductQuickview"
                            data-toggle="tooltip"
                            data-placement="top"
                            data-original-title="Quick view"
                          >
                            <BsFillGridFill />
                          </button>
                          <button
                            className={`btn-quick-add ${
                              stockStatuses[product.id] !== "instock"
                                ? "disable-button"
                                : ""
                            }`}
                            // className="btn-quick-add"
                            data-toggle="tooltip"
                            data-placement="top"
                            title=""
                            data-original-title="Quick add"
                            disabled={stockStatuses[product.id] !== "instock"}
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
                            // className="item-product__wishlist"
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
                          <button className="product-button">Learn More</button>
                        </Link>
                      </div>

                      {/* <Link
                        to={`/products/${product.id}`}
                        className="product-button-main"
                      >
                        <button className="product-button">Learn more</button>
                      </Link> */}
                      {/* <div className="product-actions">
                        <button
                          className={`add-to-cart-button ${
                            stockStatuses[product.id] !== "instock"
                              ? "disable-button"
                              : ""
                          }`}
                          disabled={stockStatuses[product.id] !== "instock"}
                          onClick={(e) => handleAddToCart(e, product)}
                        >
                          <FaCartPlus />
                        </button>

                        <span
                          className={`watchlist-icon ${
                            !watchlist.includes(product.id)
                              ? ""
                              : "inactive-heart"
                          }`}
                          onClick={() => handleAddToWatchlist(product)}
                        >
                          {watchlist.includes(product.id) ? (
                            <FaHeart />
                          ) : (
                            <FaRegHeart />
                          )}
                        </span>
                      </div> */}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <div className="pagination-list">{paginationButtons}</div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
    </>
  );
};

export default Product;