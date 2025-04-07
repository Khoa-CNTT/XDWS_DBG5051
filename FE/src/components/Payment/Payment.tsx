import { useState } from 'react';
import {
  paymentMethods,
  processPayment,
  PaymentDetails
} from '../../services/paymentService';
import './Payment.scss';

interface PaymentProps {
  amount: number;
  onPaymentComplete: (success: boolean, transactionId?: string) => void;
  onCancel: () => void;
}

const Payment = ({ amount, onPaymentComplete, onCancel }: PaymentProps) => {
  const [selectedMethod, setSelectedMethod] = useState('credit_card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format card number with spaces after every 4 digits
    const value = e.target.value.replace(/\s/g, '');
    if (/^\d*$/.test(value) && value.length <= 16) {
      const formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
      setCardNumber(formattedValue);
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format expiry date as MM/YY
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      let formattedValue = value;
      if (value.length > 2) {
        formattedValue = `${value.slice(0, 2)}/${value.slice(2)}`;
      }
      setExpiryDate(formattedValue);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers for CVV
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 3) {
      setCvv(value);
    }
  };

  const handlePayment = async () => {
    setError(null);
    setIsProcessing(true);

    // Different handling based on payment method
    if (selectedMethod === 'credit_card') {
      try {
        const paymentDetails: PaymentDetails = {
          cardNumber,
          cardHolder,
          expiryDate,
          cvv,
          amount
        };

        const result = await processPayment(paymentDetails);

        if (result.success) {
          onPaymentComplete(true, result.transactionId);
        } else {
          setError(result.error || 'Thanh toán thất bại. Vui lòng thử lại.');
        }
      } catch (err) {
        setError('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại sau.');
      } finally {
        setIsProcessing(false);
      }
    } else if (selectedMethod === 'cash') {
      // For cash payment, just succeed immediately
      setTimeout(() => {
        onPaymentComplete(true, `CASH-${Date.now()}`);
        setIsProcessing(false);
      }, 500);
    } else {
      // For other methods, just simulate a successful payment
      setTimeout(() => {
        onPaymentComplete(true, `${selectedMethod.toUpperCase()}-${Date.now()}`);
        setIsProcessing(false);
      }, 1500);
    }
  };

  return (
    <div className="payment-overlay">
      <div className="payment-modal">
        <div className="payment-header">
          <h2>Thanh toán</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <div className="payment-body">
          <div className="payment-amount">
            <span className="label">Tổng cộng:</span>
            <span className="amount">{amount.toLocaleString()}đ</span>
          </div>

          <div className="payment-methods">
            <h3>Chọn phương thức thanh toán</h3>
            <div className="methods-list">
              {paymentMethods.map(method => (
                <div
                  key={method.id}
                  className={`method-item ${selectedMethod === method.id ? 'active' : ''}`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <span className="method-icon">{method.icon}</span>
                  <span className="method-name">{method.name}</span>
                </div>
              ))}
            </div>
          </div>

          {selectedMethod === 'credit_card' && (
            <div className="credit-card-form">
              <div className="form-group">
                <label htmlFor="cardNumber">Số thẻ</label>
                <input
                  type="text"
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  disabled={isProcessing}
                />
              </div>

              <div className="form-group">
                <label htmlFor="cardHolder">Tên chủ thẻ</label>
                <input
                  type="text"
                  id="cardHolder"
                  placeholder="NGUYEN VAN A"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                  disabled={isProcessing}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryDate">Ngày hết hạn</label>
                  <input
                    type="text"
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={handleExpiryDateChange}
                    disabled={isProcessing}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    placeholder="123"
                    value={cvv}
                    onChange={handleCvvChange}
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </div>
          )}

          {(selectedMethod === 'momo' || selectedMethod === 'zalopay') && (
            <div className="qr-payment">
              <p>Quét mã QR bên dưới để thanh toán:</p>
              <div className="qr-code-placeholder">
                <div className="mock-qr-code">
                  QR {selectedMethod === 'momo' ? 'MoMo' : 'ZaloPay'}
                </div>
              </div>
              <p className="hint">Sau khi quét mã và thanh toán thành công, nhấn nút bên dưới.</p>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <div className="payment-actions">
            <button
              className="cancel-btn"
              onClick={onCancel}
              disabled={isProcessing}
            >
              Hủy
            </button>
            <button
              className="pay-btn"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing
                ? 'Đang xử lý...'
                : `Thanh toán ${amount.toLocaleString()}đ`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
