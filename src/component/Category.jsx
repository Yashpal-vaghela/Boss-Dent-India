import React, { useEffect, useState } from "react";

const Category = (props) => {
  const [toggle, setToggle] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 991);

  const handleToogle = () => {
    setToggle((prev) => !prev);
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileView(false);
      } else {
        setIsMobileView(true);
        // setToggle((prev)=>!prev);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className="shop-sidebar-menu" data-aos="fade">
        <div className="shop-sidebar">
          <div className="d-flex align-items-center justify-content-between">
            <h3 className="mb-0">Shop by Category</h3>
            {
              isMobileView ? <>
              {
                !toggle ? <>
                 <i
                className="fa-solid fa-angle-down d-block d-lg-none d-md-none d-sm-block"
                style={{ fontSize: "20px" }}
                data-bs-toggle="collapse"
                href="#collapseExample"
                role="button"
                aria-expanded="false"
                aria-controls="collapseExample"
                onClick={() => handleToogle()}
              ></i>
                </> : <><i
                className="fa-solid fa-angle-up d-block d-lg-none d-md-none d-sm-block"
                style={{ fontSize: "20px" }}
                data-bs-toggle="collapse"
                href="#collapseExample"
                role="button"
                aria-expanded="false"
                aria-controls="collapseExample"
                onClick={() => handleToogle()}
              ></i></>
              }
              </> : <></>
            }
          </div>

          <ul
            className={`${isMobileView ? "collapse" : "collapse show"}`}
            // className="collapse show"
            id="collapseExample"
          >
            <hr />
            <li
              className={`category ${props.category === null ? "active" : ""}`}
              onClick={() => props.handleCategoryClick(null)}
            >
              All
            </li>
            <li
              className={`category ${props.category === "46" ? "active" : ""}`}
              onClick={() => props.handleCategoryClick(46)}
            >
              Accessories
            </li>
            <li
              className={`category ${props.category === "75" ? "active" : ""}`}
              onClick={() => props.handleCategoryClick(75)}
            >
              General dentist
            </li>
            <li
              className={`category ${props.category === "116" ? "active" : ""}`}
              onClick={() => props.handleCategoryClick(116)}
            >
              Gloves
            </li>
            <li
              className={`category ${props.category === "117" ? "active" : ""}`}
              onClick={() => props.handleCategoryClick(117)}
            >
              Caps
            </li>
            <li
              className={`category ${props.category === "118" ? "active" : ""}`}
              onClick={() => props.handleCategoryClick(118)}
            >
              Masks
            </li>
            <li
              className={`category ${props.category === "119" ? "active" : ""}`}
              onClick={() => props.handleCategoryClick(119)}
            >
              Draps
            </li>
            <li
              className={`category ${props.category === "122" ? "active" : ""}`}
              onClick={() => props.handleCategoryClick(122)}
            >
              Sleeves
            </li>
            <li
              className={`category ${props.category === "125" ? "active" : ""}`}
              onClick={() => props.handleCategoryClick(125)}
            >
              Retractors
            </li>
            <li
              className={`category ${props.category === "123" ? "active" : ""}`}
              onClick={() => props.handleCategoryClick(123)}
            >
              Tips
            </li>
            <li
              className={`category ${props.category === "124" ? "active" : ""}`}
              onClick={() => props.handleCategoryClick(124)}
            >
              Trays
            </li>
            <li
              className={`category ${props.category === "126" ? "active" : ""}`}
              onClick={() => props.handleCategoryClick(126)}
            >
              Wedges
            </li>
            <li
              className={`category ${props.category === "120" ? "active" : ""}`}
              onClick={() => props.handleCategoryClick(120)}
            >
              Polishing Kits
            </li>
            <li
              className={`category ${props.category === "121" ? "active" : ""}`}
              onClick={() => props.handleCategoryClick(121)}
            >
              Endo Categories
            </li>
            <li
              className={`category ${props.category === "127" ? "active" : ""}`}
              onClick={() => props.handleCategoryClick(127)}
            >
              Vincismiles
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Category;