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
                {/* static all product data */}
                {/* {category1?.map((item, index) => {
                  return (
                    <div className="product-card">
                      <div className="product-card-link">
                        <Link className="product-link">
                          <img
                            src="data:image/jpeg;base64,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"
                            className="product-image"
                            loading="lazy"
                          ></img>
                          <h3
                            className="product-title"
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            Product Title
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
                          Price:100 ₹
                          <span
                            // onClick={() => navigate("/proudcts/2114")}
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

                        <div className="product-actions">
                          <button
                            className="btnProductQuickview"
                            data-toggle="tooltip"
                            data-placement="top"
                            data-original-title="Quick view"
                          >
                            <BsFillGridFill />
                          </button>
                          <button
                            className="btn-quick-add"
                            data-toggle="tooltip"
                            data-placement="top"
                            title=""
                            data-original-title="Quick add"
                          >
                            <FaCartPlus />
                          </button>
                          <button
                            className="item-product__wishlist"
                            data-toggle="tooltip"
                            data-placement="top"
                            data-original-title="Add to wishlist"
                          >
                            <FaRegHeart />
                          </button>
                        </div>
                        <Link className="product-button-main">
                          <button className="product-button">Learn More</button>
                        </Link>
                      </div>
                    </div>
                  );
                })} */}
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