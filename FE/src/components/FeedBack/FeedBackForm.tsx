import React, { useState } from 'react';
// import Rating from 'react-rating-stars-component';
import { FaStar } from 'react-icons/fa';
import './FeedBackForm.scss';
import Evaluate from '../Evaluate/Evaluate';
import TextOnlyInput from '../UI/TextOnlyInput';
const FeedbackForm: React.FC = () => {
    const [overallRating, setOverallRating] = useState(0);
    const [foodComment, setFoodComment] = useState('');
    const [serviceComment, setServiceComment] = useState('');
    const [staffRating, setStaffRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const feedbackData = {
            overallRating,
            foodComment,
            serviceComment,
            staffRating,
        };
        console.log('Feedback:', feedbackData);
        // TODO: Gửi dữ liệu về server tại đây
        setSubmitted(true);
    };

    return (
        <div className="feedback-form">
            {submitted ? (
                <div className="thank-you">
                    <h2>Cảm ơn bạn đã đánh giá!</h2>
                    <p>Chúng tôi trân trọng mọi phản hồi để nâng cao dịch vụ.</p>
                </div>
            ) : (
                <>
                    <h2>Đánh giá trải nghiệm của bạn</h2>
                    <form
                    // onSubmit={handleSubmit}
                    >
                        <div className="rating">
                            <label>Đánh giá tổng thể:</label>
                            {/* <Rating
                                count={5}
                                value={overallRating}
                                onChange={(rating) => setOverallRating(rating)}
                                size={30}
                                activeColor="#ffd700"
                                emptyIcon={<FaStar />}
                                filledIcon={<FaStar />}
                            /> */}
                            {/* <Evaluate onSubmit={e => handleSubmit}></Evaluate> */}
                        </div>

                        <div>
                            <label>Nhận xét về món ăn:</label>
                            <TextOnlyInput
                                // rows={3}
                                value={foodComment}
                                onChange={setServiceComment}
                            // onChange={(e) => setFoodComment(e.target.value)}
                            // required
                            />
                        </div>

                        <div>
                            <label>Nhận xét về dịch vụ:</label>
                            <textarea
                                rows={3}
                                value={serviceComment}
                                onChange={(e) => setServiceComment(e.target.value)}
                                required
                            />
                        </div>

                        <div className="rating">
                            <label>Thái độ phục vụ của nhân viên:</label>
                            {/* <Rating
                                count={5}
                                value={staffRating}
                                onChange={(rating) => setStaffRating(rating)}
                                size={30}
                                activeColor="#ffd700"
                                emptyIcon={<FaStar />}
                                filledIcon={<FaStar />}
                            /> */}
                        </div>

                        <button type="submit" className="submit-btn">
                            Gửi đánh giá
                        </button>
                    </form>
                </>
            )}
        </div>
    );
};

export default FeedbackForm;
