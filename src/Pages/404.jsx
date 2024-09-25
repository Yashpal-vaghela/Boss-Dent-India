import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div id="notfound">
      <div className="notfound">
        <div className="notfound-404" >
          <h1>404</h1>
        </div>
        <h2> we are sorry, page not found!</h2>
        <Link to="/" className="btn btn-dark back_to_home_page">
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
