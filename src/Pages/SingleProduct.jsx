import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useWatchlist } from "./WatchlistContext";
import axios from "axios";
import Loader from "../component/Loader";
import "../css/productview.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { FaCartPlus } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Add, updateSize } from "../redux/Apislice/cartslice";
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";
import AlertSuccess from "../component/AlertSuccess";
import { toast } from "react-toastify";
import ColorOption from "../component/ColorOption";

const SingleProduct = () => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [salePrice, setSalePrice] = useState(null);
  const [variations, setVariations] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [stockStatus, setStockStatus] = useState("unknown");
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [weight, setWeight] = useState(null);
  const [activeSection, setActivesection] = useState("description");
  const { id } = useParams();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const colors = [
    {
      blue: "#3385fc",
    },
    {
      green: "#22EDF7",
    },
    {
      orange: "#F66006",
    },
    {
      "pink-meltblown": "#FF3C76",
    },
    {
      "purple-meltblown": "#560587",
    },
    {
      black: "#000",
    },
    {
      yellow: "#FFFF00",
    },
    {
      "white-meltblown": "#fff",
    },
  ];
  // console.log(token);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://bossdentindia.com/wp-json/wp/v2/product/${id}`
        );
        setProduct(response.data);

        // preload the main product image
        if (response.data.yoast_head_json?.og_image?.[0]?.url) {
          const img = new Image();
          img.src = response.data.yoast_head_json.og_image[0].url;
          img.onload = () => setImageLoading(false);
        } else {
          setImageLoading(false);
        }

        // Extract and set variations if available
        if (response.data.variations) {
          setVariations(response.data.variations);
        }

        // Fetch related products based on category
        if (response.data.product_cat && response.data.product_cat.length > 0) {
          const categoryId = response.data.product_cat[0];
          const categoryResponse = await axios.get(
            `https://bossdentindia.com/wp-json/wp/v2/product_cat/${categoryId}`
          );
          setCategory(categoryResponse.data.name);

          // Fetch related products in the same category
          const relatedProductsResponse = await axios.get(
            `https://bossdentindia.com/wp-json/wp/v2/product?product_cat=${categoryId}&exclude=${id}&per_page=20`
          );
          const shuffledProducts = relatedProductsResponse.data.sort(
            () => 0.5 - Math.random()
          );
          // const a = relatedProductsResponse.data.filter((item)=>console.log("filterdara",item.title))
          setRelatedProducts(shuffledProducts.slice(0, 10));
        }
        // Determine sale price
        // if (response.data.sale_price) {
        //   setSalePrice(response.data.sale_price);
        // } else {
        //   setSalePrice(response.data.price);
        // }
        setSalePrice(response.data.sale_price || response.data.price);
        const weightData = await axios.get(
          `https://bossdentindia.com/wp-json/custom/v1/product-weight/${id}`
        );
        setWeight(weightData.data.weight);
        try {
          const stockResponse = await axios.get(
            `https://bossdentindia.com/wp-json/custom/v1/stock-status/${id}`
          );
          setStockStatus(stockResponse.data.stock_status);
        } catch (stockError) {
          console.error("Error fetching stock status:", stockError);
          setStockStatus("Error fetching stock status");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to fetch product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const imgElement = document.getElementById(`product-imagr-${id}`);

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
  }, [id]);

  const handleIncrease = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrease = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleAttributeSelect = (attribute, value) => {
    const newSelectedAttributes = {
      ...selectedAttributes,
      [attribute]: value,
    };
    dispatch(updateSize({ ...product, selectedAttributes }));
    setSelectedAttributes(newSelectedAttributes);

    const selectedVariation = variations.find((variation) => {
      return Object.keys(variation.attributes).every((key) => {
        return newSelectedAttributes[key] === variation.attributes[key];
      });
    });

    if (selectedVariation) {
      setSalePrice(selectedVariation.price);
    }
  };

  const handleWatchlistToggle = () => {
    if (watchlist.includes(product.id)) {
      removeFromWatchlist(product.id);
    } else {
      addToWatchlist(product.id);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (stockStatus === "instock") {
      // console.log("s", quantity, selectedAttributes);
      // addToCart({ ...product, quantity, selectedAttributes });
      dispatch(
        Add({ ...product, qty: quantity, selectedAttributes, weight: weight })
      );
      setAlertMessage("Product added to cart!");
      // alert("Product added to cart!");
    } else {
      toast.info("Product is out of stock");
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        { error }
      ) : (
        <div className="single-product">
          <div className="header">
            <h1 className="shop-title">Shop</h1>
            <nav>
              <a href="/">Home</a> &gt; <a href="/products">Shop</a> &gt;{" "}
              <a href={`/category/${category}`}>{category}</a> &gt;{" "}
              <span>{product.title?.rendered}</span>
            </nav>
          </div>
          {alertMessage && <AlertSuccess message={alertMessage} />}
          <div className="single-product-main">
            <div className="single-product-img">
              <Zoom>
                <img
                  id={`product-image-${id}`}
                  className={`single-product-img ${
                    isImageLoaded ? "loaded" : ""
                  }`}
                  src={product.yoast_head_json?.og_image?.[0]?.url}
                  alt={product.title?.rendered}
                  onLoad={() => setIsImageLoaded(true)}
                />
              </Zoom>
            </div>
            <div className="single-product-details">
              <h2 className="single-product-title">
                {product.title?.rendered}
              </h2>
              <h3 className="single-product-price">
                {salePrice
                  ? `Sale Price: ${salePrice} ₹`
                  : `Price: ${product.acf?.price} ₹`}
              </h3>
              {product.acf?.prese && <h4>Prese: {product.acf.preset}</h4>}
              <h4 className="single-product-cat">
                Category: <span>{category}</span>
              </h4>
              <h4 className="single-product-stock-status">
                Stock Status:{" "}
                {stockStatus === "instock" ? "In Stock" : "Out of Stock"}
              </h4>
              {variations.length > 0 &&
                Object.keys(variations[0]?.attributes || {}).map(
                  (attribute, index) => {
                    // Create a Set to store unique values
                    const uniqueValues = new Set(
                      variations
                        .map((variation) => variation.attributes[attribute])
                        .filter((value) => value !== undefined)
                    );
                    const uniqueValuesArray = Array.from(uniqueValues);

                    return (
                      <div
                        key={attribute}
                        className="variation-main align-items-center"
                      >
                        <h4 className="mb-0">
                          {attribute.replace(/attribute_pa_|attribute_/, "")}:
                        </h4>
                        {/* color theme */}
                        <div style={{ display: "flex" }}>
                          {colors.map((color, index) => {
                            console.log(
                              color,
                              Object.keys(selectedAttributes)[0]
                            );
                            return (
                              <ColorOption
                                key={index}
                                color={color}
                                onClick={setSelectedColor}
                                isSelected={selectedColor === color}
                              />
                            );
                          })}
                        </div>

                        {index === 1 ? ( // Only for the second attribute (index 1)
                          uniqueValuesArray.length > 1 ? (
                            // Render dropdown for the second attribute with more than one unique value
                            <select
                              value={selectedAttributes[attribute] || ""}
                              onChange={(e) =>
                                handleAttributeSelect(attribute, e.target.value)
                              }
                            >
                              <option value="">
                                Select{" "}
                                {attribute.replace(
                                  /attribute_pa_|attribute_/,
                                  ""
                                )}
                              </option>
                              {uniqueValuesArray.map((value, index) => (
                                <option key={index} value={value}>
                                  {value}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <div className="variation-buttons">
                              {uniqueValuesArray.map((value, index) => (
                                <button
                                  key={index}
                                  className={`variation-button ${
                                    selectedAttributes[attribute] === value
                                      ? "selected"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleAttributeSelect(attribute, value)
                                  }
                                >
                                  {value}
                                </button>
                              ))}
                            </div>
                          )
                        ) : (
                          <div className="variation-buttons">
                            {uniqueValuesArray.map((value, index) => (
                              <button
                                key={index}
                                className={`variation-button ${
                                  selectedAttributes[attribute] === value
                                    ? "selected"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleAttributeSelect(attribute, value)
                                }
                              >
                                {value}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              <div
                dangerouslySetInnerHTML={{
                  __html: product.excerpt?.rendered,
                }}
                className="single-product-pcs"
              />
              <div className="quantity-controls">
                <button onClick={handleIncrease} className="ind-btn">
                  +
                </button>

                <span className="quantity">{quantity}</span>
                <button onClick={handleDecrease} className="ind-btn">
                  -
                </button>
              </div>
              <div className="btn-icon-main">
                <div>
                  <button
                    className={`add-to-cart-btn ${
                      stockStatus === "outofstock" ? "disable-button" : ""
                    }`}
                    disabled={stockStatus !== "instock"}
                    onClick={(e) => handleAddToCart(e)}
                  >
                    ADD TO CART
                  </button>
                </div>
                <div>
                  <span
                    className={`like-icon ${
                      !watchlist.includes(product.id) ? "" : "inactive-heart"
                    }`}
                    onClick={handleWatchlistToggle}
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
                __html: product.content?.rendered,
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
              <ReviewList productId={id} />
              <ReviewForm productId={id} />
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
                delay: 2000, // Delay between slides in ms
                disableOnInteraction: false, // Continue autoplay after user interactions
              }}
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
              {relatedProducts.map((relatedProduct) => (
                <SwiperSlide key={relatedProduct.id}>
                  <div className="related-product-card">
                    <a href={`/products/${relatedProduct.id}`}>
                      <img
                        src={relatedProduct.yoast_head_json?.og_image?.[0]?.url}
                        alt={relatedProduct.title?.rendered}
                      />
                      <h4>{relatedProduct.title?.rendered}</h4>
                      <p>
                        {relatedProduct.price
                          ? `Price: ${relatedProduct.price} ₹`
                          : "Price not available"}
                      </p>
                    </a>
                    <div className="related-icons">
                      <span
                        className={`heart-icon ${
                          !watchlist.includes(relatedProduct.id)
                            ? ""
                            : "inactive-heart"
                        }`}
                        onClick={() => addToWatchlist(relatedProduct.id)}
                      >
                        {watchlist.includes(relatedProduct.id) ? (
                          <FaHeart />
                        ) : (
                          <FaRegHeart />
                        )}
                      </span>
                      <span
                        className="add-to-cart-icon"
                        onClick={
                          () =>
                            dispatch(
                              Add({
                                ...product,
                                qty: quantity,
                                selectedAttributes,
                              })
                            )
                          // dispatch(Add({...relatedProduct,qty:1}))
                          // addToCart({ ...relatedProduct, quantity: 1 })
                        }
                      >
                        <FaCartPlus />
                      </span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </>
  );
};

export default SingleProduct;
