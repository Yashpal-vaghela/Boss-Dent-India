import React from "react";
import { Link } from "react-router-dom";
import { MdLocalShipping, MdSecurity, MdSupportAgent } from "react-icons/md";
import Cards from "../component/Cards";
import HomeBanner from "../component/HomeBanner";
import "../css/othercard.css";
import OtherBanner from "../component/OtherBanner";

const Home = () => {
  const CategoryData = [
    {
      src: "/asset/images/gloves.png",
      src_slug: "/products?category=116",
      cat_title: "All Gloves",
    },
    {
      src: "/asset/images/general-dentist.webp",
      src_slug: "/products?category=75",
      cat_title: "General Dentistry",
    },
    {
      src: "/asset/images/vinsimle.png",
      src_slug: "/products?category=127",
      cat_title: "Vincismile",
    },
    {
      src: "/asset/images/retractornew.png",
      src_slug: "/products?category=125",
      cat_title: "All Retactors",
    },
  ];
  return (
    <div className="home-main overflow-hidden">
      {/* home banner section */}
      <HomeBanner />

      {/* Category Section */}
      {/* <section>
        <div className="home-cat-main">
          <div className="home-cat-sub">
            <div className="home-cat-content-box" data-aos="fade-down">
              <Link to="/products?category=116">
                <div className="home-cat-img-box">
                  <div className="home-cat-img-div">
                    <img
                      src="/asset/images/gloves.png"
                      alt="gloves"
                      width="150"
                      height="150"
                    />
                  </div>
                </div>
                <div className="home-cat-txt">
                  <h1>All Gloves</h1>
                </div>
              </Link>
            </div>
            <div className="home-cat-content-box" data-aos="fade-down">
              <Link to="/products?category=75">
                <div className="home-cat-img-box">
                  <div className="home-cat-img-div">
                    <img
                      src="/asset/images/general-dentist.webp"
                      alt="General Dentist"
                      width="150"
                      height="150"
                    />
                  </div>
                </div>
                <div className="home-cat-txt">
                  <h1>General Dentistry</h1>
                </div>
              </Link>
            </div>
            <div className="home-cat-content-box" data-aos="fade-down">
              <Link to="/products?category=127">
                <div className="home-cat-img-box">
                  <div className="home-cat-img-div">
                    <img
                      src="/asset/images/vinsimle.png"
                      alt="Vincismile"
                      width="150"
                      height="150"
                    />
                  </div>
                </div>
                <div className="home-cat-txt">
                  <h1>Vincismile</h1>
                </div>
              </Link>
            </div>
            <div className="home-cat-content-box" data-aos="fade-down">
              <Link to="/products?category=125">
                <div className="home-cat-img-box">
                  <div className="home-cat-img-div">
                    <img
                      src="/asset/images/retractornew.png"
                      alt="retractor"
                      width="150"
                      height="150"
                    />
                  </div>
                </div>
                <div className="home-cat-txt">
                  <h1>All Retactors</h1>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section> */}
      <section className="category-section">
        <div className="row home-cat-sub">
          {CategoryData?.map((item, index) => {
            return (
              <div className="col-lg-3 col-md-3 col-sm-5 col-6" key={index}>
                <Link to={item?.src_slug}>
                  <div className="home-cat-img-div">
                    <img
                      src={item?.src}
                      alt="gloves"
                      width="150"
                      height="150"
                    ></img>
                  </div>
                  <div className="home-cat-txt">
                    <h1 className="mb-0">{item?.cat_title}</h1>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* other Banner section */}
      <OtherBanner />

      {/* Variables products */}
      <section>
        <Cards />
      </section>

      {/* other section */}
      <section>
        <div className="other-cards-main-section">
          <div className="main-title-other-card-main">
            <h2
              className="main-title"
              data-aos="fade-down"
              // data-aos-delay="0"
            >
              Our Services
            </h2>
          </div>
          <div className="other-cards-main">
            <div
              className="other-card-main-1"
              data-aos="fade-down"
              // data-aos-delay="0"
            >
              <div className="other-card-icon-main">
                <span
                  className="other-card-icon"
                  data-aos="fade-right"
                  // data-aos-delay="0"
                >
                  <MdLocalShipping />
                </span>
              </div>
              <div className="other-card-title-main">
                <h2
                  className="other-card-title mb-0"
                  data-aos="fade-left"
                  // data-aos-delay="0"
                >
                  FAST SHIPPING
                </h2>
              </div>
            </div>
            <div
              className="other-card-main-2"
              data-aos="fade-down"
              // data-aos-delay="200"
            >
              <div
                className="other-card-icon-main"
                data-aos="fade-right"
                // data-aos-delay="200"
              >
                <span className="other-card-icon">
                  <MdSecurity />
                </span>
              </div>
              <div
                className="other-card-title-main"
                data-aos="fade-left"
                // data-aos-delay="200"
              >
                <h2 className="other-card-title mb-0">SECURE PAYMENT</h2>
              </div>
            </div>
            <div
              className="other-card-main-3"
              data-aos="fade-down"
              // data-aos-delay="400"
            >
              <div className="other-card-icon-main">
                <span
                  className="other-card-icon"
                  data-aos="fade-right"
                  // data-aos-delay="400"
                >
                  <MdSupportAgent />
                </span>
              </div>
              <div className="other-card-title-main">
                <h2
                  className="other-card-title mb-0"
                  data-aos="fade-left"
                  // data-aos-delay="400"
                >
                  BEST SUPPORT
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

//   <section>
//   <div className="other-banner-main"
//   // data-aos="fade-down"
//   >
//     <div className="other-banner">
//       <div className="banner-txt" data-aos="fade-right">
//         <p className="b-txt-1">The Best Doctor Recommended</p>
//         <p className="b-txt-2">
//           <span className="txt-2-name">TopCEM Dual</span>{" "}
//           <span className="txt-2-underline">Cure Resin Cement</span>{" "}
//           {/* <span className="txt-2-discount"> 10%</span>{" "}
//           <span className="txt-2-dicount-type">Flat Discount</span> */}
//         </p>
//       </div>
//       <div className="other-banner-btn-main">
//         <Link
//           to="/products/topcem-dual-cure-resin-cement"
//           className="other-banner-btn-0"
//         >
//           <button className="other-banner-btn">SEE COLLECTION</button>
//         </Link>
//       </div>
//     </div>
//   </div>
// </section>
