import React from "react";
import contact from "../images/contact.png";

const Contact = () => {
  return (
    <div className="container">
      <div className="header">
        <h1>Contact</h1>
        <a href="/">Home</a> <span>&gt; Contact</span>
      </div>
      <div className="contact-info">
        <div className="map">
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
        <div className="details">
          <h2>Contact Information</h2>
          <p>
            BossdentIndia (Disposables & Consumables) is an online dental
            product selling store based in Surat, Gujarat.
          </p>
          <div className="contact-detail">
            <div className="detail-row">
              <div className="detail-row-1">
                <p className="detail-row-1-txt">Surat</p>
                <p className="detail-row-1-txt-2">
                  Plot no.3-3/3-4/ Dhuna house, opp. Patel Nagar, A.k. Road,
                  Varachha, Surat
                </p>
              </div>
              <div className="detail-row-2">
                <p className="detail-row-2-txt">
                  <a href="mailto:zahndentaldepo@gmail.com">
                    zahndentaldepo@gmail.com
                  </a>
                </p>
                <p className="detail-row-2-txt">
                  <a href="tel:+917698828883">+91 76988 28883</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="contact-form">
        <div className="contact-content">
          <h2>Have You any Suggestion or Queries?</h2>
          <p>
            Fill in the below form and we will get in touch with you as soon as
            possible.
          </p>
          <form>
            <div className="input-row">
              <input type="text" name="name" placeholder="Name" required />
              <input type="email" name="email" placeholder="E-mail" required />
            </div>
            <div className="input-row">
              <input type="number" name="phone" placeholder="Phone" required />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                required
              />
            </div>
            <textarea
              name="comment"
              placeholder="Comment"
              rows="5"
              required
            ></textarea>
            <button type="submit">SUBMIT NOW</button>
          </form>
        </div>
        <div className="form-image">
          <img src={contact} alt="Contact" />
        </div>
      </div>
    </div>
  );
};

export default Contact;