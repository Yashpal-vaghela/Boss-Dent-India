import React from "react";
import { Link } from "react-router-dom";

const HomeProductCategory = () => {
  const CategoryData = [
    {
      src: "/asset/images/gloves-1.png",
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
    <section className="category-section">
      <div className="row home-cat-sub">
        {CategoryData?.map((item, index) => {
          return (
            <div
              className="col-lg-3 col-md-3 col-sm-5 col-6"
              key={index}
              data-aos="zoom-in"
            >
              <Link to={item?.src_slug} className="home-cat-content-box">
                <div className="home-cat-img-div">
                  <img
                    src={item?.src}
                    alt="gloves"
                    width={150}
                    height={150}
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
  );
};

export default HomeProductCategory;
