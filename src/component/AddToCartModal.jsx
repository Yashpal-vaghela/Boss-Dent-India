import React, { useState, useEffect } from "react";
import "../css/AddToCartModal.css";

export const AddToCartModal = ({ isOpen, onClose, product, stockStatus, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [salePrice, setSalePrice] = useState(null);
  const [regularPrice, setRegularPrice] = useState(null);
  const [variations, setVariations] = useState([]);
  const [shakeVariation, setShakeVariation] = useState(false);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const [discountPercentage, setDiscountPercentage] = useState(null);
  const [categoryName, setCategoryName] = useState("Unknown");
  const [productData, setProductData] = useState(null);

  const calculateDiscount = (sale, regular) => {    
    if (
      !isNaN(sale) &&
      !isNaN(regular) &&
      sale > 0 &&
      regular > 0 &&
      sale < regular
    ) {
      return Math.round(((regular - sale) / regular) * 100);
    }
    return null;
  };

  //  Load product info on modal open
  useEffect(() => {
    if (isOpen && product) {
      setQuantity(1);
      setSelectedAttributes({});
      const defaultSale = parseFloat(product?.sale_price || product?.price || 0);
      const defaultRegular = parseFloat(product?.regular_price || product?.price || 0);
      setSalePrice(defaultSale);
      setRegularPrice(defaultRegular);
      setDiscountPercentage(calculateDiscount(defaultSale, defaultRegular));
      setVariations(product?.variations || []);
      setCategoryName("Unknown");
      setIsCategoryLoading(true);

      // Fetch category name
      const categoryId = product.product_cat;
      if (categoryId) {
        //fetch(`https://admin.bossdentindia.com/wp-json/wp/v2/product_cat/${categoryId}`)
        fetch(`https://admin.bossdentindia.com/wp-json/custom/v1/product/${product.slug}`)
          .then((res) => res.json())
          .then((data) => {
            setProductData(data);         
            setCategoryName(data.categories[0].name);
            setIsCategoryLoading(false);
          })
          .catch(() => setIsCategoryLoading(false));
      } else {
        setIsCategoryLoading(false);
      }
    }
  }, [isOpen, product]);

  // Handle attribute selection
  const handleAttributeSelect = async (attrKey, value) => {
  const updatedAttributes = { ...selectedAttributes, [attrKey]: value };
  setSelectedAttributes(updatedAttributes);

  try {
    const variationsFromAPI = productData.variations || [];

    //  Match selected variation from fetched data
    const matchedVariation = variationsFromAPI.find((variation) => {
      const normalized = Object.fromEntries(
        Object.entries(variation.attributes || {}).map(([key, val]) => [
          key.replace(/^attribute_pa_|^pa_|^attribute_/, "").toLowerCase(),
          val,
        ])
      );
      return Object.entries(normalized).every(
        ([key, val]) => updatedAttributes[key] === val
      );
    });

    if (matchedVariation) {
      const selectedSale = parseFloat(matchedVariation.sale_price || matchedVariation.price);
      const selectedRegular = parseFloat(matchedVariation.regular_price || matchedVariation.price);

      setSalePrice(selectedSale);
      setRegularPrice(selectedRegular);
      setDiscountPercentage(calculateDiscount(selectedSale, selectedRegular));
    } else {
      // fallback if no match
      const fallbackSale = parseFloat(product?.sale_price || product?.price || 0);
      const fallbackRegular = parseFloat(product?.regular_price || product?.price || 0);
      setSalePrice(fallbackSale);
      setRegularPrice(fallbackRegular);
      setDiscountPercentage(calculateDiscount(fallbackSale, fallbackRegular));
    }
  } catch (err) {
    console.error("Failed to fetch updated variation info:", err);

    // fallback if fetch fails
    const fallbackSale = parseFloat(product?.sale_price || product?.price || 0);
    const fallbackRegular = parseFloat(product?.regular_price || product?.price || 0);
    setSalePrice(fallbackSale);
    setRegularPrice(fallbackRegular);
    setDiscountPercentage(calculateDiscount(fallbackSale, fallbackRegular));
  }
};


  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const imageUrl =
    product?.yoast_head_json?.og_image?.[0]?.url ||
    product?.better_featured_image?.source_url ||
    "";

  if (!isOpen || !product || isCategoryLoading) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="modal-content">
          <div className="modal-image">
            <img src={imageUrl} alt={product.name || "Product"} />
          </div>

          <div className="modal-details">
            <h2 className="modal-title">{product.title?.rendered || product.name}</h2>
              <div className="modal-category-row">
              <p className="modal-category">Category: {categoryName}</p>
              {discountPercentage && (
                <span className="discount-modal-badge">
                  ({discountPercentage}% off)
                </span>
              )}
            </div>
            <p className={`modal-stock ${stockStatus === "instock" ? "instock" : "outstock"}`}>
              {stockStatus === "instock" ? "In Stock" : "Out of Stock"}
            </p>

            <div className="modal-price">
              {regularPrice && salePrice && Number(salePrice) < Number(regularPrice) ? (
                <>
                  <span className="label-text">Price:</span>
                  <span className="price-sale">₹{Number(salePrice).toFixed(2)}</span>
                  <span className="price-strike">₹{Number(regularPrice).toFixed(2)}</span>
                </>
              ) : regularPrice ? (
                <span className="price-regular">Price: <b>₹{Number(regularPrice).toFixed(2)}</b></span>
              ) : salePrice ? (
                <span className="price-sale">₹{Number(salePrice).toFixed(2)}</span>
              ) : (
                <span className="price-regular">Price: ₹{Number(product?.price || 0).toFixed(2)}</span>
              )}
            </div>  


            {variations.length > 0 &&
              Object.keys(variations[0]?.attributes || {}).map((rawAttrKey) => {
                const attrKey = rawAttrKey.replace(/^attribute_pa_|^pa_|^attribute_/, "").toLowerCase();
                const label = attrKey.charAt(0).toUpperCase() + attrKey.slice(1);
                const values = [
                  ...new Set(
                    variations.map((v) => v.attributes?.[rawAttrKey]).filter(Boolean)
                  ),
                ];
                if (!values.length) return null;

                return (
                  <div key={rawAttrKey} className={`variation-wrapper ${shakeVariation ? "shake-animation" : ""}`}>
                    <label>{`Select ${label}`}</label>
                    <select
                      className="variation-select form-select"
                      value={selectedAttributes[attrKey] || ""}
                      onChange={(e) => handleAttributeSelect(attrKey, e.target.value)}
                    >
                      <option value="" disabled hidden>{`Select ${label}`}</option>
                      {values.map((val) => (
                        <option key={val} value={val}>
                          {val.charAt(0).toUpperCase() + val.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
              
            {product.id !== 3829 && (
              <div className="quantity-control">
                <button onClick={() => handleQuantityChange(-1)}>-</button>
                <span>{quantity}</span>
                <button onClick={() => handleQuantityChange(1)}>+</button>
              </div>
            )}
            <button
              className="add-to-cart-btn"
              disabled={stockStatus !== "instock"}
              onClick={() => {
                const requiredAttrCount = Object.keys(variations[0]?.attributes || {}).length;
                if (variations.length > 0 && Object.keys(selectedAttributes).length < requiredAttrCount) {
                  setShakeVariation(true);
                  setTimeout(() => setShakeVariation(false), 500);
                  return;
                }

                const variationToSend = variations.find((variation) => {
                  const normalized = Object.fromEntries(
                    Object.entries(variation.attributes || {}).map(([key, val]) => [
                      key.replace(/^attribute_pa_|^pa_|^attribute_/, "").toLowerCase(),
                      val,
                    ])
                  );
                  return Object.entries(normalized).every(
                    ([key, val]) => selectedAttributes[key] === val
                  );
                });

                onAddToCart(product, selectedAttributes, quantity, variationToSend);
                setQuantity(1);
                onClose();
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


