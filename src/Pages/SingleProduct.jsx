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
import { AddToCartModal } from "../component/AddToCartModal";

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
  const [shakeVariation, setShakeVariation] = useState(false);
  const [showVariationModal, setShowVariationModal] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  const [discountPercentage, setDiscountPercentage] = useState(null);
  const [defaultMinPrice, setDefaultMinPrice] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(null);

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
      setQuantity(1);
      setSelectedAttributes([]);

      const data = response.data;

      setProduct(data);

      if (data?.variations?.length > 0) {
        let minPrice = null;

        data.variations.forEach((variation) => {
          const price = parseFloat(variation.sale_price || variation.price);
          if (!isNaN(price)) {
            if (minPrice === null || price < minPrice) {
              minPrice = price;
            }
          }
        });

        if (minPrice !== null) {
          setDefaultMinPrice(minPrice);
        }
      }

      // Preload the main product image
      if (response.data.yoast_head_json?.og_image?.[0]?.url) {
        const img = new Image();
        img.src = response.data.yoast_head_json.og_image[0].url;
      }

      // let maxSalePrice = null;
      let minSalePrice = null;
      let maxRegularPrice = null;

      // Extract sale price range from variations
      if (response.data.variations && response.data.variations.length > 0) {
        setVariations(response.data.variations);

        const salePrices = response.data.variations
          .map((v) => parseFloat(v.sale_price || v.price))
          .filter((price) => !isNaN(price) && price > 0);

        const regularPrices = response.data.variations
          .map((v) => parseFloat(v.regular_price || v.price))
          .filter((price) => !isNaN(price) && price > 0);

        // if (salePrices.length > 0) {
        //   minSalePrice = Math.min(...salePrices);
        //   maxSalePrice = Math.max(...salePrices);
        // }
        if (salePrices.length > 0) {
          minSalePrice = Math.min(...salePrices);
        }
        // console.log("regular -------",regularPrices);
        if (regularPrices.length > 0) {
          maxRegularPrice = Math.max(...regularPrices);
        }
      }

      if (response.data.variations === null) {
        setVariations([]);
      }
      // if(minSalePrice === null){
      //   minSalePrice = parseFloat(response.data.sale_price || response.data.price) || 0;
      // }
      // Fallback to main product price if variations are missing or incorrect
      // if (minSalePrice === null || maxSalePrice === null) {
      //   minSalePrice = parseFloat(response.data.price) || 0;
      //   maxSalePrice = parseFloat(response.data.price) || minSalePrice;
      // }
      if (minSalePrice === null) {
        minSalePrice =
          parseFloat(response.data.sale_price || response.data.price) || 0;
      }
      if (maxRegularPrice === null) {
        maxRegularPrice =
          parseFloat(response.data.regular_price || response.data.price) ||
          minSalePrice;
      }
      setSalePrice(minSalePrice);
      // setRegularPrice(maxRegularPrice);
      setRegularPrice(maxRegularPrice);

      // Fetch related products
      console.warn("re--------", response.data);
      if (response.data.categories && response.data.categories.length > 0) {
        const categoryId = response.data.categories[0].id;
        // const categoryId = response.data.product_cat[0];
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
    if (product && product.regular_price && product.sale_price) {
      const regular_price = parseFloat(product.regular_price);
      const sale_price = parseFloat(product.sale_price);

      if (
        !isNaN(regular_price) &&
        !isNaN(sale_price) &&
        regular_price > 0 &&
        sale_price > 0 &&
        sale_price < regular_price
      ) {
        const discount = Math.round(
          ((regular_price - sale_price) / regular_price) * 100
        );
        setDiscountPercentage(discount);
      } else {
        setDiscountPercentage(null);
      }
    } else {
      setDiscountPercentage(null);
    }
  }, [product?.regular_price, product?.sale_price]);

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
    if (attribute && value) {
      // const attrKey = attribute
      const newSelectedAttributes = {
        ...selectedAttributes,
        [attribute]: value,
      };

      setError("");
      setSelectedAttributes(newSelectedAttributes);
      setSelectedColor(value);

      const selectedVariation = variations.find((variation) => {
        return Object.keys(variation.attributes).every((key) => {
          return newSelectedAttributes[key] === variation.attributes[key];
        });
      });

      if (selectedVariation !== undefined) {
        const selectedSale = parseFloat(
          selectedVariation.sale_price || selectedVariation.price
        );
        const selectedRegular = parseFloat(
          selectedVariation.regular_price || selectedVariation.price
        );

        setSalePrice(selectedSale);
        setRegularPrice(selectedRegular);
        setSelectedVariation(selectedVariation);

        if (
          !isNaN(selectedRegular) &&
          !isNaN(selectedSale) &&
          selectedRegular > 0 &&
          selectedSale > 0 &&
          selectedSale < selectedRegular
        ) {
          const discount = Math.round(
            ((selectedRegular - selectedSale) / selectedRegular) * 100
          );
          setDiscountPercentage(discount);
        } else {
          setDiscountPercentage(null);
        }
        setProduct((prevProduct) => ({
          ...prevProduct,
          price: selectedVariation.sale_price || selectedVariation.price,
        }));
        // setProduct({
        //   ...product,
        //   price: selectedVariation.price || selectedVariation.sale_price,
        // });
      } else {
        setSalePrice(salePrice);
        setRegularPrice(RegularPrice);
      }
    } else {
      setSelectedAttributes(value);
      setSelectedColor(value);
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
            toast.success("Product removed from watchlist successfully.");
          })
          .catch((error) => console.log("error", error));
      } else {
        const productTitle = product?.name || "Default Title";
        const productImage = product.yoast_head_json?.og_image?.[0]?.url || "";

        if (variations.length > 0) {
          if (
            !selectedAttributes ||
            Object.keys(selectedAttributes).length === 0
          ) {
            setError("Please select variations");
            return;
          }
        }
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
  const handleAddToCart = async (e, productArg, isRelated = false) => {
    const productToUse = productArg || product;
    const relatedProduct = isRelated ? productArg : undefined;
    const hasVariations = productToUse?.variations?.length > 0;

    //  Stock status Check with fallback
    const hasStock = productToUse?.stock_status === "instock";
    const fallbackStockCheck = Array.isArray(productToUse?.variations)
      ? productToUse.variations.some((v) => Number(v.price) > 0)
      : Number(productToUse?.price) > 0;

    const isInstock = hasStock || fallbackStockCheck;

    // console.log(" hasStock:", hasStock);
    // console.log(" fallbackStockCheck:", fallbackStockCheck);
    // console.log(" Final isInstock:", isInstock);

    //  Handle Variation Modal for Related Products
    if (isRelated && hasVariations) {
      setSelectedProductForModal(productToUse);
      setShowVariationModal(true);
      return;
    }

    if (!isLoggedIn) {
      toast.error("Please login to add product to cart!");
      setTimeout(() => {
        navigate("/my-account", {
          state: { from: location.pathname, productId: productToUse.id },
        });
      }, 2000);
      return;
    }

    //  Ensure all required attributes are selected
    if (hasVariations) {
      const requiredAttrCount = Object.keys(
        productToUse.variations?.[0]?.attributes || {}
      ).length;
      const selectedAttrCount = Object.keys(selectedAttributes).length;

      if (selectedAttrCount < requiredAttrCount) {
        setShakeVariation(true);
        setTimeout(() => setShakeVariation(false), 600);
        return;
      }
    }

    if (!isInstock) {
      toast.info("Product is out of stock");
      return;
    }

    //  Get cart data
    const userData = JSON.parse(sessionStorage.getItem("UserData"));
    let filterCartProduct = [];
    let RelatedCartProduct = [];
    let GetCartProduct = [];

    try {
      const res = await axios.get(
        `https://admin.bossdentindia.com/wp-json/custom/v1/cart-items?user_id=${userData.user_id}`
      );

      sessionStorage.setItem("cart", JSON.stringify(res.data));
      GetCartProduct = res.data.cart_items;

      filterCartProduct = GetCartProduct.filter((item) => {
        const isSameProduct =
          Number(item.product_id) === Number(productToUse.id);
        const isVariation = hasVariations;

        return isVariation
          ? isSameProduct &&
              JSON.stringify(item.selected_attribute || {}) ===
                JSON.stringify(selectedAttributes || {})
          : isSameProduct;
      });

      if (isRelated) {
        RelatedCartProduct = GetCartProduct.filter((item) => {
          if (hasVariations && selectedAttributes) {
            return (
              Object.values(item.selected_attribute || {})[0] ===
              Object.values(selectedAttributes || {})[0]
            );
          } else {
            return Number(item.product_id) === relatedProduct?.id;
          }
        });
      }
    } catch (error) {
      console.warn("error-cart:", error);
    }

    // ✅ Main Add/Update Logic

    if (isRelated) {
      if (RelatedCartProduct.length === 0) {
        // ➕ Add Related Product
        if (hasVariations && !selectedAttributes) {
          return setError("Please select variations");
        }

        axios
          .post(
            `https://admin.bossdentindia.com/wp-json/custom/v1/add-to-cart`,
            {
              user_id: userData.user_id,
              product_id: relatedProduct.id,
              category_id: [relatedProduct.product_cat?.[0]],
              product_quantity: quantity,
              product_title:
                relatedProduct.title?.rendered || relatedProduct.name,
              product_image:
                relatedProduct.yoast_head_json?.og_image?.[0]?.url || "",
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
              userData
            );
          })
          .catch((err) => console.log("err", err));
      } else {
        // 🔄 Update Related Product
        const updatedQuantity =
          Number(RelatedCartProduct[0].product_quantity) + quantity;
        axios
          .post(
            `https://admin.bossdentindia.com/wp-json/custom/v1/cart/update`,
            {
              user_id: userData.user_id,
              category_id: [relatedProduct.product_cat?.[0]],
              product_id: relatedProduct.id,
              product_quantity: updatedQuantity,
              selected_attribute: selectedAttributes,
              cart_id: RelatedCartProduct[0].id,
            }
          )
          .then((res) => {
            toast.success("Product updated in cart successfully!");
            addToCartListProduct(
              res.data.cart_id,
              selectedAttributes,
              userData
            );
          })
          .catch((err) => console.log("err", err));
      }
    } else {
      // Handle main product (not related)
      if (filterCartProduct.length === 0) {
        handleAddToCartApi(productToUse, userData);
      } else {
        handleUpdateCartApi(filterCartProduct, productToUse, GetCartProduct);
      }
    }
  };

  const handleAddToCartApi = async (product, userData) => {
    const storedCart = sessionStorage.getItem("cart");
    let cartItems = [];

    try {
      // Try fetching fresh cart data from server
      const res = await axios.get(
        `https://admin.bossdentindia.com/wp-json/custom/v1/cart-items?user_id=${userData.user_id}`
      );
      cartItems = res.data.cart_items || [];
      sessionStorage.setItem("cart", JSON.stringify(res.data));
      sessionStorage.setItem("cart_length", res.data.cart_items?.length || 0);
    } catch (err) {
      console.warn("Failed to fetch cart from server:", err);
      // fallback to sessionStorage
      if (storedCart) {
        try {
          const parsed = JSON.parse(storedCart);
          cartItems = parsed.cart_items || [];
        } catch (e) {
          console.warn("Error parsing session cart:", e);
        }
      }
    }

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

    if (existingItem) {
      //  If item exists, update quantity
      const updatedQuantity =
        Number(existingItem.product_quantity) + Number(quantity);

      try {
        const res = await axios.post(
          `https://admin.bossdentindia.com/wp-json/custom/v1/cart/update`,
          {
            user_id: userData.user_id,
            category_id: [
              Number(
                product.categories?.[0]?.id || product.product_cat?.[0] || 0
              ),
            ],
            product_id: product.id,
            product_quantity: updatedQuantity,
            selected_attribute: selectedAttributes,
            cart_id: existingItem.id,
          }
        );

        sessionStorage.setItem("cart", JSON.stringify(res.data));
        sessionStorage.setItem("cart_length", res.data.cart_items?.length || 0);
        addToCartListProduct(res.data.cart_id, selectedAttributes, userData);
        toast.success("Product quantity updated successfully!");
      } catch (err) {
        console.error("Error updating cart item:", err);
        toast.error("Failed to update cart.");
      }
    } else {
      //  If item doesn't exist, add to cart
      try {
        const res = await axios.post(
          `https://admin.bossdentindia.com/wp-json/custom/v1/add-to-cart`,
          {
            user_id: userData.user_id,
            product_id: product.id,
            category_id: [
              Number(
                product.categories?.[0]?.id || product.product_cat?.[0] || 0
              ),
            ],
            product_quantity: quantity,
            product_title: product.name || "",
            product_image: product.yoast_head_json.og_image[0]?.url || "",
            product_attributes: product.variations,
            product_weight: weight,
            product_price: product.price,
            selected_attribute: selectedAttributes,
          }
        );

        sessionStorage.setItem("cart", JSON.stringify(res.data));
        sessionStorage.setItem("cart_length", res.data.cart_items?.length || 0);
        addToCartListProduct(res.data.cart_id, selectedAttributes, userData);
        toast.success("Product added to cart successfully!");
      } catch (err) {
        console.error("Error adding product to cart:", err);
        toast.error("Failed to add to cart.");
      }
    }
  };

  const handleUpdateCartApi = async (filter, product) => {
    //const UpdatedProduct = filter[0].product_quantity;
    const UpdatedProduct = filter[0];
    const updatedQuantity = UpdatedProduct.product_quantity;
    await axios
      .post(`https://admin.bossdentindia.com/wp-json/custom/v1/cart/update`, {
        user_id: getUserData.user_id,
        product_id: product.id,
        category_id: product.categories[0].id || product.product_cat[0] || null,
        //product_quantity: Number(UpdatedProduct) + quantity,
        product_quantity: Number(updatedQuantity) + quantity,
        selected_attribute: selectedAttributes,
        cart_id: UpdatedProduct.id,
      })
      .then((res) => {
        addToCartListProduct(res.data.cart_id, selectedAttributes, getUserData);
        toast.success("Product update to cart successfully!");
      })
      .catch((err) => console.log("err", err));
  };

  const startingRegularPrice = Math.min(
    ...variations
      .map((v) => Number(v.regular_price))
      .filter((price) => price > 0)
  );
  const handleAddToCartFromModal = async (
    product,
    selectedAttributes,
    quantity,
    variation = null
  ) => {
    // const userData = JSON.parse(sessionStorage.getItem("UserData"));

    if (!getUserData) {
      toast.error("Please login to add product to cart!");
      setTimeout(() => {
        navigate("/my-account", {
          state: { from: location.pathname, productId: product.id },
        });
      }, 2000);
      return;
    }

    // 🛒 Step 1: Load cartItems (fresh fetch first)
    let cartItems = [];

    try {
      const res = await axios.get(
        `https://admin.bossdentindia.com/wp-json/custom/v1/cart-items?user_id=${getUserData.user_id}`
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
        } catch (parseErr) {
          console.warn("Error parsing fallback cart:", parseErr);
        }
      }
    }

    // ✅ Step 2: Compare product + attributes (sorted) to avoid duplicates
    const normalizeAttributes = (attrs) => {
      if (!attrs || typeof attrs !== "object") return {};
      return Object.keys(attrs)
        .sort()
        .reduce((obj, key) => {
          obj[key] = attrs[key];
          return obj;
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
        // ADD to cart
        const res = await axios.post(
          `https://admin.bossdentindia.com/wp-json/custom/v1/add-to-cart`,
          {
            user_id: getUserData.user_id,
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

        addToCartListProduct(
          updatedCart.cart_id,
          selectedAttributes,
          getUserData
        );
        toast.success("Product added to cart successfully!");
      } else {
        // UPDATE quantity
        const updatedQuantity =
          Number(existingItem.product_quantity) + Number(quantity);

        const res = await axios.post(
          `https://admin.bossdentindia.com/wp-json/custom/v1/cart/update`,
          {
            user_id: getUserData.user_id,
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

        addToCartListProduct(
          updatedCart.cart_id,
          selectedAttributes,
          getUserData
        );
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
              {stockStatus === "outofstock" && (
                <div className="outof-stock-label">Out of Stock</div>
              )}
              {discountPercentage > 0 && (
                <div className="discount-badge">
                  {`${discountPercentage}% Off`}
                </div>
              )}
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
                {variations.length > 0 ? (
                  <>
                    <span className="sale-price d-flex align-items-center">
                      {variations.length > 0 &&
                      Object.keys(variations[0]?.attributes || {}).every(
                        (attr) => selectedAttributes?.[attr]
                      ) ? (
                        <p className="mb-0" style={{ fontSize: "18px" }}>
                          Price:&nbsp;
                        </p>
                      ) : (
                        <p className="mb-0" style={{ fontSize: "17px" }}>
                          Starting Price from:&nbsp;
                        </p>
                      )}
                      {Object.keys(variations[0]?.attributes || {}).every(
                        (attr) => selectedAttributes?.[attr]
                      ) ? (
                        <>
                          {salePrice !== regularPrice && regularPrice > 0 && (
                            <p className="regular-price mb-0 text-decoration-line-through">
                              ₹{Number(regularPrice).toFixed(2)}
                            </p>
                          )}
                          ₹{Number(salePrice).toFixed(2)}&nbsp;
                          {discountPercentage > 0 && (
                            <p
                              className="discounted-product mb-0"
                              style={{ fontSize: "14px", color: "green" }}
                            >
                              {`(${discountPercentage}% Off)`}
                            </p>
                          )}
                        </>
                      ) : (
                        <>₹{Number(startingRegularPrice).toFixed(2)}</>
                      )}
                    </span>
                  </>
                ) : (
                  <>
                    {salePrice && regularPrice ? (
                      <div className="d-flex align-items-center ">
                        <p className="mb-0" style={{ fontSize: "18px" }}>
                          Price:&nbsp;
                        </p>
                        {salePrice !== regularPrice ? (
                          <>
                            <span className="regular-price">
                              ₹{Number(regularPrice).toFixed(2)}
                            </span>
                            <span className="sale-price">
                              ₹{Number(salePrice).toFixed(2)} &nbsp;
                            </span>
                            {discountPercentage > 0 && (
                              <p
                                className="discounted-product mb-0"
                                style={{ fontSize: "14px", color: "green" }}
                              >
                                {`(${discountPercentage}% Off)`}
                              </p>
                            )}
                          </>
                        ) : (
                          <span className="sale-price">
                            ₹{Number(salePrice).toFixed(2)}
                          </span>
                        )}
                      </div>
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
              {variations.length > 0 &&
                Object.keys(variations[0]?.attributes || {}).map(
                  (attribute, index) => {
                    if (attribute)
                      return (
                        <div
                          key={attribute}
                          className={`variation-main align-items-center ${
                            shakeVariation ? "shake" : ""
                          }`}
                        >
                          <h4 className="mb-0">
                            {attribute.replace(/pa_|attribute_/, "")}:&nbsp;
                          </h4>

                          {/* color theme */}
                          <div
                            className={`variation-select-wrapper ${
                              shakeVariation ? "shake-animation" : ""
                            }`}
                            style={{ display: "flex" }}
                          >
                            <select
                              className="form-select"
                              name={attribute}
                              value={
                                selectedAttributes?.[
                                  attribute
                                    .replace(/^pa_|^attribute_/, "")
                                    .toLowerCase()
                                ] || ""
                              }
                              onChange={(e) => {
                                const selectedValue = e.target.value;
                                const attrKey = attribute
                                  .replace(/^pa_|^attribute_/, "")
                                  .toLowerCase();

                                const variation = variations.find(
                                  (v) =>
                                    v.attributes?.[attrKey] === selectedValue
                                );

                                if (variation) {
                                  handleAttributeSelect(
                                    attribute,
                                    selectedValue,
                                    attrKey,
                                    variation.sale_price,
                                    variation.regular_price
                                  );
                                }
                              }}
                            >
                              <option value="">
                                Select {attribute.replace(/pa_|attribute_/, "")}
                              </option>
                              {[
                                ...new Set(
                                  variations
                                    .map(
                                      (v) =>
                                        v.attributes?.[
                                          attribute
                                            .replace(/^pa_|^attribute_/, "")
                                            .toLowerCase()
                                        ]
                                    )
                                    .filter(Boolean)
                                ),
                              ].map((val, index) => (
                                <option key={index} value={val}>
                                  {val.charAt(0).toUpperCase() + val.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                  }
                )}
              {error !== null && <span className="text-danger">{error}</span>}
              {product?.categories && product?.slug !== "paper-point" ? (
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
              ) : null}
              <div className="btn-icon-main">
                <div>
                  <button
                    className={`add-to-cart-btn ${
                      stockStatus === "outofstock" ? "disable-button" : ""
                    } `}
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
          <AddToCartModal
            isOpen={showVariationModal}
            onClose={() => setShowVariationModal(false)}
            product={selectedProductForModal}
            stockStatus={selectedProductForModal?.stock_status || "instock"}
            // stockStatus={selectedProductForModal?.stock_status || "instock"}
            // onAddToCart={handleAddToCartModal}
            // onAddToCart={handleAddToCartModal}
            onAddToCart={handleAddToCartFromModal}
            variations={selectedProductForModal?.variations}
          ></AddToCartModal>
        </div>
      )}
    </>
  );
};

export default SingleProduct;
