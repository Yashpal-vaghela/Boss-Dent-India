import React, { useEffect, useState } from "react";
import contact from "../images/contact.png";
import Aos from "aos";
import axios from "axios";
import AlertSuccess from "../component/AlertSuccess";
import BreadCrumbs from "../component/BreadCrumbs";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";

const contactSchema = Yup.object().shape({
  name: Yup.string().required("Name Field is required."),
  email: Yup.string()
    .email("Please Enter Vaild email")
    .required("Email Field is required."),
  phone: Yup.number().required("Phone Field is  required."),
  subject: Yup.string().required("Subject  Field is required."),
  message: Yup.string().required("Message Field is required."),
});

const Contact = () => {
  const initialValues = {
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  };
  const formik = useFormik({
    initialValues,
    validationSchema: contactSchema,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: async () => {
      try {
        const response = await axios.post(
          "https://bossdentindia.com/wp-json/custom/v1/submit-form",
          {
            name: formik?.values?.name,
            email: formik?.values?.email,
            phone: formik?.values?.phone,
            subject: formik?.values?.subject,
            message: formik?.values?.message,
            form_id: 1,
          }
        );
        if (response.data.success) {
          // alert("Form submitted successfully!");
          setShowAlert(true);
          formik.resetForm();
        } else {
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        }
      } catch (error) {
        toast.error("An error occurred");
        console.error("There was an error submitting the form:", error);
        // alert("An error occurred");
      } finally {
        setLoading(false);
      }
    },
  });
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Aos.init({
      duration: 1000,
      once: false,
      mirror: true,
    });
  }, []);

  return (
    <div className="container">
      <div className="header" data-aos="fade-up">
        <h1>Contact</h1>
        <BreadCrumbs />
      </div>
      <div className="contact-info">
        <div className="map" data-aos="zoom-in">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d22653.660484652923!2d72.893032!3d21.29031055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0474f4845eac3%3A0x15ce59a9f50ccaf5!2sAdvance%20Dental%20Export!5e1!3m2!1sen!2sin!4v1724932357670!5m2!1sen!2sin"
            width="80%"
            height="300"
            frameBorder="0"
            allowFullScreen=""
            aria-hidden="false"
            tabIndex="0"
            title="Google Maps"
          ></iframe>
        </div>
        <div className="details" data-aos="fade-right" data-aos-delay="400">
          <h2>Contact Information</h2>
          <p
          // data-aos="fade-right" data-aos-delay="200"
          >
            BossdentIndia (Disposables & Consumables) is an online dental
            product selling store based in Surat, Gujarat.
          </p>
          <div className="contact-detail">
            <div className="detail-row">
              <div className="detail-row-1">
                <p
                  className="detail-row-1-txt"
                  // data-aos="fade-right"
                  // data-aos-delay="300"
                >
                  Surat
                </p>
                <p
                  className="detail-row-1-txt-2"
                  // data-aos="fade-right"
                  // data-aos-delay="400"
                >
                  {/* Plot no.3-3/3-4/ Dhuna house, opp. Patel Nagar, A.k. Road,
                  Varachha, Surat */}
                  Plot No. 1 to 8, Marutidham Industrial Estate, Behind Hotel
                  Royal, Velanja Road, Umra, Surat-394130, Gujarat
                </p>
              </div>
              <div className="detail-row-2">
                <p className="detail-row-2-txt">
                  <a
                    href="mailto:zahndentaldepo@gmail.com"
                    // data-aos="fade-right"
                    // data-aos-delay="600"
                  >
                    zahndentaldepo@gmail.com
                  </a>
                </p>
                <p className="detail-row-2-txt">
                  <a
                    href="tel:+917698828883"
                    data-aos="fade-right"
                    data-aos-delay="700"
                  >
                    +91 76988 28883
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="contact-form">
        <div className="contact-content" data-aos="fade-left">
          <h2 data-aos="fade-right">Have You any Suggestion or Queries?</h2>
          <p data-aos="fade-right" data-aos-delay="200">
            Fill in the below form and we will get in touch with you as soon as
            possible.
          </p>
          <form
            onSubmit={formik.handleSubmit}
            className="contact-form row align-items-center mb-2"
            data-aos="fade-right"
            data-aos-delay="400"
          >
            <div
              className={
                formik?.errors?.name
                  ? "col-lg-6 col-12 mb-0"
                  : "col-lg-6 col-12"
              }
            >
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="form-control"
                value={formik?.values?.name || ""}
                onChange={formik?.handleChange}
                onBlur={formik?.handleBlur}
              />
              <div className="contactform-error">
                {formik?.errors?.name && formik?.touched?.name ? (
                  <p className="text-danger m-0">{formik?.errors?.name}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div
              className={
                formik?.errors?.email
                  ? "col-lg-6 col-12 mb-0"
                  : "col-lg-6 col-12"
              }
            >
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                className="form-control"
                value={formik?.values?.email || ""}
                onChange={formik?.handleChange}
                onBlur={formik?.handleBlur}
              />
              <div className="contactform-error">
                {formik?.errors?.email && formik?.touched?.email ? (
                  <p className="text-danger m-0">{formik?.errors?.email}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div
              className={
                formik?.phone ? "col-lg-6 col-12 mb-0" : "col-lg-6 col-12"
              }
            >
              <input
                type="number"
                name="phone"
                placeholder="Phone"
                className="form-control"
                value={formik?.values?.phone || ""}
                onChange={formik?.handleChange}
                onBlur={formik?.handleBlur}
              />
              <div className="contactform-error">
                {formik?.errors?.phone && formik?.touched?.name ? (
                  <p className="text-danger m-0">{formik?.errors?.phone}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-lg-6 col-12">
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                className="form-control"
                value={formik?.values?.subject || ""}
                onChange={formik?.handleChange}
                onBlur={formik?.handleBlur}
              />
              <div className="contactform-error">
                {formik?.errors?.subject && formik?.touched?.subject ? (
                  <p className="text-danger m-0">{formik?.errors?.subject}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-lg-12 col-12">
              <textarea
                name="message"
                placeholder="Message"
                className="form-control"
                value={formik?.values?.message || ""}
                onChange={formik?.handleChange}
                onBlur={formik?.handleBlur}
                rows="5"
              ></textarea>
              <div className="contactform-error">
                {formik?.errors?.message && formik?.touched?.message ? (
                  <p className="text-danger m-0">{formik?.errors?.message}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-12 contact-btn-wrapper">
              <button type="submit" className="contact-btn">
                SUBMIT NOW
              </button>
            </div>
          </form>
          {loading && (
            <div className="loader-overlay">
              <div>
                <div className="loader-spinner"></div>
                <div className="loader-message">
                  Please wait, your form is submitting...
                </div>
              </div>
            </div>
          )}
          {showAlert && (
            <AlertSuccess message="Your form is successfully submitted." />
          )}
        </div>
        <div className="form-image" data-aos="fade-left" data-aos-delay="400">
          <img src={contact} alt="Contact" />
        </div>
      </div>
    </div>
  );
};

export default Contact;

// const handleChange = (e) =>{
//   setFormData({
//     ...formData,
//     [e.target.name]: e.target.value,
//   });
// };
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   try{
//     const response = await axios.post(
//       'https://bossdentindia.com/wp-json/custom/v1/submit-form',
//       {
//         ...formData,
//         form_id:1,
//       }
//     );
//     if (response.data.success) {
//         // alert("Form submitted successfully!");
//         setShowAlert(true);
//         setFormData({
//           name: "",
//           email: "",
//           phone: "",
//           subject: "",
//           message: "",
//         });
//     } else {
//       setTimeout(() => {
//         setShowAlert(false);
//       }, 3000);
//     }
//   } catch (error){
//     console.error('There was an error submitting the form:', error);
//     alert('An error occurred');
//   } finally {
//     setLoading(false);
//   }
// };
