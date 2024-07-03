import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { FaRegHeart, FaHeart } from "react-icons/fa";

const SingleProduct = () => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [salePrice, setSalePrice] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [variations, setVariations] = useState([]);
  const [selectedVariation, setSelectedVariation] = useState(null);
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

  const handleVariationSelect = (variation) => {
    setSelectedVariation(variation);
    // Ensure variation and its attributes are defined before setting salePrice
    if (variation && variation.attributes) {
      setSalePrice(variation.price);
    }
  };

  const handleWatchlistToggle = () => {
    if (watchlist.includes(product.id)) {
      setWatchlist(watchlist.filter((itemId) => itemId !== product.id));
    } else {
      setWatchlist([...watchlist, product.id]);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
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
              // style={{ width: '100%' }}
            />
          </Zoom>
        </div>
        <div className="single-product-details">
          <h2 className="single-product-title">{product.title?.rendered}</h2>
          <h3 className="single-product-price">
            {salePrice
              ? `Sale Price: ${salePrice}`
              : `Price: ${product.acf?.price}`}
          </h3>{" "}
          {/* Update this if the field path differs */}
          {product.acf?.prese && <h4>Prese: {product.acf}</h4>}
          <h4 className="single-product-cat">
            {" "}
            Category: <span> {category} </span>{" "}
          </h4>
          <div className="variation-main">
            {variations.length > 0 &&
              Object.keys(variations[0]?.attributes || {}).map(
                (attributekey) => (
                  <h4 key={attributekey}>
                    {attributekey.replace(
                      /attribute_pa_|attribute_/,
                      ""
                    )}
                    :
                  </h4>
                )
              )}
            <div className="variation-buttons">
              {variations.map((variation, index) => (
                <button
                  key={index}
                  className={`variation-button ${
                    selectedVariation === variation ? "selected" : ""
                  }`}
                  onClick={() => handleVariationSelect(variation)}
                >
                  {variation &&
                    variation.attributes &&
                    Object.keys(variation.attributes).map(
                      (attributekey) => (
                        <span key={attributekey}>
                          {variation.attributes[attributekey]}
                        </span>
                      )
                    )}
                </button>
              ))}
            </div>
          </div>
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
                onClick={() =>
                  alert("Where to buy functionality goes here!")
                }
                disabled={!selectedVariation}
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
