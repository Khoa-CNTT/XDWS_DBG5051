import { useState } from 'react';
import './Booking.scss';

const Booking = () => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: '',
    name: '',
    phone: '',
    email: '',
    notes: '',
    withChildren: false,
    birthday: false,
    window: false,
    childrenChair: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Xóa lỗi khi người dùng sửa trường đó
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const selectedDate = formData.date ? new Date(formData.date) : null;
    if (selectedDate) {
      selectedDate.setHours(0, 0, 0, 0);
    }
    
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Kiểm tra các lỗi form
    if (!formData.date) {
      newErrors.date = 'Vui lòng chọn ngày đặt bàn';
    } else if (selectedDate && selectedDate < today) {
      newErrors.date = 'Không thể chọn ngày trong quá khứ';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Booking data:', formData);
      alert('Đặt bàn thành công!');
      // Reset form sau khi đặt bàn thành công
      setFormData({
        date: '',
        time: '',
        guests: '',
        name: '',
        phone: '',
        email: '',
        notes: '',
        withChildren: false,
        birthday: false,
        window: false,
        childrenChair: false,
      });
    } else {
      // Cuộn đến phần tử có lỗi đầu tiên
      const firstErrorField = document.querySelector('.error-message');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="booking-page">
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
                  <label htmlFor="date">Ngày đặt bàn <span className="required">*</span></label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={todayStr}
                    className={errors.date ? 'error' : ''}
                  />
                  {errors.date && <div className="error-message">{errors.date}</div>}
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

              <div className="checkboxes">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="withChildren"
                    name="withChildren"
                    checked={formData.withChildren}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="withChildren">Có trẻ em</label>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="birthday"
                    name="birthday"
                    checked={formData.birthday}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="birthday">Tiệc sinh nhật</label>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="window"
                    name="window"
                    checked={formData.window}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="window">Bàn gần cửa sổ</label>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="childrenChair"
                    name="childrenChair"
                    checked={formData.childrenChair}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="childrenChair">Cần ghế trẻ em</label>
                </div>
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