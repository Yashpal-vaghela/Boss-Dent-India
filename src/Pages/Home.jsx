import React, { useEffect } from "react";
import Cards from "../component/Cards";
import HomeBanner from "../component/HomeBanner";
import OtherBanner from "../component/OtherBanner";
import HomeProductCategory from "../component/HomeProductCategory";
import ProductServices from "../component/ProductServices";
import AOS from "aos";
import "aos/dist/aos.css";
import { Helmet } from "react-helmet";
const Home = () => {
  useEffect(() => {
    AOS.init({
      disable: "mobile",
    });
  }, []);
  return (
    <div className="home-main overflow-hidden">
      <Helmet>
        <title>Home Page -Boss Dent India</title>
        <link rel="canonical" href="https://bossdentindia.com/" />
      </Helmet>
      {/* home banner section */}
      <HomeBanner />

      {/* Category Section */}
      <HomeProductCategory />

      {/* other Banner section */}
      <OtherBanner />

      {/* Variables products */}
      <Cards />

      {/* other section */}
      <ProductServices />
    </div>
  );
};

export default React.memo(Home);
