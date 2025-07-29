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
import "../css/product.css";
import { AddToCartModal } from "../component/AddToCartModal";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [stockStatuses, setStockStatuses] = useState({});
  const [currentPage, setCurrentPage] = useState(() => {
    const a = sessionStorage.getItem("Product_page");
    return a ? Number(sessionStorage.getItem("Product_page")) : 1;
  });
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    if (window.innerWidth >= 1400) {
      return 12;
    } else if (window.innerWidth <= 1024) {
      return 10;
    } else {
      return 9;
    }
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
  const [getUserData] = useState(
    JSON.parse(sessionStorage.getItem("UserData"))
  );


  const [qty] = useState(1);
  const [getcartProductData, setgetcartProductData] = useState(
    JSON.parse(sessionStorage.getItem("cart"))
  );
  const [getCartList] = useState(
    JSON.parse(sessionStorage.getItem("cart_productId"))
  );
  const [cartProductId, setCartProductId] = useState([]);
  const [showVariationModal, setShowVariationModal] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  const [isAddingToCart,setIsAddingToCart] = useState(false);
  // fetch product data
  const fetchProducts = useCallback(
    async (currentPage1) => {
      setLoading(true);
      try {
        let apiUrl = `https://admin.bossdentindia.com/wp-json/wp/v2/product?per_page=${itemsPerPage}&page=${currentPage1}`;
        // const perPage = 100;
        if (category) {
          apiUrl += `&product_cat=${category}`;
        }
        window.scrollTo(0, 0);
        const response = await axios.get(apiUrl);
        // console.log("products--------", response);
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
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    },
    [category, itemsPerPage]
  );
  // added new function to fetch the fresh data
  const fetchCartData = async () => {
    try {
      const res = await axios.get(
        `https://admin.bossdentindia.com/wp-json/custom/v1/cart-items?user_id=${getUserData.user_id}`
      );
      const updatedCart = res.data;
      // console.log("updated cart data is", res.data);
      
      sessionStorage.setItem("cart", JSON.stringify(updatedCart));
      sessionStorage.setItem(
        "cart_productId",
        JSON.stringify(
          updatedCart.cart_items?.map((item) => Number(item.product_id)) || []
        )
      );
      sessionStorage.setItem(
        "cart_length",
        updatedCart.cart_items?.length || 0
      );

      setgetcartProductData(updatedCart);
      setCartProductId(
        updatedCart.cart_items?.map((item) => Number(item.product_id)) || []
      );
    } catch (error) {
      console.warn("❌ Failed to fetch updated cart:", error);
    }
  };
  const displayWindowSize = () => {
    const width = document.documentElement.clientWidth;
    let a = "";
    if (width >= 1400) {
      a = 12;
    } else if (width <= 1024) {
      a = 10;
    } else {
      a = 9;
    }
    setItemsPerPage(a);
    // setItemsPerPage(width >= 1400 ? 12 : width >= 1024 ? 9 : 10);
  };
  useEffect(() => {
    const userLoggedIn = !!sessionStorage.getItem("token");
    setIsLoggedIn(userLoggedIn);
    if (getCartList) {
      // setCartProductId(getCartList);
    }
    window.addEventListener("resize", displayWindowSize);
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
    setgetcartProductData(JSON.parse(sessionStorage.getItem("cart")));
  }, [alertMessage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    sessionStorage.setItem("Product_page", page);
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
    // console.log("product data ", product);
    e.preventDefault();

    if(isAddingToCart) return;
    setIsAddingToCart(true);

    if (product.variations && product.variations.length > 0) {
      setSelectedProductForModal(product);
      setShowVariationModal(true);
      setIsAddingToCart(false);
      return;
    }

    if (!getUserData) {
      toast.error("Please login to add product to cart!");
      setTimeout(() => {
        navigate("/my-account", { state: { from: location.pathname } });
      }, 2000);
      setIsAddingToCart(false);
      return;
    }

    const stockStatus = stockStatuses[product.id];
    if (stockStatus !== "instock") {
      toast.error(
        "This product is out of stock and cannot be added to the cart."
      );
      setIsAddingToCart(false);
      return;
    }

    try {
      const userData = JSON.parse(sessionStorage.getItem("UserData"));
      if (!userData) {
        setIsAddingToCart(false);
        return;
      }

      const existingCartItem = getcartProductData?.cart_items?.find(
        (item) => Number(item.product_id) === product.id
      );
      // console.log(
      //   "existing cart item is:",
      //   existingCartItem,
      //   getcartProductData
      // );
      const categoryId = product.product_cat;

      if (categoryId) {
        const categorydata = await axios
          .get(
            `https://admin.bossdentindia.com/wp-json/custom/v1/product/${product.slug}`
          )
          .then((res) => res.data)
          .catch((err) => console.log("error", err));
          
        if (existingCartItem === undefined) {
          const res = await axios.post(
            `https://admin.bossdentindia.com/wp-json/custom/v1/add-to-cart`,
            {
              user_id: userData.user_id,
              product_id: product.id,
              product_quantity: qty,
              category_id: product?.product_cat[0]
                ? [product?.product_cat[0]]
                : "null",
              category_name: categorydata.length !== 0 ? categorydata?.categories[0].name :"null",
              product_title: product.title.rendered,
              product_image: product.yoast_head_json?.og_image?.[0]?.url || "",
              product_attributes: product.variations != null ? product.variations : {},
              product_price: product.price,
              selected_attribute: {},
            }
          );
          await fetchCartData();
          // console.log("res",res.data)
          addToCartListProduct(res.data.cart_id, {}, userData);
          toast.success("Product added to cart!");
        } else {
          const updatedQty = existingCartItem?.product_quantity
            ? Number(existingCartItem.product_quantity) + 1
            : 2;

          const res = await axios.post(
            `https://admin.bossdentindia.com/wp-json/custom/v1/cart/update`,
            {
              user_id: userData.user_id,
              category_id: product.product_cat[0],
              product_id: product.id,
              product_quantity: updatedQty,
              cart_id: existingCartItem?.id,
            }
          );
          await fetchCartData();
          addToCartListProduct(res.data.cart_id, {}, userData);
          toast.success("Product updated in cart!");
        }
      }
      // console.log("category", category);
      // const isAlreadyInCart = cartProductId.includes(product.id);
      // console.log(
      //   "isAlreadyInCart",
      //   !isAlreadyInCart,
      //   "cartIs",
      //   cartProductId,
      //   product,
      //   "categoryName",
      //   categoryName,
      //   "variations",
      //   product.variations
      // );
    } catch (error) {
      console.error("Error in handleAddToCart:", error);
      toast.error("An error occurred. Please try again.");
    } finally{
      setIsAddingToCart(false);
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
            // console.log('response',response)
            sessionStorage.setItem(
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
            sessionStorage.setItem(
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

  const handleAddToCartFromModal = async (
    product,
    selectedAttributes,
    quantity,
    variation = null
  ) => {
    const userData = JSON.parse(sessionStorage.getItem("UserData"));

    if (!userData) {
      toast.error("Please login to add product to cart!");
      setTimeout(() => {
        navigate("/my-account", {
          state: { from: location.pathname, productId: product.id },
        });
      }, 2000);
      return;
    }

    let cartItems = [];
    try {
      const res = await axios.get(
        `https://admin.bossdentindia.com/wp-json/custom/v1/cart-items?user_id=${userData.user_id}`
      );
      cartItems = res.data.cart_items || [];
      sessionStorage.setItem("cart", JSON.stringify(res.data));
      sessionStorage.setItem("cart_length", res.data.cart_items?.length || 0);
    } catch (err) {
      console.warn("Failed to fetch latest cart from server:", err);
      const storedCart = sessionStorage.getItem("cart");
      if (storedCart) {
        try {
          const parsed = JSON.parse(storedCart);
          cartItems = parsed.cart_items || [];
        } catch (e) {
          console.warn("Error parsing session cart:", e);
        }
      }
    }

    //  Normalize selected attributes for consistent comparison
    const normalizeAttributes = (attrs) => {
      if (!attrs || typeof attrs !== "object") return {};
      return Object.keys(attrs)
        .sort()
        .reduce((acc, key) => {
          acc[key] = attrs[key];
          return acc;
        }, {});
    };

    const normalizedSelected = normalizeAttributes(selectedAttributes);

    const existingItem = cartItems.find(
      (item) =>
        Number(item.product_id) === Number(product.id) &&
        JSON.stringify(normalizeAttributes(item.selected_attribute)) ===
          JSON.stringify(normalizedSelected)
    );

    // console.log("Matching cart item:", existingItem);

    const effectivePrice =
      variation?.sale_price ||
      variation?.price ||
      product.sale_price ||
      product.price ||
      0;

    try {
      if (!existingItem) {
        //  Add product
        const res = await axios.post(
          `https://admin.bossdentindia.com/wp-json/custom/v1/add-to-cart`,
          {
            user_id: userData.user_id,
            product_id: product.id,
            category_id: product.product_cat || product.categories?.[0]?.id,
            product_quantity: quantity,
            product_title: product.name || product.title?.rendered || "Unknown",
            product_image:
              product.yoast_head_json?.og_image?.[0]?.url ||
              product.better_featured_image?.source_url ||
              "",
            product_attributes: product.variations,
            product_price: effectivePrice,
            product_weight: product.weight || null,
            selected_attribute: selectedAttributes,
          }
        );

        const updatedCart = res.data;
        sessionStorage.setItem("cart", JSON.stringify(updatedCart));
        sessionStorage.setItem(
          "cart_length",
          updatedCart.cart_items?.length || 0
        );

        addToCartListProduct(updatedCart.cart_id, selectedAttributes, userData);
        toast.success("Product added to cart successfully!");
      } else {
        // Update quantity
        const updatedQuantity =
          Number(existingItem.product_quantity) + Number(quantity);

        const res = await axios.post(
          `https://admin.bossdentindia.com/wp-json/custom/v1/cart/update`,
          {
            user_id: userData.user_id,
            category_id: product.product_cat || product.categories?.[0]?.id,
            product_id: product.id,
            product_quantity: updatedQuantity,
            selected_attribute: selectedAttributes,
            cart_id: existingItem.id,
          }
        );

        const updatedCart = res.data;
        sessionStorage.setItem("cart", JSON.stringify(updatedCart));
        sessionStorage.setItem(
          "cart_length",
          updatedCart.cart_items?.length || 0
        );

        addToCartListProduct(updatedCart.cart_id, selectedAttributes, userData);
        toast.success("Product quantity updated successfully!");
      }
    } catch (error) {
      console.error("Error adding/updating cart:", error);

      if (error?.response?.data?.code === "no_cart_items" && !existingItem) {
        toast.error("Something went wrong while creating your cart.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <>
      {loading ? (
        <>
          <Loader1 />
        </>
      ) : (
        <>
          <AddToCartModal
            isOpen={showVariationModal}
            onClose={() => setShowVariationModal(false)}
            product={selectedProductForModal}
            stockStatus={stockStatuses[selectedProductForModal?.id]}
            onAddToCart={handleAddToCartFromModal}
            variations={selectedProductForModal?.variations}
          ></AddToCartModal>

          <div className="shop-container">
            <div className="header" data-aos="fade-up">
              <h1 className="shop-title">Products</h1>
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

                      const discountPercentage =
                        product.regular_price && product.price
                          ? Math.round(
                              ((product.regular_price - product.price) /
                                product.regular_price) *
                                100
                            )
                          : null;
                      return (
                        <div
                          className={`product-card ${
                            stockStatuses[product.id] !== "instock"
                              ? "out-of-stock"
                              : ""
                          }`}
                          key={product.id}
                        >
                          {stockStatuses[product.id] !== "instock" ? (
                            <div class="out-of-stock-label">Out of Stock</div>
                          ) : (
                            <></>
                          )}
                          {discountPercentage > 0 && (
                            <div className="discount-badge">
                              {`${discountPercentage}% Off`}
                            </div>
                          )}

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
                              <h3 className="product-title d-flex justify-content-center align-items-center">
                                {product.title.rendered}
                              </h3>
                            </Link>
                          </div>
                          <h3 className="product-price text-center">
                            {product?.regular_price && product?.price ? (
                              product.regular_price === product.price ? (
                                // If both values are the same, show only one value
                                `Price: ${product.price} ₹`
                              ) : (
                                // If values are different, show both with strikethrough on regular_price
                                <>
                                  Price:&nbsp;
                                  <span className="regular-price">
                                    {product.regular_price}
                                  </span>
                                  <span className="current-price">
                                    {product.price} ₹
                                  </span>
                                  {/* <span className="discount-percentage">
                                    {` (${(
                                      ((product.regular_price - product.price) / product.regular_price) *
                                      100
                                    ).toFixed(2)}% Off)`}
                                  </span> */}
                                </>
                              )
                            ) : (
                              // If only price is available, show price
                              `Price: ${product?.price || "N/A"} ₹`
                            )}
                            {/* Price: {product.regular_price} ₹
                            Price: {product.price} ₹ */}
                          </h3>

                          <div
                            className={`product-actions ${
                              stockStatuses[product.id] !== "instock"
                                ? "out-of-stock"
                                : ""
                            }`}
                          >
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
                              disabled={isAddingToCart}
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
