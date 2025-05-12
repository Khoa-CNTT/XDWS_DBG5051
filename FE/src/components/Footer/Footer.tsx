import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube, FaPhone } from 'react-icons/fa';
import './Footer.scss';
import { FaMessage } from 'react-icons/fa6';
import { useState } from 'react';
import ChatBot from '../ChatBot/ChatBot';

const Footer = () => {

  const [showChatBot, setShowChatBot] = useState(false);

  const handleMessage = () =>{
    setShowChatBot(!showChatBot);
  }
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>CÔNG TY CỔ PHẦN TẬP ĐOÀN SMART ODER</h3>
              <p>Trụ sở chính: Số 60 Phố Giang Văn Minh, Phường Đội Cấn,<br />Quận Ba Đình, Thành phố Hà Nội, Việt Nam</p>
              <p>VPGD: Tầng 6, Tòa nhà Toyota, Số 315 Trường Chinh, P.Khương<br />Mai, Q.Thanh Xuân, TP Hà Nội, Việt Nam.</p>
              <p>Chịu trách nhiệm nội dung: (Bà) Đào Chi Anh</p>
              <p>GPKD: 0102721191 cấp ngày 09/04/2008</p>
              <p>T: 043 222 3000 Email: support.hn@ggg.com.vn</p>
            </div>

            <div className="footer-section">
              <h3>HỖ TRỢ KHÁCH HÀNG</h3>
              <ul>
                <li><Link to="/terms">Điều khoản sử dụng</Link></li>
                <li><Link to="/privacy">Chính sách bảo mật</Link></li>
                <li><Link to="/membership">Chính sách thành viên</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3>TẢI APP Smart Oder</h3>
              <div className="app-links">
                <a href="" target="_blank" rel="noopener noreferrer">
                  <img src="https://ext.same-assets.com/0/148187491.svg" alt="App Store" />
                </a>
                <a href="" target="_blank" rel="noopener noreferrer">
                  <img src="https://ext.same-assets.com/0/3513627406.svg" alt="Google Play" />
                </a>
              </div>
              <p>Smart Oder - Siêu ứng dụng cho tín đồ ẩm thực.<br />Tải App Hôm Nay Chạm Ngay Ưu Đãi.</p>

              <div className="social-links">
                <a href="" target="_blank" rel="noopener noreferrer">
                  <FaFacebookF />
                </a>
                <a href="" target="_blank" rel="noopener noreferrer">
                  <FaInstagram />
                </a>
                <a href="" target="_blank" rel="noopener noreferrer">
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© 2025 Smart Oder ., JSC. All rights reserved</p>
        </div>
      </div>
      {showChatBot && (
        <div
          style={{
            position: 'fixed',
            bottom: 100,
            right: 30,
            zIndex: 1000,
          }}
        >
          <ChatBot />
        </div>
      )}
      <a onClick={handleMessage} className="hotline-btn">
        <div className="hotline-btn-circle">
          <FaMessage />
        </div>
      </a>
    </footer>
  );
};

export default Footer;
