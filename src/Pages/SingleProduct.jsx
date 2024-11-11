import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useWatchlist } from "./WatchlistContext";
import axios from "axios";
import "../css/productview.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { FaCartPlus } from "react-icons/fa6";
import ReviewList from "../component/ReviewList";
import ReviewForm from "../component/ReviewForm";
import AlertSuccess from "../component/AlertSuccess";
import { toast } from "react-toastify";
import Loader1 from "../component/Loader1";
import { Link } from "react-router-dom";

const SingleProduct = () => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [salePrice, setSalePrice] = useState(null);
  const [regluarPrice, setRegularPrice] = useState(null);
  const [variations, setVariations] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [stockStatus, setStockStatus] = useState("unknown");
  const {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    addToCartListProduct,
  } = useWatchlist();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [weight, setWeight] = useState(null);
  const [activeSection, setActivesection] = useState("description");
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [discountProductPrice, setDiscountProdcutPrice] = useState(null);
  // const [ProductId] = useState(() => {
  //  return  localStorage.getItem("productId")
  //     ? localStorage.getItem("productId")
  //     : [];
  // });
  const [getUserData] = useState(JSON.parse(localStorage.getItem("UserData")));
  useEffect(() => {
    const userLoggedIn = !!localStorage.getItem("token");
    setIsLoggedIn(userLoggedIn);
    const imgElement = document.getElementById(`product-imagr-${product.id}`);
    const observer = new IntersectionObserver(
      (enteries, observer) => {
        enteries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            observer.unobserver(img);
          }
        });
      },
      { threshold: 0.1 }
    );
    if (imgElement) {
      observer.observe(imgElement);
    }
    return () => {
      if (imgElement) {
        observer.unobserve(imgElement);
      }
    };
  }, []);
  // fetch single product ,stock status and weight api integrate
  const fetchProduct = async () => {
    setLoading(true);
    // const productId = localStorage.getItem('productId')
    try {
      const response = await axios.get(
        `https://admin.bossdentindia.com/wp-json/custom/v1/product/${id}`
      );
      setProduct(response.data);
      // preload the main product image
      if (response.data.yoast_head_json?.og_image?.[0]?.url) {
        const img = new Image();
        img.src = response.data.yoast_head_json.og_image[0].url;
        // setImageUrl(img.src);
      }

      // Extract and set variations if available
      if (response.data.variations) {
        setVariations(response.data.variations);
      } else {
        setVariations([]);
      }
      // Fetch related products based on category
      if (response.data.categories && response.data.categories.length > 0) {
        const categoryId = response.data.categories[0].id;
        setCategory(response.data.categories[0].name);

        // Fetch related products in the same category
        const relatedProductsResponse = await axios.get(
          `https://admin.bossdentindia.com/wp-json/wp/v2/product?product_cat=${categoryId}&exclude=${response.data.id}&per_page=20`
        );
        const shuffledProducts = relatedProductsResponse.data.sort(
          () => 0.5 - Math.random()
        );
        const productwithDiscount = shuffledProducts.map((product) => {
          const regularPrice = parseFloat(product.regular_price);
          const salePrice = parseFloat(product.price);

          let discount = 0;
          if (regularPrice && salePrice < regularPrice) {
            discount = Math.round(
              ((regularPrice - salePrice) / regularPrice) * 100
            );
          }
          return { ...product, discount };
        });
        setRelatedProducts(productwithDiscount.slice(0, 10));
        // console.log(shuffledProducts);
      }

      const regularPrice1 = parseFloat(response.data.regular_price);
      const salePrice = parseFloat(
        response.data.sale_price || response.data.price
      );
      // if(regularPrice1)
      if (regularPrice1 && salePrice < regularPrice1) {
        const discount = ((regularPrice1 - salePrice) / regularPrice1) * 100;
        setDiscountProdcutPrice(Math.round(discount)); // Store the discount percentage in state
      } else {
        setDiscountProdcutPrice(0); // No discount
      }
      setSalePrice(salePrice);
      setRegularPrice(regularPrice1);
      // console.log(response.data.sale_price);
      // console.log(response.data.price);
      // console.log(response.data.regular_price);
      setWeight(response.data.weight);
      setStockStatus(response.data.stock_status);
    } catch (error) {
      // console.error("Error fetching product:", error);
      toast.error("Failed to fetch product details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // console.log("loca", location, id);
    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const handleUpdateqty = (e, action) => {
    e.preventDefault();
    if (action === "PLUS") {
      setQuantity((prevQuantity) => prevQuantity + 1);
    } else if (action === "MINUS" && quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const handleAttributeSelect = async (
    attribute,
    value,
    key,
    salePrice,
    RegularPrice
  ) => {
    const newSelectedAttributes = {
      ...selectedAttributes,
      [attribute]: value,
    };
    setSelectedColor(value);
    setSelectedAttributes(newSelectedAttributes);
    const selectedVariation = variations.find((variation) => {
      return Object.keys(variation.attributes).every((key) => {
        return newSelectedAttributes[key] === variation.attributes[key];
      });
    });
    const ProductDiscountPrice = (
      ((RegularPrice - salePrice) / RegularPrice) *
      100
    ).toFixed(0);
    // console.log("pro",ProductDiscountPrice)
    setDiscountProdcutPrice(Number(ProductDiscountPrice));
    // const a = ((ProductVariationPrice - salePrice) / ProductVariationPrice) * 100;
    // console.log("a",a,"salesPrice",salePrice,ProductVariationPrice);
    console.log("salePrice", salePrice, "RegularPrice", RegularPrice);
    setRegularPrice(RegularPrice);
    if (selectedVariation) {
      setSalePrice(selectedVariation.price);
    } else {
      setSalePrice(salePrice);
    }
  };

  // watchlist delete api integrate
  const handleWatchlistToggle = async (product) => {
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
            removeFromWatchlist(product.id);
            // setAlertMessage("Product removed from watchlist.");
            toast.success("Product removed from watchlist successfully.");
          })
          .catch((error) => console.log("error", error));
      } else {
        const productTitle = product.title?.rendered || "Default Title";
        const productImage = product.yoast_head_json?.og_image?.[0]?.url || "";
        await axios
          .post(
            "https://admin.bossdentindia.com/wp-json/custom/v1/wishlist/add",
            {
              user_id: getUserData.user_id,
              product_id: product.id,
              product_quantity: 1,
              product_title: productTitle,
              product_image: productImage,
              product_variations: product.variations,
              product_price: product.price,
              product_weight: weight,
              selected_attribute: selectedAttributes,
            }
          )
          .then((response) => {
            addToWatchlist(product.id, selectedAttributes);
            // setAlertMessage("Product add from watchlist.");
            toast.success("Product add into the wishlist!.");
          })
          .catch((error) => console.log("product-page-error", error));
      }
    } else {
      toast.error("Please login to add product to wishlist!");
      setTimeout(() => {
        navigate("/my-account", { state: { from: location.pathname } });
      }, 2000);
    }
    // console.log(product);
  };

  // Addtocart product and related product api integrate
  const handleAddToCart = async (e, relatedProduct) => {
    e.preventDefault();
    if (isLoggedIn) {
      if (stockStatus === "instock") {
        const userData = JSON.parse(localStorage.getItem("UserData"));
        let filterCartProduct = [];
        let GetCartProduct = [];
        let RelatedCartProduct = [];

        if (userData) {
          await axios
            .get(
              `https://admin.bossdentindia.com/wp-json/custom/v1/cart-items?user_id=${getUserData.user_id}`
            )
            .then((response) => {
              localStorage.setItem("cart", JSON.stringify(response.data));
              GetCartProduct = response.data.cart_items;
              filterCartProduct = response.data.cart_items.filter(
                (item) => Number(item.product_id) === product.id
              );
              // console.log("relatedData",relatedProduct)
              // RelatedCartProduct
              relatedProduct ? (
                <>
                  {
                    (RelatedCartProduct = response.data.cart_items.filter(
                      (item) => Number(item.product_id) === relatedProduct.id
                    ))
                  }
                </>
              ) : (
                <></>
              );
            })
            .catch((error) => console.log("error-cart", error));
          if (filterCartProduct.length === 0 && relatedProduct === undefined) {
            handleAddToCartApi(product, userData);
          } else if (relatedProduct === undefined) {
            handleUpdateCartApi(filterCartProduct, product, GetCartProduct);
          }
          // console.log("filter",RelatedCartProduct)
          if (relatedProduct !== undefined) {
            if (RelatedCartProduct.length === 0) {
              axios
                .post(
                  `https://admin.bossdentindia.com/wp-json/custom/v1/add-to-cart`,
                  {
                    user_id: userData.user_id,
                    product_id: relatedProduct.id,
                    product_quantity: quantity,
                    product_title: relatedProduct.name,
                    product_image:
                      relatedProduct.yoast_head_json.og_image[0].url,
                    product_attributes: relatedProduct.variations,
                    product_weight: relatedProduct.weight,
                    product_price: relatedProduct.price,
                    selected_attribute: selectedAttributes,
                  }
                )
                .then((res) => {
                  toast.success("Product added to cart successfully!");
                  addToCartListProduct(
                    relatedProduct.id,
                    selectedAttributes,
                    getUserData
                  );
                  // localStorage.setItem("cart_length", res.data.cart_length);
                })
                .catch((err) => console.log("err", err));
            } else {
              const UpdatedProduct = RelatedCartProduct[0].product_quantity;
              axios
                .post(
                  `https://admin.bossdentindia.com/wp-json/custom/v1/cart/update`,
                  {
                    user_id: getUserData.user_id,
                    product_id: relatedProduct.id,
                    product_quantity: Number(UpdatedProduct) + 1,
                    selected_attribute: selectedAttributes,
                  }
                )
                .then((res) => {
                  addToCartListProduct(
                    relatedProduct.id,
                    selectedAttributes,
                    getUserData
                  );
                  toast.success("Product update to cart successfully!");
                  // setAlertMessage("Product update from cart!");
                })
                .catch((err) => console.log("err", err));
            }
          }
        }
        // alert("Product added to cart!");
      } else {
        toast.info("Product is out of stock");
      }
    } else {
      toast.error("Please login to add product to cart!");
      setTimeout(() => {
        navigate("/my-account", {
          state: { from: location.pathname, productId: relatedProduct.id },
        });
      }, 2000);
    }
  };

  // product addtocart api  integrate
  const handleAddToCartApi = async (product, userData) => {
    console.log("regluarPrice", regluarPrice);
    axios
      .post(`https://admin.bossdentindia.com/wp-json/custom/v1/add-to-cart`, {
        user_id: userData.user_id,
        product_id: product.id,
        product_quantity: quantity,
        product_title: product.title.rendered,
        product_image: product.yoast_head_json.og_image[0].url,
        product_attributes: product.variations,
        product_weight: weight,
        product_price: product.price,
        selected_attribute: selectedAttributes,
      })
      .then((res) => {
        toast.success("product added to cart successfully!");
        addToCartListProduct(product.id, selectedAttributes, getUserData);
        // localStorage.setItem("cart_length", res.data.cart_length);
      })
      .catch((err) => console.log("err", err));
  };
  // product updatetocart api integarte
  const handleUpdateCartApi = async (filter, product) => {
    const UpdatedProduct = filter[0].product_quantity;
    await axios
      .post(`https://admin.bossdentindia.com/wp-json/custom/v1/cart/update`, {
        user_id: getUserData.user_id,
        product_id: product.id,
        product_quantity: Number(UpdatedProduct) + quantity,
        selected_attribute: selectedAttributes,
      })
      .then((res) => {
        addToCartListProduct(product.id, selectedAttributes, getUserData);
        toast.success("Product update to cart successfully!");
        // setAlertMessage("Product update from cart!");
      })
      .catch((err) => console.log("err", err));
  };

  return (
    <>
      {loading ? (
        <Loader1 />
      ) : (
        <div className="single-product">
          <div className="header">
            <h1 className="shop-title">Shop</h1>
            <nav className="bread-crumbs">
              <Link to="/">Home</Link>
              <i className="fa-solid fa-angle-right"></i>{" "}
              <Link to="/products">Shop</Link>{" "}
              <i className="fa-solid fa-angle-right"></i>
              <Link
                to={`/products?category=${product.categories[0].id}`}
                onMouseOver={() => {
                  return localStorage.getItem("Product_page") > 1 ? (
                    localStorage.setItem("Product_page", 1)
                  ) : (
                    <></>
                  );
                }}
              >
                {category}
              </Link>{" "}
              <i className="fa-solid fa-angle-right"></i>
              <span>{product.name}</span>
            </nav>
          </div>
          {alertMessage && <AlertSuccess message={alertMessage} />}
          <div className="single-product-main">
            <div className="single-product-img">
              <Zoom>
                {/* <div className="image-container">
                  {discountProductPrice > 0 && (
                    <div className="discount-badge">
                      {`${discountProductPrice}% off`}
                    </div>
                  )}
                </div> */}
                <img
                  // id={`product-image-${location.state.productId}`}
                  className={`single-product-img ${
                    isImageLoaded ? "loaded" : ""
                  }`}
                  src={product.yoast_head_json.og_image[0].url}
                  // src={imageUrl.replace("https://", "https://admin.")}
                  alt={product.name}
                  onLoad={() => setIsImageLoaded(true)}
                />
              </Zoom>
            </div>
            <div className="single-product-details">
              <h2 className="single-product-title">{product?.name}</h2>
              <h3 className="single-product-price align-item-center justify-contents-center">
                {/* {
                  console.log("RegularPrice",product)
                } */}
                {salePrice && regluarPrice ? (
                  <>
                    Price:&nbsp;
                    {console.log("dis", discountProductPrice)}
                    {salePrice !== regluarPrice ? (
                      <>
                        <span className="regular-price">{regluarPrice}</span>
                        <span className="sale-price">{salePrice} ₹ </span>
                        {discountProductPrice && (
                          <span
                            className="position-relative"
                            style={{ fontSize: "16px", color: "red" }}
                          >
                            ({`${discountProductPrice}% off`})
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="sale-price">{salePrice} ₹ </span>
                      </>
                    )}
                    {/* <div className=" position-relative"></div> */}
                    {/* {discountProductPrice && (
                      <div className="discount-badge">
                        {`${discountProductPrice}% off`}
                      </div>
                    )} */}
                  </>
                ) : (
                  `Price: ${product.price} ₹`
                )}
              </h3>

              {product.acf?.prese && <h4>Prese: {product.acf.preset}</h4>}
              <h4 className="single-product-cat">
                Category: <span>{category}</span>
              </h4>
              <h4 className="single-product-stock-status">
                Stock Status:{" "}
                {stockStatus === "instock" ? "In Stock" : "Out of Stock"}
              </h4>
              {/* {console.log("variations",product)} */}
              {variations.length > 0 &&
                Object.keys(variations[0]?.attributes || {}).map(
                  (attribute, index) => {
                    // Create a Set to store unique values
                    // const uniqueValues = new Set(
                    //   variations
                    //     .map((variation) => variation.attributes[attribute])
                    //     .filter((value) => value !== undefined)
                    // );
                    // console.log("unique", uniqueValues);

                    // const uniqueValuesArray = Array.from(uniqueValues);
                    return (
                      <div
                        key={attribute}
                        className="variation-main align-items-center"
                      >
                        {console.log("attribute", attribute)}
                        <h4 className="mb-0">
                          {attribute.replace(/pa_|attribute_/, "")}:
                        </h4>

                        {/* color theme */}
                        {attribute === "pa_color" || attribute === "color" ? (
                          <div style={{ display: "flex" }}>
                            {variations.map((color, index) => {
                              // console.log("color",color)
                              return (
                                <div
                                  className={`color-option ${
                                    Object.values(color.attributes)[0]
                                  } ${
                                    selectedColor ===
                                    Object.values(color.attributes)[0]
                                      ? "selected"
                                      : ""
                                  }`}
                                  key={index}
                                  onClick={() =>
                                    handleAttributeSelect(
                                      attribute,
                                      Object.values(color.attributes)[0],
                                      Object.keys(color.attributes)[0],
                                      color.sale_price,
                                      color.regular_price
                                    )
                                  }
                                ></div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="variation-buttons">
                            {variations.map((value, index) => {
                              // console.log("color", value,"pro",product);
                              return (
                                <button
                                  key={index}
                                  className={`variation-button ${
                                    selectedAttributes[attribute] ===
                                    Object.values(value.attributes)[0]
                                      ? "selected"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleAttributeSelect(
                                      attribute,
                                      Object.values(value.attributes)[0],
                                      "",
                                      value.sale_price,
                                      value.regular_price
                                    )
                                  }
                                >
                                  {Object.values(value.attributes)[0]}
                                </button>
                              );
                            })}
                            {/* {uniqueValuesArray.map((value, index) => {
                              console.log(
                                "value",
                                value,
                                uniqueValuesArray,
                                "vari",
                                variations
                              );
                              return (
                                <button
                                  key={index}
                                  className={`variation-button ${
                                    selectedAttributes[attribute] === value
                                      ? "selected"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleAttributeSelect(
                                      attribute,
                                      value,
                                      // value.sale_price,
                                      // value.regular_price
                                    )
                                  }
                                >
                                  {value}
                                </button>
                              );
                            })} */}
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              <div
                dangerouslySetInnerHTML={{
                  __html: product.short_description,
                }}
                className="single-product-pcs"
              />
              <div className="quantity-controls">
                <button
                  onClick={(e) => handleUpdateqty(e, "MINUS")}
                  className="ind-btn"
                >
                  -
                </button>
                <span className="quantity">{quantity}</span>
                <button
                  onClick={(e) => handleUpdateqty(e, "PLUS")}
                  className="ind-btn"
                >
                  +
                </button>
              </div>
              <div className="btn-icon-main">
                <div>
                  <button
                    className={`add-to-cart-btn ${
                      stockStatus === "outofstock" ? "disable-button" : ""
                    }`}
                    disabled={stockStatus !== "instock"}
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    ADD TO CART
                  </button>
                </div>
                <div>
                  <span
                    className={`like-icon ${
                      !watchlist.includes(product.id) ? "" : "inactive-heart"
                    }`}
                    onClick={() => handleWatchlistToggle(product)}
                  >
                    {watchlist.includes(product.id) ? (
                      <FaHeart />
                    ) : (
                      <FaRegHeart />
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="other-main">
            <div className="des-main">
              <nav className="product-description-nav">
                <ul>
                  <li
                    onClick={() => setActivesection("description")}
                    className={`des-title ${
                      activeSection === "description" ? "active" : ""
                    }`}
                  >
                    Description
                  </li>
                  <li
                    onClick={() => setActivesection("additional")}
                    className={`des-title ${
                      activeSection === "additional" ? "active" : ""
                    }`}
                  >
                    Additional Information
                  </li>
                  <li
                    onClick={() => setActivesection("review")}
                    className={`des-title ${
                      activeSection === "review" ? "active" : ""
                    }`}
                  >
                    Review
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          {activeSection === "description" && (
            <div
              dangerouslySetInnerHTML={{
                __html: product.description,
              }}
              className="single-product-des"
            />
          )}
          {activeSection === "additional" && (
            <div className="single-product-des">
              <p>Weight: {weight || "N/A"}gm</p>
            </div>
          )}
          {activeSection === "review" && (
            <div className="reviews-section">
              <ReviewList productId={product.id} />
              <ReviewForm productId={product.id} />
            </div>
          )}
          <div className="related-products">
            <h3 className="related-title">Related Products</h3>
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={10}
              slidesPerView={1}
              navigation
              autoplay={{
                delay: 9000, // Delay between slides in ms
                disableOnInteraction: false, // Continue autoplay after user interactions
              }}
              // centeredSlides="false"
              loop={true}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 3,
                },
                1024: {
                  slidesPerView: 4,
                },
              }}
            >
              {relatedProducts.map((relatedProduct) => {
                return (
                  <SwiperSlide key={relatedProduct.id}>
                    <div className="related-product-card">
                      <Link
                        to={`/products/${encodeURIComponent(
                          relatedProduct.slug
                        )}`}
                      >
                        <div className="image-container">
                          {relatedProduct.discount > 0 && (
                            <div className="discount-badge">
                              {`${relatedProduct.discount}% off`}
                            </div>
                          )}
                        </div>
                        <img
                          src={
                            relatedProduct.yoast_head_json?.og_image?.[0]?.url
                            // relatedImageUrl.replace("https://","https://admin.")
                          }
                          alt={relatedProduct.title?.rendered}
                        />
                        <h4 className="related-product-title">
                          {relatedProduct.title?.rendered}
                        </h4>
                        {/* <p>
                          {relatedProduct.price
                            ? `Price: ${relatedProduct.price} ₹`
                            : "Price not available"}
                        </p> */}
                        <p>
                          {relatedProduct.regular_price &&
                          relatedProduct.price ? (
                            relatedProduct.regular_price !==
                            relatedProduct.price ? (
                              // If regular_price and price are different, show both
                              <>
                                <span
                                  className="regular-price"
                                  style={{ textDecoration: "line-through" }}
                                >
                                  {relatedProduct.regular_price} ₹
                                </span>
                                <span className="sale-price">
                                  {relatedProduct.price} ₹
                                </span>
                              </>
                            ) : (
                              // If regular_price and price are the same, show only one price
                              <span className="price">
                                {relatedProduct.price} ₹
                              </span>
                            )
                          ) : (
                            // Fallback in case one of the prices is missing
                            `Price: ${relatedProduct.price} ₹`
                          )}
                        </p>
                      </Link>

                      <div className="related-icons">
                        <span
                          className={`heart-icon ${
                            !watchlist.includes(relatedProduct.id)
                              ? ""
                              : "inactive-heart"
                          }`}
                          onClick={() => handleWatchlistToggle(relatedProduct)}
                        >
                          {watchlist.includes(relatedProduct.id) ? (
                            <FaHeart />
                          ) : (
                            <FaRegHeart />
                          )}
                        </span>
                        <span
                          className="add-to-cart-icon"
                          onClick={(e) => handleAddToCart(e, relatedProduct)}
                        >
                          <FaCartPlus />
                        </span>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      )}
    </>
  );
};

export default SingleProduct;
