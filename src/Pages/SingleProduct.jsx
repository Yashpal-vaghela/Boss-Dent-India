// SingleProduct.js
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useWatchlist } from "./WatchlistContext";
import axios from "axios";
import { useCart } from "./AddCartContext";
import Loader from "../component/Loader";

const SingleProduct = () => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [salePrice, setSalePrice] = useState(null);
  const [variations, setVariations] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
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
        console.log(response.data);
        setProduct(response.data);

        // Extract and set variations if available
        if (response.data.variations) {
          setVariations(response.data.variations);
        }

        // Fetch category name if product_cat is available
        if (
          response.data.product_cat &&
          response.data.product_cat.length > 0
        ) {
          const categoryId = response.data.product_cat[0];
          const categoryResponse = await axios.get(
            `https://bossdentindia.com/wp-json/wp/v2/product_cat/${categoryId}`
          );
          setCategory(categoryResponse.data.name);
        }

        // Determine sale price
        if (response.data.sale_price) {
          setSalePrice(response.data.sale_price);
        } else {
          setSalePrice(response.data.price);
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
    addToCart && addToCart({ ...product, quantity });
    alert("Product added to cart!");
    // alert("Product added to cart!");
  };

  if (loading) {
    return 
    <div>
      <div>
          <Loader/>
      </div>
    </div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="single-product">
      <div className="single-product-main">
        <div className="single-product-img">
          <Zoom>
            <img
              src={product.yoast_head_json?.og_image?.[0]?.url}
              alt={product.title?.rendered}
            />
          </Zoom>
        </div>
        <div className="single-product-details">
          <h2 className="single-product-title">{product.title?.rendered}</h2>
          <h3 className="single-product-price">
            {salePrice
              ? `Sale Price: ${salePrice}`
              : `Price: ${product.acf?.price}`}
          </h3>
          {product.acf?.prese && <h4>Prese: {product.acf.preset}</h4>}
          <h4 className="single-product-cat">
            Category: <span>{category}</span>
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
                        className={`variation-button ${selectedAttributes[attribute] ===
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
              <button
                className="add-to-cart-button"
                onClick={handleAddToCart}
              >
                ADD TO CART
              </button>
            </div>
            <div>
              <span className="like-icon" onClick={handleWatchlistToggle}>
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
    </div>
  );
};

export default SingleProduct;
