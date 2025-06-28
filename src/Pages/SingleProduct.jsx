import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "react-medium-image-zoom/dist/styles.css";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useWatchlist } from "./WatchlistContext";
import axios from "axios";
import "../css/singleproduct.css";
import ReviewList from "../component/ReviewList";
import ReviewForm from "../component/ReviewForm";
import { toast } from "react-toastify";
import Loader1 from "../component/Loader1";
import { Link } from "react-router-dom";
import ReactImageMagnify from "react-image-magnify";
import RelatedProducts from "../component/RelatedProducts";

const SingleProduct = () => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  // const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [salePrice, setSalePrice] = useState(null);
  const [regularPrice, setRegularPrice] = useState(null);
  const [variations, setVariations] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
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
  const [selectedColor, setSelectedColor] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [discountProductPrice, setDiscountProductPrice] = useState(null);
  const [largeImageLoaded, setLargeImageLoaded] = useState(false);
  const [getUserData] = useState(
    JSON.parse(sessionStorage.getItem("UserData"))
  );
  const [error, setError] = useState(null);

  useEffect(() => {
    const userLoggedIn = !!sessionStorage.getItem("token");
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

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
    handleAttributeSelect();
  }, [id]);

  // fetch single product ,stock status and weight api integrate
  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://admin.bossdentindia.com/wp-json/custom/v1/product/${id}`
      );

      setProduct(response.data);

      // Preload the main product image
      if (response.data.yoast_head_json?.og_image?.[0]?.url) {
        const img = new Image();
        img.src = response.data.yoast_head_json.og_image[0].url;
      }

      let minSalePrice = null;
      let maxSalePrice = null;

      // Extract sale price range from variations
      if (response.data.variations && response.data.variations.length > 0) {
        setVariations(response.data.variations);
        const salePrices = response.data.variations
          .map((variation) => parseFloat(variation.price))
          .filter((price) => !isNaN(price) && price > 0);
        if (salePrices.length > 0) {
          minSalePrice = Math.min(...salePrices);
          maxSalePrice = Math.max(...salePrices);
        } else {
          console.warn("No valid sale prices found.");
        }
      }

      if (response.data.variations === null) {
        setVariations([]);
      }

      // Fallback to main product price if variations are missing or incorrect
      if (minSalePrice === null || maxSalePrice === null) {
        minSalePrice = parseFloat(response.data.price) || 0;
        maxSalePrice = parseFloat(response.data.price) || minSalePrice;
      }

      // console.log("maxSalePrice",maxSalePrice)
      setSalePrice(minSalePrice);
      setRegularPrice(maxSalePrice);

      // Fetch related products
      if (response.data.categories && response.data.categories.length > 0) {
        const categoryId = response.data.categories[0].id;
        setCategory(response.data.categories[0].name);

        const relatedProductsResponse = await axios.get(
          `https://admin.bossdentindia.com/wp-json/wp/v2/product?product_cat=${categoryId}&exclude=${response.data.id}&per_page=20`
        );

        const shuffledProducts = relatedProductsResponse.data.sort(
          () => 0.5 - Math.random()
        );
        const productWithDiscount = shuffledProducts.map((product) => {
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
        setRelatedProducts(productWithDiscount.slice(0, 10));
      }
      setWeight(response.data.weight);
      setStockStatus(response.data.stock_status);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to fetch product details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const img = new Image();
    img.src = product.yoast_head_json?.og_image?.[0]?.url || "";
    img.onload = () => setLargeImageLoaded(true);
  }, [product]);

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
    keys,
    salePrice,
    RegularPrice
  ) => {
    // console.log("attribute",attribute,value,keys,salePrice,RegularPrice)
    if (attribute && value) {
      const newSelectedAttributes = {
        ...selectedAttributes,
        [attribute]: value,
      };
      setError("");
      setSelectedAttributes(newSelectedAttributes);

      const selectedVariation = variations.find((variation) => {
        // console.log("va", Object.keys(variation.attributes));
        return Object.keys(variation.attributes).every((key) => {
          // console.log("select", newSelectedAttributes[key], variation.attributes[key]);
          return newSelectedAttributes[key] === variation.attributes[key];
        });
      });
      setProduct({ ...product, price: selectedVariation.price });
      // console.log("selesct",selectedVariation)
      if (selectedVariation) {
        setSalePrice(selectedVariation.price);
        setRegularPrice(null);
      } else {
        setSalePrice(salePrice);
        setRegularPrice(RegularPrice);
      }
    } else {
      setSelectedAttributes(value);
    }
    setSelectedColor(value);
    // console.log("v++++++",value)

    // console.log("attr",attribute,value,salePrice,RegularPrice)

    // sessionStorage.setItem('selectAttributes',JSON.stringify(newSelectedAttributes))
    // console.log("variations", selectedVariation)

    // discount code
    // const ProductDiscountPrice = (
    //   ((RegularPrice - salePrice) / RegularPrice) *
    //   100
    // ).toFixed(0);
    // setDiscountProductPrice(Number(ProductDiscountPrice));
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
            toast.success("Product removed from watchlist successfully.");
          })
          .catch((error) => console.log("error", error));
      } else {
        const productTitle = product?.name || "Default Title";
        const productImage = product.yoast_head_json?.og_image?.[0]?.url || "";
        // let ProductPrice = selectedAttributes === undefined ? product.variations.map((price)=>price.price) : product.price
        // console.log("select",product,selectedAttributes)
        // if(selectedAttributes === undefined){
        //   // console.log("pro",product.variations.Object.values())
        //     ProductPrice =
        // }else{
        //   ProductPrice = ;
        // }
        // console.log("ProductPrice",ProductPrice)
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
  };
  // Addtocart product and related product api integrate
  const handleAddToCart = async (e, relatedProduct) => {
    e.preventDefault();
    if (isLoggedIn) {
      if (stockStatus === "instock") {
        const userData = JSON.parse(sessionStorage.getItem("UserData"));
        let filterCartProduct = [];
        let GetCartProduct = [];
        let RelatedCartProduct = [];

        if (userData) {
          await axios
            .get(
              `https://admin.bossdentindia.com/wp-json/custom/v1/cart-items?user_id=${getUserData.user_id}`
            )
            .then((response) => {
              sessionStorage.setItem("cart", JSON.stringify(response.data));
              GetCartProduct = response.data.cart_items;
              filterCartProduct = response.data.cart_items.filter(
                (item) => Number(item.product_id) === product.id
              );
              // RelatedCartProduct
              relatedProduct ? (
                <>
                  {
                    (RelatedCartProduct = response.data.cart_items.filter(
                      (item) => {
                        if (variations.length > 0) {
                          if (selectedAttributes !== undefined) {
                            setError("");
                            return (
                              Object.values(item.selected_attribute)[0] ===
                              Object.values(selectedAttributes)[0]
                            );
                          } else {
                            setError("Please select variations");
                          }
                        } else {
                          return Number(item.product_id) === relatedProduct.id;
                        }
                      }
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
            console.warn("update");
            handleUpdateCartApi(filterCartProduct, product, GetCartProduct);
          }
          if (relatedProduct !== undefined) {
            if (RelatedCartProduct.length === 0) {
              if (relatedProduct.variations !== null) {
                if (selectedAttributes) {
                  axios
                    .post(
                      `https://admin.bossdentindia.com/wp-json/custom/v1/add-to-cart`,
                      {
                        user_id: userData.user_id,
                        product_id: relatedProduct.id,
                        category_id: [relatedProduct.categories[0].id],
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
                        res.data.cart_id,
                        selectedAttributes,
                        getUserData
                      );
                    })
                    .catch((err) => console.log("err", err));
                } else {
                  setError(`please select variations`);
                }
              } else {
                axios
                  .post(
                    `https://admin.bossdentindia.com/wp-json/custom/v1/add-to-cart`,
                    {
                      user_id: userData.user_id,
                      product_id: relatedProduct.id,
                      category_id: [relatedProduct.categories[0].id],
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
                      res.data.cart_id,
                      selectedAttributes,
                      getUserData
                    );
                  })
                  .catch((err) => console.log("err", err));
              }
            } else {
              const UpdatedProduct = RelatedCartProduct[0].product_quantity;
              axios
                .post(
                  `https://admin.bossdentindia.com/wp-json/custom/v1/cart/update`,
                  {
                     user_id: getUserData.user_id,
                      category_id: [relatedProduct.categories[0].id],
                      product_id: relatedProduct.id,
                      product_quantity: Number(UpdatedProduct) + 1,
                      selected_attribute: selectedAttributes,
                      cart_id:RelatedCartProduct[0].id
                  }
                )
                .then((res) => {
                  // console.log("resUpdate", res, relatedProduct);
                  addToCartListProduct(
                    res.data.cart_id,
                    selectedAttributes,
                    getUserData
                  );
                  toast.success("Product update to cart successfully!");
                })
                .catch((err) => console.log("err", err));
            }
          }
        }
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
    axios
      .post(`https://admin.bossdentindia.com/wp-json/custom/v1/add-to-cart`, {
        user_id: userData.user_id,
        // product_id: product.id,
        // category_id:product.categories[0].id,
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
        addToCartListProduct(res.data.cart_id, selectedAttributes, getUserData);
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
        category_id: product.categories[0].id,
        product_quantity: Number(UpdatedProduct) + quantity,
        selected_attribute: selectedAttributes,
        cart_id: UpdatedProduct.id,
      })
      .then((res) => {
        addToCartListProduct(res.data.cart_id, selectedAttributes, getUserData);
        toast.success("Product update to cart successfully!");
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
            <h1 className="shop-title">Products</h1>
            <nav className="bread-crumbs">
              <Link to="/">Home</Link>
              <i className="fa-solid fa-angle-right"></i>
              <Link to="/products">Products</Link>
              <i className="fa-solid fa-angle-right"></i>
              <Link
                to={`/products?category=${product.categories[0].id}`}
                onMouseOver={() => {
                  return sessionStorage.getItem("Product_page") > 1 ? (
                    sessionStorage.setItem("Product_page", 1)
                  ) : (
                    <></>
                  );
                }}
              >
                {category}
              </Link>
              <i className="fa-solid fa-angle-right"></i>
              <span>{product.name}</span>
            </nav>
          </div>
          <div className="single-product-main">
            <div className="single-product-img">
              {/* <Zoom> */}
              {/* <div className="image-container">
                  {discountProductPrice > 0 && (
                    <div className="discount-badge">
                      {`${discountProductPrice}% off`}
                    </div>
                  )}
                </div> */}
              {/* <img
                  id={`product-image-${location.state.productId}`}
                  className={`single-product-img ${
                    isImageLoaded ? "loaded" : ""
                  }`}
                  src={product.yoast_head_json.og_image[0].url}
                  src={imageUrl.replace("https://", "https://admin.")}
                  alt={product.name}
                  onLoad={() => setIsImageLoaded(true)}
                />
              </Zoom> */}

              {largeImageLoaded ? (
                <ReactImageMagnify
                  {...{
                    smallImage: {
                      alt: product.name,
                      isFluidWidth: true,
                      className: "rounded",
                      src: product.yoast_head_json?.og_image?.[0]?.url || "",
                    },
                    largeImage: {
                      src: product.yoast_head_json?.og_image?.[0]?.url || "",
                      width: 1200,
                      height: 1600,
                    },
                    imageAlt: product.name,
                    enlargedImageContainerDimensions: {
                      width: "100%",
                      height: "100%",
                    },
                    enlargedImageContainerStyle: {
                      position: window.innerWidth < 768 ? "static" : "absolute",
                      zIndex: 9,
                      marginTop: window.innerWidth < 768 ? "20px" : "0",
                    },
                  }}
                />
              ) : (
                <p>
                  <Loader1 />
                </p>
              )}
            </div>
            <div className="single-product-details">
              <h2 className="single-product-title">{product?.name}</h2>
              <h3 className="single-product-price align-item-center justify-contents-center">
                {/* {console.log("variat", variations,selectedAttributes)} */}
                {variations.length > 0 ? (
                  <>
                    <span className="sale-price">
                      ₹{salePrice}
                      {selectedAttributes === undefined ? (
                        <>- ₹{regularPrice}</>
                      ) : (
                        <></>
                      )}
                    </span>
                  </>
                ) : (
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
                      `Price: ₹${product.price}`
                    )}
                  </>
                )}
              </h3>

              {product.acf?.prese && <h4>Prese: {product.acf.preset}</h4>}
              <h4 className="single-product-cat">
                Category: <span>{category}</span>
              </h4>
              <h4 className="single-product-stock-status">
                Stock Status:{" "}
                <span>
                  {stockStatus === "instock" ? "In Stock" : "Out of Stock"}
                </span>
              </h4>
              {/* {console.log("variations",variations)} */}
              {variations.length > 0 &&
                Object.keys(variations[0]?.attributes || {}).map(
                  (attribute, index) => {
                    return (
                      <div
                        key={attribute}
                        className="variation-main align-items-center"
                      >
                        <h4 className="mb-0">
                          {attribute.replace(/pa_|attribute_/, "")}:
                        </h4>

                        {/* color theme */}
                        {attribute === "pa_color" || attribute === "color" ? (
                          <div style={{ display: "flex" }}>
                            {variations.map((color, index) => {
                              // {console.log("value",color,selectedAttributes)}
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
                              // console.log("value---",selectedAttributes,Object.values(value.attributes)[0])
                              return (
                                <button
                                  key={index}
                                  className={`variation-button ${
                                    Object.values(value.attributes)[0]
                                  }
                                  ${
                                    selectedAttributes !== undefined &&
                                    selectedAttributes !== null
                                      ? Object.values(selectedAttributes)[0] ===
                                        Object.values(value.attributes)[0]
                                        ? "selected"
                                        : ""
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleAttributeSelect(
                                      attribute,
                                      Object.values(value.attributes)[0],
                                      Object.keys(value.attributes)[0],
                                      value.sale_price,
                                      value.regular_price
                                    )
                                  }
                                >
                                  {Object.values(value.attributes)[0]}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              {error !== null && <span className="text-danger">{error}</span>}
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
          <RelatedProducts
            relatedProducts={relatedProducts}
            watchlist={watchlist}
            handleWatchlistToggle={handleWatchlistToggle}
            handleAddToCart={handleAddToCart}
          />
        </div>
      )}
    </>
  );
};

export default SingleProduct;
