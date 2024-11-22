import React,{useEffect} from "react";
import { MdLocalShipping, MdSecurity, MdSupportAgent } from "react-icons/md";
import AOS from "aos";

const ProductServices = () => {
  useEffect(() => {
    AOS.init({
      disable: "mobile",
    });
  }, []);
  return (
    <section className="other-cards-main-section" >
      <div className="main-title-other-card-main">
        <h2
          className="main-title"
          data-aos="zoom-out"
          // data-aos-delay="0"
        >
          Our Services
        </h2>
      </div>
      <div className="other-cards-main">
        <div
          className="other-card-main-1"
          data-aos="zoom-in"
          // data-aos-delay="0"
        >
          <div className="other-card-icon-main">
            <span
              className="other-card-icon"
              // data-aos="fade-right"
              // data-aos-delay="0"
            >
              <MdLocalShipping />
            </span>
          </div>
          <div className="other-card-title-main">
            <h2
              className="other-card-title mb-0"
              // data-aos="fade-left"
              // data-aos-delay="0"
            >
              FAST SHIPPING
            </h2>
          </div>
        </div>
        <div
          className="other-card-main-2"
          data-aos="zoom-in"
          // data-aos-delay="200"
        >
          <div
            className="other-card-icon-main"
            // data-aos="fade-right"
            // data-aos-delay="200"
          >
            <span className="other-card-icon">
              <MdSecurity />
            </span>
          </div>
          <div
            className="other-card-title-main"
            // data-aos="fade-left"
            // data-aos-delay="200"
          >
            <h2 className="other-card-title mb-0">SECURE PAYMENT</h2>
          </div>
        </div>
        <div
          className="other-card-main-3"
          data-aos="zoom-in"
          // data-aos-delay="400"
        >
          <div className="other-card-icon-main">
            <span
              className="other-card-icon"
              // data-aos="fade-right"
              // data-aos-delay="400"
            >
              <MdSupportAgent />
            </span>
          </div>
          <div className="other-card-title-main">
            <h2
              className="other-card-title mb-0"
              // data-aos="fade-left"
              // data-aos-delay="400"
            >
              BEST SUPPORT
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductServices;
