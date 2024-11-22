import React from "react";
import BreadCrumbs from "../component/BreadCrumbs";
import * as yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const ReturnExchangeSchema = yup.object().shape({
  return_or_replace: yup.string().required("Choose Option field is required"),
  first_name: yup.string().required("First Name field is required"),
  last_name: yup.string().required("Last Name field is required"),
  contact_number: yup
    .number()
    .min(10, "The phone number must be a vaild number.")
    .required("phone field is required"),
  order_number: yup
    .number()
    .min(4, "Order number min 4 digit enter")
    .required("Order Number field is required"),
  query: yup.string().required("query field is required"),
});

const ReturnExchange = () => {
  const navigate = useNavigate();

  const initialValues = {
    first_name: "",
    last_name: "",
    return_or_replace: "",
    contact_number: "",
    order_number: "",
    query: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: ReturnExchangeSchema,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: async () => {
      // console.log("handleSubmit", formik?.values);
      const userLoggedIn = !!localStorage.getItem("token");
      if (userLoggedIn) {
        await axios
          .post(
            `https://admin.bossdentindia.com/wp-json/custom/v1/return-exchange`,
            {
              first_name: formik?.values.first_name,
              last_name: formik?.values.last_name,
              return_or_replace: formik?.values.return_or_replace,
              contact_number: formik?.values.contact_number,
              order_number: formik?.values.order_number,
              query: formik?.values.query,
            }
          )
          .then((response) => {
            navigate("/");
            // console.log("response", response.data);
          })
          .catch((error) =>
            {
              // console.log("error", error.response.data.message);
              toast.error(error.response.data.message);
            } );
      }
    },
  });
  return (
    <div className="container return-or-replace-contain">
      <div className="header" data-aos="fade-up">
        <h1 className="shop-title">Return & Exchange</h1>
        <BreadCrumbs />
      </div>
      <div className="return-content row overflow-hidden">
        <div className="col-lg-6 col-12 return-content-1">
          <h1 className="return-content-title">
            Contact us for Return & Exchange product
          </h1>
          <p>
            We will contact you as soon as possible. Please enter your order
            details in the below form, It will help us for resolve your query.
          </p>
          <form className="row form" onSubmit={formik?.handleSubmit}>
            <div
              className={`${
                formik?.errors.return_or_replace
                  ? "return-choose-option d-block my-0"
                  : "return-choose-option d-block mb-3"
              }`}
              // className="return-choose-option d-block my-2"
            >
              <input
                type="radio"
                className="form-check-input"
                name="return_or_replace"
                value="return"
                onChange={formik?.handleChange}
                onBlur={formik?.handleBlur}
              ></input>
              <label className="form-check-label">&nbsp;Return</label>
              <br />
              <input
                type="radio"
                className="form-check-input"
                name="return_or_replace"
                value="replace"
                onChange={formik?.handleChange}
                onBlur={formik?.handleBlur}
              ></input>
              <label className="form-check-label">&nbsp;Replace</label>
              <br />
              {formik?.errors?.return_or_replace && (
                <span className="return-form-error">
                  {formik?.errors?.return_or_replace}
                </span>
              )}
            </div>
            <div
              className={`${
                formik?.errors?.first_name
                  ? "col-lg-6 col-12 my-1"
                  : "col-lg-6 col-12 mb-4"
              }`}
              //  className="col-lg-6 col-12 my-2"
            >
              <input
                type="text"
                name="first_name"
                value={formik?.values?.first_name || ""}
                onChange={formik?.handleChange}
                onBlur={formik?.handleBlur}
                className="form-control"
                placeholder="First Name"
              ></input>
              {formik?.errors?.first_name && (
                <span className="return-form-error">
                  {formik?.errors?.first_name}
                </span>
              )}
            </div>
            <div
              className={`${
                formik?.errors?.last_name
                  ? "col-lg-6 col-12 my-1"
                  : "col-lg-6 col-12 mb-4"
              }`}
            >
              <input
                type="text"
                name="last_name"
                value={formik?.values?.last_name || ""}
                onChange={formik?.handleChange}
                onBlur={formik?.handleBlur}
                className="form-control"
                placeholder="Last Name"
              ></input>
              {formik?.errors?.last_name && (
                <span className="return-form-error">
                  {formik?.errors?.last_name}
                </span>
              )}
            </div>
            <div
              className={`${
                formik?.errors?.order_number ? "col-12 my-1" : "col-12 mb-4"
              }`}
            >
              <input
                type="number"
                name="contact_number"
                value={formik?.values?.contact_number || ""}
                onChange={formik?.handleChange}
                onBlur={formik?.handleBlur}
                className="form-control"
                placeholder="Contact Number"
              ></input>
              {formik?.errors?.contact_number && (
                <span className="return-form-error">
                  {formik?.errors?.contact_number}
                </span>
              )}
            </div>
            <div
              className={`${
                formik?.errors?.order_number ? "col-12 my-1" : "col-12 mb-4"
              }`}
            >
              <input
                type="number"
                name="order_number"
                value={formik?.values?.order_number || ""}
                onChange={formik?.handleChange}
                onBlur={formik?.handleBlur}
                className="form-control"
                placeholder="Order Number"
                maxLength={4}
              ></input>
              {formik?.errors?.order_number && (
                <span className="return-form-error">
                  {formik?.errors?.order_number}
                </span>
              )}
            </div>
            <div
              className={`${
                formik?.errors.query ? "col-12 my-1" : "col-12 mb-4"
              }`}
            >
              <textarea
                name="query"
                value={formik?.values?.query || ""}
                onChange={formik?.handleChange}
                onBlur={formik?.handleBlur}
                className="form-control"
                placeholder="Please enter your query..."
              ></textarea>
              {formik?.errors?.query && (
                <span className="return-form-error">
                  {formik?.errors?.query}
                </span>
              )}
            </div>
            <div className="col-12 mb-3">
              <button type="submit" className="btn btn-dark w-100">
                Submit Form
              </button>
            </div>
          </form>
        </div>
        <div className="col-lg-6 col-12 my-sm-5">
          <div className="return-content-img">
            <div className="return-content-img1"></div>
            <img src="/asset/images/contact.png" className="img-fluid"></img>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnExchange;
