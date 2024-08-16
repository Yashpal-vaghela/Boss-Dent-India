import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useWatchlist } from "./WatchlistContext";
import axios from "axios";
import { useCart } from "./AddCartContext";
import Loader from "../component/Loader";
import "../css/productview.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay,  Navigation } from "swiper/modules";


const SingleProduct = () => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [salePrice, setSalePrice] = useState(null);
  const [variations, setVariations] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [stockStatus, setStockStatus] = useState('unknown');
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { addToCart } = useCart();
  const { id } = useParams();

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
            `https://bossdentindia.com/wp-json/wp/v2/product?exclude=${id}&per_page=20`
          );
          const shuffledProducts = relatedProductsResponse.data.sort(
            () => 0.5 - Math.random()
          );
          setRelatedProducts(shuffledProducts.slice(0,10));
        }

        // Determine sale price
        if (response.data.sale_price) {
          setSalePrice(response.data.sale_price);
        } else {
          setSalePrice(response.data.price);
        }
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

  const handleAddToCart = () => {
     addToCart({ ...product, quantity }); 
     alert("Product added to cart!");
    
  };
  console.log(stockStatus);
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="single-product">
      <div className="header">
        <h1 className="shop-title">Shop</h1>
        <nav>
          <a href="/">Home</a> &gt; <a href="/products">Shop</a> &gt;{" "}
          <a href={`/category/${category}`}>{category}</a> &gt;{" "}
          <span>{product.title?.rendered}</span>
        </nav>
      </div>
      <div className="single-product-main">
        <div className="single-product-img">
          {imageLoading ? (
            <Loader />
          ) : (
            <Zoom>
              <img
                src={product.yoast_head_json?.og_image?.[0]?.url}
                alt={product.title?.rendered}
              />
            </Zoom>
          )}
        </div>
        <div className="single-product-details">
          <h2 className="single-product-title">{product.title?.rendered}</h2>
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
            {stockStatus === "in_stock" || stockStatus === "instock" ? "In Stock" : "Out of Stock"}
          </h4>
          {variations.length > 0 &&
            Object.keys(variations[0]?.attributes || {}).map((attribute) => (
              <div key={attribute} className="variation-main">
                <h4>{attribute.replace(/attribute_pa_|attribute_/, "")}:</h4>
                <div className="variation-buttons">
                  {variations
                    .filter(
                      (variation) =>
                        variation.attributes[attribute] !== undefined
                    )
                    .map((variation, index) => (
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
                            variation.attributes[attribute]
                          )
                        }
                      >
                        {variation.attributes[attribute]}
                      </button>
                    ))}
                </div>
              </div>
            ))}

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
              <button className={`add-to-cart-btn ${stockStatus === "outofstock" ? "disable-button" : ""}`}
                disabled={stockStatus !== 'instock'}
                onClick={handleAddToCart}
              >
                ADD TO CART
              </button>
            </div>
            <div>
              <span className={`like-icon ${!watchlist.includes(product.id) ? "" : "inactive-heart"}`} 
                onClick={handleWatchlistToggle}
              >
                {watchlist.includes(product.id) ? <FaHeart /> : <FaRegHeart />}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="other-detail-main">
        <div className="des-main">
          <span className="des-title">Description</span>
          <div
            dangerouslySetInnerHTML={{
              __html: product.content?.rendered,
            }}
            className="single-product-des"
          />
        </div>
      </div>
      <div className="related-products">
        <h3 className="related-title">Related Products</h3>
        <Swiper
          modules={[Navigation,Autoplay]}
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
                  <p>{relatedProduct.price ? `Price: ${relatedProduct.price}` : "Price not available"}</p>
                </a>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default SingleProduct;
