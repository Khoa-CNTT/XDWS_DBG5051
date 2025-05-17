import React, { useState } from 'react';
import styles from './Evaluate.module.scss';
import { Fa1 } from 'react-icons/fa6';
import { FaStar } from 'react-icons/fa';

type RatingFormProps = {
    onSubmit: (rating: number, comment: string) => void;
};

const Evaluate: React.FC<RatingFormProps> = ({ onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState<number | null>(null);
    const [comment, setComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            alert('Vui lòng chọn số sao để đánh giá!');
            return;
        }
        onSubmit(rating, comment);
        setRating(0);
        setComment('');
    };

    return (
        <form onSubmit={handleSubmit} className={styles.ratingForm}>
            <h2 className={styles.title}>
                <span className={styles.star}>
                    <FaStar />
                </span>
                Đánh giá món ăn
            </h2>

            <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={
                            (hover ?? rating) >= star ? styles.activeStar : styles.starItem
                        }
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(null)}
                    >
                        <FaStar />
                    </span>
                ))}
            </div>

            <textarea
                className={styles.textarea}
                placeholder="Viết nhận xét của bạn..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
            />

            <button type="submit" className={styles.submitButton}>
                Gửi đánh giá
            </button>
        </form>
    );
};

export default Evaluate;
