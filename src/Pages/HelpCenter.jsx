import React, { useState } from 'react'

const faqData = [
    { 
        question: "How to place an order?", 
        answer: [
          "For the product order follow the below instructions:",
  
          "1. Select your product",
          "2. Select size and quantity",
          "3. Click on add to cart",
          "4. Click on the cart icon & click on continue to checkout",
          "5. Enter you required details on the checkout page",
          "6. Select your payment options & click on place order button.",
          "Still unsatisfied, mail us zahndentaldepo@gmail.com",
        ]
    },
    { 
        question: "How to create an account?", 
        answer: [ "For create an account follow the below instructions.",

          "1. Click on User icon on the site header part.",
          "2. You can see login & register form on the my account page.",
          "3. Enter your details and click on register button.",
          "If you already have an account then you can enter your email/username and password in the login form on the my-account page.",
          ]
    },
    { 
        question: "How much time it takes to deliver the order?", 
        answer: "It takes 3-4 Business Days to deliver your order." 
    },
    { 
        question: "How can I contact the store?", 
          answer: [
        "Bossdentindia (Disposables & Consumables) is an online dental product selling store based in Surat Gujrat.", 
        "Address: Plot no.3-3/3-4/ Dhuna house, opp. Patel Nagar, A.k. Road, Varachha, Surat",
        "Email: zahndentaldepo@gmail.com",
        "Phone: +91 76988 28883",
        ] 
    },
  ];

const HelpCenter = () => {
    const [activeIndex, setActiveIndex] = useState("null");
    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
      };
  return (
    <div className="help-center">
      <div className='detalis'>
        <h1>Help Center</h1>
        <nav>
          <a href="/">Home</a> &gt; <span>Help Center</span>
        </nav>
      </div>
      
      <div className="faq-list">
        {faqData.map((faq, index) => (
          <div key={index} className="faq-item">
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              <span>+</span> {faq.question}
            </div>
            {activeIndex === index && 
              <div className="faq-answer">
                {Array.isArray(faq.answer) ? faq.answer.map((line, idx) => (
                  <p key={idx}>{line}</p>
                )) : <p>{faq.answer}</p>}
              </div>
            }
          </div>
        ))}
      </div>
    </div>
  )
}

export default HelpCenter