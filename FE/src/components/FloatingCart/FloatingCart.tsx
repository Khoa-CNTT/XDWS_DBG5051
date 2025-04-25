import { useState, useEffect, useRef } from 'react';
import './FloatingCart.scss';

interface FloatingCartProps {
  itemCount: number;
  onCartClick: () => void;
}

const FloatingCart = ({ itemCount, onCartClick }: FloatingCartProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevItemCountRef = useRef(itemCount);

  useEffect(() => {
    if (itemCount > 0 && !isVisible) {
      setIsVisible(true);
    }

    if (itemCount > prevItemCountRef.current) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500);

      return () => clearTimeout(timer);
    }

    prevItemCountRef.current = itemCount;
  }, [itemCount, isVisible]);

  if (!isVisible && itemCount === 0) {
    return null;
  }

  return (
    <div
      className={`floating-cart ${isAnimating ? 'pulse' : ''}`}
      onClick={onCartClick}
      aria-label="Xem giỏ hàng"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="cart-icon"
      >
        <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
      </svg>
      {itemCount > 0 && (
        <span className="cart-count">{itemCount}</span>
      )}
      <div className="cart-tooltip">Xem giỏ hàng</div>
    </div>
  );
};

export default FloatingCart;
