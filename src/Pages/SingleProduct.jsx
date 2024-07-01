import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SingleProduct = () => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(1);
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

        // Fetch category name
        if (response.data.product_cat && response.data.product_cat.length > 0) {
          const categoryResponse = await axios.get(
            `https://bossdentindia.com/wp-json/wp/v2/product_cat/${response.data.product_cat[0]}`
          );
          setCategory(categoryResponse.data.name);
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
          <img
            src={product.yoast_head_json?.og_image?.[0]?.url}
            alt={product.title?.rendered}
          />
        </div>
        <div className="single-product-details">
          <h2 className="single-product-title"> {product.title?.rendered}</h2>
          <h3 className="single-product-price">
            Price: {product.acf?.price}
          </h3>{" "}
          {/* Update this if the field path differs */}
          {product.acf?.prese && <h4>Prese: {product.acf}</h4>}
          <h4 className="single-product-cat">
            {" "}
            Category: <span> {category} </span>{" "}
          </h4>
          <div
            dangerouslySetInnerHTML={{ __html: product.excerpt?.rendered }}
            className="single-product-pcs"
          />
          <div className="quantity-controls">
            <button onClick={handleIncrease} className="ind-btn">+</button>
            <span className="quantity">{quantity}</span>
            <button onClick={handleDecrease} className="ind-btn">-</button>
          </div>
          <button className="add-to-cart-button"
            onClick={() => alert("Where to buy functionality goes here!")}
          >
            ADD TO CART
          </button>
        </div>
      </div>
      <div className="other-detail-main">
       <div className="des-main">
        <span className="des-title">Description</span>
       <div
          dangerouslySetInnerHTML={{ __html: product.content?.rendered }}
          className="single-product-des"
        />
       </div>
      </div>
    </div>
  );
};

export default SingleProduct;
