import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";

const ReviewForm = ({ productId }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [author, setAuthor] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const token = localStorage.getItem("token");
    const handleRatingClick = (value) => {
        setRating(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!rating || !comment || !author || !email) {
            setError("Please provide a rating, comment, name, and email.");
            return;
        }

        try {
            const response = await axios.post(
                `https://bossdentindia.com/wp-json/wp/v2/reviews`,
                {
                    product_id: productId,
                    rating,
                    content: comment,
                    author,
                    email
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200){
                setSuccess(true);
                setRating(0);
                setComment("");
                setAuthor("");
                setEmail("");  
            } else {
                setError("Failed to submit review. Please try again.")
            }
            
        } catch (error) {
            setError(error.response?.data?.message || "Error submitting review. Please try again.");
        }
    };
    return (
        <div className="review-form">
            <h2>Add a Review</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">Review submitted!</p>}
            <form onSubmit={handleSubmit}>
                <div className="rating-stars">
                    {[...Array(5)].map((_, index) => (
                        <FaStar
                            key={index}
                            size={30}
                            className={rating > index ? "star filled" : "star"}
                            onClick={() => handleRatingClick(index + 1)}
                        />
                    ))}
                </div>
                <input
                    className="review-input" 
                    type="text"
                    placeholder="Your Name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                />
                <input 
                    className="review-input1"
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <textarea
                    className="review-textarea"
                    placeholder="Write your review here..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                />
                <button type="submit" className="submit-review-btn">
                    Submit Review
                </button>
            </form>
        </div>
    );
};

export default ReviewForm