import React from "react";

const Loader = () => {
  return (
    <div
      className="Loader-wrapper"
      style={{ height: "0px", margin: "10% auto" }}
    >
      <img
        src="/asset/images/BOSS-DENT-LOGO-01.png"
        className="img-fluid loader-img"
        width={200}
        height={100}
        alt="loader-image"
      ></img>
    </div>
  );
};

export default Loader;
