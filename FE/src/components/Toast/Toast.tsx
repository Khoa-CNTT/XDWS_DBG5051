import React, { useEffect } from 'react';
import './Toast.scss';

interface ToastProps {
  message: string;
  duration?: number;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  duration = 3000,
  type = 'success',
  onClose
}) => {
  useEffect(() => {
    // Automatically close the toast after specified duration
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    // Clean up the timer when component unmounts
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast-container ${type}`}>
      <div className="toast-content">
        <div className="toast-message">{message}</div>
        <button className="toast-close" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};