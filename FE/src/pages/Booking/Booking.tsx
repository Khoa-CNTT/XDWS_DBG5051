import { useState } from 'react';
import './Booking.scss';
import axios from 'axios';
import { bookingService } from '../../services/bookingService';
import { Toast } from '../../components/Toast/Toast';

const Booking = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '',
    booking_date: '',
    time: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>({
    show: false,
    message: '',
    type: 'success'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const selectedDate = formData.booking_date ? new Date(formData.booking_date) : null;
    if (selectedDate) {
      selectedDate.setHours(0, 0, 0, 0);
    }
    
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.booking_date) {
      newErrors.booking_date = 'Vui lòng chọn ngày đặt bàn';
    } else if (selectedDate && selectedDate < today) {
      newErrors.booking_date = 'Không thể chọn ngày trong quá khứ';
    }

    if (!formData.time) {
      newErrors.time = 'Vui lòng chọn giờ';
    }

    if (!formData.guests) {
      newErrors.guests = 'Vui lòng nhập số lượng khách';
    } else if (parseInt(formData.guests) < 1 || parseInt(formData.guests) > 20) {
      newErrors.guests = 'Số lượng khách phải từ 1-20 người';
    }

    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Vui lòng nhập họ tên';
    }

    if (!formData.phone) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ (phải bắt đầu bằng 03, 05, 07, 08, 09 và có 10 số)';
    }

    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const bookingData = {
        customer_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        guests: Number(formData.guests),
        booking_date: formData.booking_date,
        booking_time: formData.time,
        note: formData.notes,
      };

      try {
        console.log('Sending booking data:', bookingData);
        const response = await bookingService.createBooking(bookingData);
        console.log('Booking response:', response);

        setToast({
          show: true,
          message: 'Đặt bàn thành công!',
          type: 'success'
        });

        setFormData({
          name: '',
          email: '',
          phone: '',
          guests: '',
          booking_date: '',
          time: '',
          notes: '',
        });
      } catch (error: any) {
        console.error('Booking error:', error);
        const errorMessage = error.response?.data?.message || 'Đặt bàn thất bại, vui lòng thử lại.';
        setToast({
          show: true,
          message: errorMessage,
          type: 'error'
        });
      }
    } else {
      const firstErrorField = document.querySelector('.error-message');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="booking-page">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
        />
      )}

      <div className="booking-header">
        <div className="container">
          <h1>Đặt Bàn dễ dàng tại nhà hàng Gogi</h1>
          <p>Đặt bàn trực tuyến, đảm bảo chất lượng dịch vụ, món ngon và địa điểm ưng ý cho mọi thực khách.</p>
        </div>
      </div>

      <div className="booking-content">
        <div className="container">
          <form className="booking-form" onSubmit={handleSubmit} noValidate>
            <div className="form-section">
              <h2>Thông tin đặt bàn</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="booking_date">Ngày đặt bàn <span className="required">*</span></label>
                  <input
                    type="date"
                    id="booking_date"
                    name="booking_date"
                    value={formData.booking_date}
                    onChange={handleChange}
                    min={todayStr}
                    className={errors.booking_date ? 'error' : ''}
                  />
                  {errors.booking_date && <div className="error-message">{errors.booking_date}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="time">Giờ đặt bàn <span className="required">*</span></label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className={errors.time ? 'error' : ''}
                  />
                  {errors.time && <div className="error-message">{errors.time}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="guests">Số lượng khách <span className="required">*</span></label>
                  <input
                    type="number"
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    min="1"
                    max="20"
                    className={errors.guests ? 'error' : ''}
                  />
                  {errors.guests && <div className="error-message">{errors.guests}</div>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Thông tin liên hệ</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Họ tên <span className="required">*</span></label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <div className="error-message">{errors.name}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Số điện thoại <span className="required">*</span></label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <div className="error-message">{errors.phone}</div>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email <span className="required">*</span></label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="notes">Ghi chú</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="form-policy">
                <p>Bạn đã xác nhận đọc và đồng ý với các chính sách bảo mật của datban.ggg.com.vn</p>
              </div>

              <button type="submit" className="booking-submit-btn">
                Đặt bàn ngay
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;