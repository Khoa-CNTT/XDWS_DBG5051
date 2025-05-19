import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube, FaPhone } from 'react-icons/fa';
import './Footer.scss';
import { FaMessage } from 'react-icons/fa6';
import { useState } from 'react';
import ChatBot from '../../ChatBot/ChatBot';

const Footer = () => {

  const [showChat, setShowChat] = useState(false)
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>CÔNG TY CỔ PHẦN TẬP ĐOÀN SMART ODER</h3>
              <p>Trụ sở chính: Số 313 Thanh Thanh, Phường Cici,<br />Thành phố Hà Nội, Việt Nam</p>
              <p>Chịu trách nhiệm nội dung: (Ông) Lương Thanh</p>
              <p>GPKD: 01010101010 cấp ngày 01/03/2025</p>
              <p>T: 033 6560 061 Email: support.hn@ggg.com.vn</p>
            </div>

            <div className="footer-section">
              <h3>HỖ TRỢ KHÁCH HÀNG</h3>
              <ul>
                <li><Link to="">Điều khoản sử dụng</Link></li>
                <li><Link to="">Chính sách bảo mật</Link></li>
                <li><Link to="">Chính sách thành viên</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3>Web Smart Oder</h3>
              <div className="app-links">
                <a href="" target="_blank" rel="noopener noreferrer">
                  <img src="https://ext.same-assets.com/0/148187491.svg" alt="App Store" />
                </a>
                <a href="" target="_blank" rel="noopener noreferrer">
                  <img src="https://ext.same-assets.com/0/3513627406.svg" alt="Google Play" />
                </a>
              </div>
              <p>Smart Oder - Siêu ứng dụng cho tín đồ ẩm thực.<br />Đặt Món Hôm Nay Chạm Ngay Ưu Đãi.</p>

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

      {showChat && (
        <div
          style={{
            position: 'fixed',
            bottom: 65,
            right: 40,
            zIndex: 1000,
          }}
        >
          <ChatBot />
        </div>
      )}
      <a className="hotline-btn" onClick={() => setShowChat(!showChat)}>
        <div className="hotline-btn-circle">
          <FaMessage />
        </div>
      </a>


    </footer>
  );
};

export default Footer;
