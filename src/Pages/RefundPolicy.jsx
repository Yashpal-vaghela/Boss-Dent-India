import React from 'react'
import BreadCrumbs from '../component/BreadCrumbs'

const RefundPolicy = () => {
  return (
    <div className='refund-policy'>
        <div className='header'>
            <h1>Refund and Returns Policy</h1>
            <BreadCrumbs></BreadCrumbs>
        </div>
        <div className='content'> 
            <h2>Refund and Returns Policy for BossDentIndia</h2>
            <p>
                Thank you for shopping at BossDentIndia. We strive to provide you with high-quality products and excellent customer service. In the event that you are not completely satisfied with your purchase, we have outlined our Refund and Returns Policy to ensure a smooth and satisfactory resolution.
            </p>
            <h2>1. Return Policy</h2>

            <h3>1.1 Eligibility for Returns:</h3>
            <ul>
                <li>We accept returns for products that are damaged during transit, defective, wrongly delivered, wrong product, incomplete packages, etc..</li>
                <li>Returns must be reported within 72 hours from the date of receipt of the product.</li>
                <li>The Products must be returned in their original condition and packaging.</li>
            </ul>
            <h3> 1.2 Immediate Action for Damaged Parcels:</h3>
            <ul>
               <li>If you receive a damaged parcel, please report it immediately or within 48 hours of receipt.</li> 
            </ul>
            <h3>1.3 Replacement For Disposable Items:</h3>
            <ul>
                <li>
                Disposable items will be eligible for return only against replacement.
                </li>
            </ul>
            <h3>1.3 Defective Products:</h3>
            <ul>
                <li>
                    If you receive a defective product, than reports to us immediately as soon as possiable,so that we can arrange replacement of the same model will be provided by us at no additional cost.
                </li>
            </ul>
            <h2>2. Return Process</h2>
            <h3>2.1 Contact Customer Support:</h3>
            <ul>
               <li>To initiate a return, please contact our customer support team through the designated communication channels mentioned on our website. Provide the necessary details such as your order number, product information, and reason for return.</li> 
            </ul>
            <h3>2.2 Return Authorization:</h3>
            <ul>
                <li>
                Our Customer support team will check that product is authorize to return or not, Once if product is authorize to return than, Our team will be guide you how to return that product, Please do not return any items without obtaining the necessary authorization.
                </li>
            </ul>
            <h3>2.3 Return Shipping:</h3>
            <ul>
                <li>
                For authorized product to return, We will provide you return shipping label, Our customer support team will you provide correct return shipping method and correct Address related information. You must have to follow that instruction which was provided by customer support team.
                </li>
            </ul>
            <h3>2.4 Return Inspection and Refund:</h3>
            <ul>
                <li>
                Once we received your returned product, That Product will inspected by our technical team, If product approved by team. After that We will start your refund process and it will take time of serval buisness day to reflect in your bank account.
                </li>
            </ul>
            <h2>3. Non-Returnable Items</h2>
            <p style={{ marginLeft: "25px" }}>The following items are not eligible for return or refund unless they are received in a damaged or defective condition:</p>
            <ul>
                <li>Opened or used products.</li>
                <li>Products without the original packaging.</li>
                <li>Products with missing sub-parts.</li>
                <li>Products with a tampered seal or packaging</li>
                <li>Perishable or consumable Products</li>
                <li>All Disposable Items</li>
            </ul>
            <h2>4. Refund Timeline</h2>
            <p style={{ marginLeft:"25px"}}>The refund processing time will be depend on the payment method and finance department.The refund is processed by us, it may take 10 to 15 business days for the funds to appear in your account.</p>
            <h2>5. Contact us</h2>
            <p>If you have any questions, or concerns, or need assistance with our Refund and Returns Policy, please contact our customer support team through the designated communication channels mentioned on our website. We are here to help you and ensure your satisfaction.</p>
            <p>Please note that this policy is subject to change without prior notice. It is your responsibility to review the policy periodically for any updates.</p>
        </div>
    </div>
  )
}

export default RefundPolicy