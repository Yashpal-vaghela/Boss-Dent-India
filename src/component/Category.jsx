import React, { useEffect, useState } from "react";

const Category = (props) => {
  const [toggle, setToggle] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 991);
  const [tabletscreen, setTabletsScreen] = useState(false);

  const handleScroll = () => {
    // const collapedElement = document.getElementById("collapseExample");
    // if (window.innerWidth >= 768) {
    //   setTabletsScreen((prev)=>!prev);
    //   // collapedElement.classList.add("show");
    //   console.log("window1", window.screen.availWidth);
    // } else {
    //   setTabletsScreen((prev)=>!prev);
    //   // collapedElement.classList.remove("show");
    //   // console.log(
    //   //   "window2",
    //   //   collapedElement.classList[1] === "show",
    //   //   collapedElement.classList.value,
    //   //   "classList",
    //   //   collapedElement.classList,
    //   //   toggle
    //   // );
    //   // collapedElement.style.display = "none";
    // }
    // if (collapedElement.classList[1] === "show") {
    //   // collapedElement.style.display = "none";
    //   collapedElement.classList.remove("show");
    // }else {
    //   collapedElement.classList.add("show");
    //   // toggle ?
    //   // collapedElement.style.display = "none";
    // }
  };
  // const handleDisplay = () =>{
  //   const collapedElement = document.getElementById("collapseExample");
  //   if (collapedElement.classList.value !== "collapsing") {
  //     collapedElement.classList.remove("show");
  //   }
  // }
  // const handleResize = () => {
  //   handleScroll();
  // };
  const handleToogle = () => {
    setToggle((prev) => !prev);
    //  const collapedElement = document.getElementById("collapseExample");
    //  console.log("collapedElement",collapedElement.classList);
    // if(collapedElement.classList.value === "collapsing"){
    //   setToggle(true);
    // }
    // else{
    //   setToggle(false);
    // }
    // handleResize();
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        const collapedElement = document.getElementById("collapseExample");
        console.log("collapedElement",collapedElement);
        setIsMobileView(true);
        if (toggle === false) {
          setToggle(true);
        }
      } else {
        setIsMobileView(false);
        setToggle(false);
      }
    };
    window.addEventListener("resize", handleResize);
    // window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      //  window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className="shop-sidebar-menu" data-aos="fade">
        <div className="shop-sidebar">
          <div className="d-flex align-items-center justify-content-between">
            <h3 className="mb-0">Shop by Category</h3>
            {console.log("tableSCreen", isMobileView, "toggle", toggle)}
            {/* <i className="fa-solid fa-chevron-down"></i> */}
            {toggle ? (
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
            ) : (
              <i
                className="fa-solid fa-angle-up d-block d-lg-none d-md-none d-sm-block"
                style={{ fontSize: "20px" }}
                data-bs-toggle="collapse"
                href="#collapseExample"
                role="button"
                aria-expanded="false"
                aria-controls="collapseExample"
                onClick={() => handleToogle()}
              ></i>
            )}
          </div>

          <ul
            className={`${isMobileView ? "collapse" : "collapse show"}`}
            // className={`${!window.innerWidth > 768 ? "collapse d-none" : "collapse show"}`}
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
              onClick={() => props.andleCategoryClick(125)}
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
