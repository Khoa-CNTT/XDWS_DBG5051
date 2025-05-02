import React, { useEffect } from 'react';
import './Toast.scss';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', duration = 3000, onClose }) => {
  useEffect(() => {
    // Automatically close the toast after specified duration
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    
    // Clean up the timer when component unmounts
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Render appropriate icon based on toast type
  const renderIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '⚠';
      case 'info':
        return 'ℹ';
      case 'warning':
        return '!';
      default:
        return null;
    }
  };

  return (
    <div className={`toast ${type}`}>
      <div className="toast-content">
        <span className="toast-icon">{renderIcon()}</span>
        <span className="toast-message">{message}</span>
        <button className="toast-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
};