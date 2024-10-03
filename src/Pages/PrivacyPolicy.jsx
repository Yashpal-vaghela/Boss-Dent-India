import React from "react";
import BreadCrumbs from "../component/BreadCrumbs";

const PrivacyPolicy = () => {
  return (
    <div className="container">
      <div className="privacy-policy">
        <div className="header" data-aos="fade-up">
          <h1>Privacy Policy</h1>
          <BreadCrumbs></BreadCrumbs>
        </div>
        <div className="policy-info">
          <p>
            At <strong>BossDentIndia</strong>, we value and prioritize the
            privacy of our users and are committed to protecting their personal
            information. This Privacy Policy outlines how we collect, use, and
            safeguard the information you provide when using our online shopping
            website. By accessing or using BossDentIndia, you agree to the terms
            and practices described in this policy.
          </p>
          <h2> 1. Information Collection</h2>
          <h3>1.1 Personal Information:</h3>
          <ul>
            <li>
              {" "}
              When you register an account or make a purchase on BossDentIndia,
              we may collect personal information, like your name, email
              address, phone number, shipping address, and payment details. we
              collect only necessary information of your, for fulfill your Order
              and improve your shopping experience with us.
            </li>
          </ul>
          <h3>1.2 Cookies and Tracking Technologies</h3>
          <ul>
            <li>
              BossDentIndia uses cookies and similar technologies to enhance
              your browsing experience, analyze website traffic, and personalize
              content. These technologies may collect non-personal information
              such as your IP address, browser type, device information, and
              browsing patterns. You can adjust your browser settings to manage
              or disable cookies, but some features of BossDentIndia may not
              function properly.
            </li>
          </ul>
          <h2>2. Information Usage</h2>
          <h3>2.1 Order Processing:</h3>
          <ul>
            <li>
              We use your personal information to process and fulfill your
              orders, including shipping and payment processing. Specifically:
            </li>
            <li>
              <strong>Order Fulfillment:</strong> We will dispatch your order
              within 24 to 48 hours after receiving the payment of your order.
            </li>
            <li>
              <strong>Shipping:</strong> We manage the shipping of your order to
              ensure it reaches you in a timely manner.
            </li>
            <li>
              <strong>Payment Processing:</strong> We securely handle your
              payment information to process your transaction.
            </li>
            <li>
              <strong>Order Updates:</strong> We may communicate with you
              regarding the status of your order, including any updates or
              changes.
            </li>
            <li>
              <strong>Customer Support:</strong> We provide support for any
              inquiries or issues related to your order.
            </li>
          </ul>
          <h3>2.2 Personalization</h3>
          <ul>
            <li>
              With your consent, we may use your information to personalize your
              shopping experience on BossDentIndia. This includes recommending
              products, displaying targeted advertisements, and offering
              personalized promotions or discounts.
            </li>
          </ul>
          <h3>2.3 Communication:</h3>
          <ul>
            <li>
              We may use your contact information to send you transactional
              emails, such as order confirmations, shipping notifications, and
              customer support responses. We may also send you promotional
              emails, newsletters, or marketing communications if you opt-in to
              receive them. You can unsubscribe from these communications at any
              time.
            </li>
          </ul>

          <h3>2.4 Analytics and Improvements:</h3>
          <ul>
            <li>
              We utilize collected data to analyze website performance, monitor
              trends, and enhance our services. This helps us improve the
              functionality, content, and layout of BossDentIndia and provide a
              better user experience.
            </li>
          </ul>

          <h2>3. Information Sharing</h2>
          <h3>3.1 Third-Party Service Providers</h3>
          <ul>
            <li>
              To facilitate certain functions and services, we may share your
              personal information with trusted third-party service providers.
              These providers assist us with tasks such as payment processing,
              shipping, data analysis, marketing, and customer support. We
              ensure that these providers adhere to strict confidentiality and
              data protection standards.
            </li>
          </ul>
          <h3>3.2 Legal Compliance:</h3>
          <ul>
            <li>
              We may disclose your personal information if required by law,
              legal proceedings, or governmental requests. We may also disclose
              information to protect our rights, safety, or property, as well as
              the rights, safety, or property of our users or others.
            </li>
          </ul>
          <h2>4. Data Security</h2>
          <ul>
            <li>
              BossDentIndia implements appropriate technical and organizational
              measures to protect your personal information from unauthorized
              access, alteration, disclosure, or destruction. However, please
              note that no method of transmission over the Internet or
              electronic storage is 100% secure. While we strive to protect your
              information, we cannot guarantee absolute security.
            </li>
          </ul>
          <h2> 5. Children’s Privacy </h2>
          <ul>
            <li>
              BossDentIndia is intended for use by individuals who are 18 years
              of age or older. We do not knowingly collect or solicit personal
              information from anyone under the age of 18. If you are under 18,
              please do not use BossDentIndia or provide any personal
              information.
            </li>
          </ul>
          <h3>6. Updates to this Policy </h3>
          <ul>
            <li>
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or legal requirements. The updated policy
              will be posted on BossDentIndia, and the revised effective date
              will be indicated. We encourage you to review the policy
              periodically to stay informed about our privacy practices.
            </li>
          </ul>
          <h3>7. Contact Us</h3>
          <ul>
            <li>
              If you have any questions, concerns, or requests regarding this
              Privacy Policy or the handling of your personal.
            </li>
          </ul>
          <h3>Subject to Surat Jurisdiction only</h3>
        </div>
      </div>
    </div>
  );
};
export default PrivacyPolicy;
