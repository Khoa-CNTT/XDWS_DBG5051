import { Link } from 'react-router-dom';
import Pricing from '../../components/Pricing/Pricing';
import './Home.scss';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-slider">
          <div className="hero-slide">
            <img src="https://ext.same-assets.com/868040770/2558047103.png" alt="Smart Order Banner" />
          </div>
        </div>
      </section>

      <section className="intro-section">
        <div className="container">
          <h2 className="section-title">Quán Thịt Nướng Hàn Quốc</h2>
          <div className="intro-content">
            <div className="intro-text">
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
              <img src="https://ext.same-assets.com/166846685/3726704444.jpeg" alt="QR Ordering" />
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
                <a href="https://ashima.com.vn/" target="_blank" rel="noopener noreferrer">
                  <img src="https://ext.same-assets.com/166846685/3336826416.svg" alt="ashima" />
                </a>
                <a href="https://kichi.com.vn/" target="_blank" rel="noopener noreferrer">
                  <img src="https://ext.same-assets.com/166846685/1180972125.svg" alt="kichi" />
                </a>
                <a href="https://manwah.com.vn/" target="_blank" rel="noopener noreferrer">
                  <img src="https://ext.same-assets.com/166846685/65013682.svg" alt="manwah" />
                </a>
                <a href="https://hutong.com.vn/" target="_blank" rel="noopener noreferrer">
                  <img src="https://ext.same-assets.com/166846685/1704423291.svg" alt="hutong" />
                </a>
                <a href="https://ktop.com.vn/" target="_blank" rel="noopener noreferrer">
                  <img src="https://ext.same-assets.com/166846685/1055700021.svg" alt="ktop" />
                </a>
              </div>
            </div>

            <div className="brand-category">
              <h3>BBQ</h3>
              <div className="brand-logos">
                <a href="https://sumoyakiniku.com.vn/" target="_blank" rel="noopener noreferrer">
                  <img src="https://ext.same-assets.com/166846685/2046409577.svg" alt="sumo" />
                </a>
                <a href="https://gogi.com.vn/" target="_blank" rel="noopener noreferrer">
                  <img src="https://ext.same-assets.com/166846685/1285050380.svg" alt="gogi house" />
                </a>
                <a href="https://gogisteak.com.vn/" target="_blank" rel="noopener noreferrer">
                  <img src="https://ext.same-assets.com/166846685/2136061176.svg" alt="gogi steak" />
                </a>
                <a href="https://kpub.com.vn/" target="_blank" rel="noopener noreferrer">
                  <img src="https://ext.same-assets.com/166846685/210945348.jpeg" alt="kpub" />
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
