import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaStar } from 'react-icons/fa';
import "../css/review.css";

const ReviewList = ({productId}) => {
    const [reviews, setReviews] = useState([]);
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(
                    `https://bossdentindia.com/wp-json/wp/v2/reviews?product_id=${productId}`
                );
                setReviews(response.data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };
        fetchReviews();
    }, [productId]);
    return (
        <div className='reviews-list'>
            <h2>Customer Review</h2>
            {reviews.length === 0 ? (
                <p>No reviews yet. Be the first to review this product!</p>
            ) : (
                reviews.map((review) => {
                    const rating = parseInt(review.rating, 10); // Ensuring rating is a number
                    return (
                        <div key={review.id} className='review-item'>
                            <div className='review-rating'>
                                {[...Array(rating)].map((_, index) => (
                                    <FaStar key={index} size={20} className='star filled' />
                                ))}
                            </div>
                            <p>{review.content}</p>
                            <p className='review-author'>~{review.author}</p>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default ReviewList