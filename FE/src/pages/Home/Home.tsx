import { Link } from 'react-router-dom';
import Pricing from '../../components/Pricing/Pricing';
import './Home.scss';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-slider">
          <div className="hero-slide">
            <img src="./src/assets/banner.png" alt="Smart Order Banner" />
          </div>
        </div>
      </section>

      <section className="intro-section">
        <div className="container">
          <div className="intro-content">
            <div className="intro-text">
              <h2 className="section-title">Quán Thịt Nướng Hàn Quốc</h2>
              <p>
                Smart Order – Quán thịt nướng Hàn Quốc Ngon Số 1 sẽ đưa bạn
                ghé đến những quán thịt nướng tại thành phố Seoul đã tạo nên
                danh tiếng cho nền ẩm thực xứ kim chi. Nếu đã một lần thưởng
                thức thịt nướng tại Smart Order, bạn sẽ không thể quên được
                hương vị "ngất ngây" của những món sườn non bò Mỹ, nạc vai bò
                Mỹ, dẻ sườn tươi... khi hòa quyện vào với các loại gia vị đặc trưng
                xứ Hàn đã trở nên hấp dẫn đến thế nào. Ngoài ra, những món ăn
                kèm không thể bỏ qua như cơm trộn, mỳ lạnh, canh Kimchi và các
                loại lẩu cũng sẽ làm bạn ấn tượng thêm về nền ẩm thực Hàn Quốc.
              </p>
              <Link to="/thuc-don" className="view-menu-btn">
                Xem thực đơn
              </Link>
            </div>
            <div className="intro-images">
              <img src="https://ext.same-assets.com/868040770/2748555031.jpeg" alt="Smart Order Food" />
              <img src="https://ext.same-assets.com/868040770/2089106856.jpeg" alt="Smart Order Food" />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <Pricing />

      {/* QR Ordering Section */}
      <section className="qr-ordering-section">
        <div className="container">
          <h2 className="section-title">Đặt món dễ dàng bằng QR Code</h2>
          <div className="qr-ordering-content">
            <div className="qr-ordering-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Quét mã QR tại bàn</h3>
                  <p>Sử dụng camera điện thoại để quét mã QR được đặt trên bàn của bạn</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Chọn món từ thực đơn</h3>
                  <p>Duyệt qua các danh mục và chọn món ăn bạn muốn thêm vào giỏ hàng</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Xem giỏ hàng và đặt món</h3>
                  <p>Kiểm tra giỏ hàng, thêm ghi chú nếu cần và hoàn tất đặt món</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Thưởng thức bữa ăn</h3>
                  <p>Nhân viên sẽ chuẩn bị và mang món ăn đến bàn của bạn trong thời gian ngắn nhất</p>
                </div>
              </div>
            </div>
            <div className="qr-ordering-image">
              <img src="./src/assets/img_qr.jpg" alt="QR Ordering" />
              <div className="qr-ordering-cta">
                <p>Trải nghiệm đặt món trực tiếp tại nhà hàng hoặc</p>
                <Link to="/dat-ban" className="book-table-btn">Đặt bàn ngay</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="brand-section">
        <div className="container">
          <div className="brand-list">
            <div className="brand-category">
              <h3>HOTPOT</h3>
              <div className="brand-logos">
                <a href="" target="_blank" rel="noopener noreferrer">
                  <img src="./src/assets/img_logo/ashima.svg" alt="ashima" />
                </a>
                <a href="" target="_blank" rel="noopener noreferrer">
                  <img src="./src/assets/img_logo/kichi.svg" alt="kichi" />
                </a>
                <a href="" target="_blank" rel="noopener noreferrer">
                  <img src="./src/assets/img_logo/wah.svg" alt="manwah" />
                </a>
                <a href="" target="_blank" rel="noopener noreferrer">
                  <img src="./src/assets/img_logo/hutong.svg" alt="hutong" />
                </a>
                <a href="" target="_blank" rel="noopener noreferrer">
                  <img src="./src/assets/img_logo/ktop.svg" alt="ktop" />
                </a>
              </div>
            </div>

            <div className="brand-category">
              <h3>BBQ</h3>
              <div className="brand-logos">
                <a href="" target="_blank" rel="noopener noreferrer">
                  <img src="./src/assets/img_logo/sumo.svg" alt="sumo" />
                </a>
                <a href="" target="_blank" rel="noopener noreferrer">
                  <img src="./src/assets/img_logo/gogi.svg" alt="gogi house" />
                </a>
                <a href="" target="_blank" rel="noopener noreferrer">
                  <img src="./src/assets/img_logo/steak.svg" alt="gogi steak" />
                </a>
                <a href="" target="_blank" rel="noopener noreferrer">
                  <img src="./src/assets/img_logo/kpub.jpeg" alt="kpub" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
