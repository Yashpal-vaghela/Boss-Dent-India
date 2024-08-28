import React, { useEffect, useState } from "react";
import contact from "../images/contact.png";
import Aos from "aos";
import axios from "axios";
import AlertSuccess from "../component/AlertSuccess";

const Contact = () => {
  const [formData,setFormData] = useState ({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>{
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try{
      const response = await axios.post(
        'https://bossdentindia.com/wp-json/custom/v1/submit-form',
        {
          ...formData,
          form_id:1,
        }
      );
      if (response.data.success) {
          // alert("Form submitted successfully!");
          setShowAlert(true);
          setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
          });
      } else {
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      }
    } catch (error){
      console.error('There was an error submitting the form:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };
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
        <a href="/">Home</a> <span>&gt; Contact</span>
      </div>
      <div className="contact-info" >
        <div className="map" data-aos="fade-left">
          <iframe
            src="https://maps.google.com/maps?q=Plot%20no.3-3%2F3-4%2F%20Dhuna%20house%2C%20opp.patel%20nagar%2C%20A.k.%20Road%2Cvarachha%2CSurat&t=m&z=12&output=embed&iwloc=near"
            width="80%"
            height="300"
            frameBorder="0"
            allowFullScreen=""
            aria-hidden="false"
            tabIndex="0"
            title="Google Maps"
          ></iframe>
        </div>
        <div className="details" data-aos="fade-right">
          <h2>Contact Information</h2>
          <p data-aos="fade-right" data-aos-delay="200">
            BossdentIndia (Disposables & Consumables) is an online dental
            product selling store based in Surat, Gujarat.
          </p>
          <div className="contact-detail" >
            <div className="detail-row">
              <div className="detail-row-1">
                <p className="detail-row-1-txt"
                  data-aos="fade-right" data-aos-delay="300"
                >Surat</p>
                <p className="detail-row-1-txt-2"
                   data-aos="fade-right" data-aos-delay="400"                
                >
                  Plot no.3-3/3-4/ Dhuna house, opp. Patel Nagar, A.k. Road,
                  Varachha, Surat
                </p>
              </div>
              <div className="detail-row-2">
                <p className="detail-row-2-txt">
                  <a href="mailto:zahndentaldepo@gmail.com"
                    data-aos="fade-right" data-aos-delay="600"
                  >
                    zahndentaldepo@gmail.com
                  </a>
                </p>
                <p className="detail-row-2-txt">
                  <a href="tel:+917698828883"
                    data-aos="fade-right" data-aos-delay="700"
                  >+91 76988 28883</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="contact-form" >
        <div className="contact-content" data-aos="fade-left">
          <h2 data-aos="fade-right" data-aos-delay="0">Have You any Suggestion or Queries?</h2>
          <p data-aos="fade-right" data-aos-delay="200">
            Fill in the below form and we will get in touch with you as soon as
            possible.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="input-row" >
              <input 
                type="text" 
                name="name" 
                placeholder="Name"
                value={formData.name}
                onChange={handleChange} 
                data-aos="fade-right" data-aos-delay="400"
                required />
              <input 
                type="email" 
                name="email" 
                placeholder="E-mail"
                value={formData.email}
                onChange={handleChange}
                data-aos="fade-left" data-aos-delay="400" 
                required />
            </div>
            <div className="input-row">
              <input 
                type="number" 
                name="phone" 
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                data-aos="fade-right" data-aos-delay="600" 
                required />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                data-aos="fade-left" data-aos-delay="600"
                required
              />
            </div>
            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              required
              data-aos="fade-left" data-aos-delay="700"
            ></textarea>
            <button type="submit" data-aos="fade-right" data-aos-delay="700">SUBMIT NOW</button>
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
          {showAlert && <AlertSuccess message="Your form is successfully submitted."/>}
        </div>
        <div className="form-image" data-aos="fade-right">
          <img src={contact} alt="Contact" />
        </div>
      </div>
    </div>
  );
};

export default Contact;
