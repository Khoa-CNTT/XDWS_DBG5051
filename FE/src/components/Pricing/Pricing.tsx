import './Pricing.scss';

const Pricing = () => {
  return (
    <div className="pricing-section">
      <div className="container">
        <h2 className="section-title">Bảng giá</h2>
        <div className="pricing-grid">
          <div className="pricing-item">
            <h3>GỌI MÓN</h3>
            <div className="price-amount">
              <span className="price">69</span>
              <div className="price-details">
                <span className="price-suffix">000</span>
                <span className="price-unit">VNĐ/món</span>
              </div>
            </div>
          </div>

          <div className="pricing-item">
            <h3>COMBO</h3>
            <div className="price-amount">
              <span className="price">200</span>
              <div className="price-details">
                <span className="price-suffix">000</span>
                <span className="price-unit">VNĐ/người</span>
              </div>
            </div>
          </div>

          <div className="pricing-item">
            <h3>XÈO XÈO THỎA THÍCH</h3>
            <div className="price-amount">
              <span className="price">419</span>
              <div className="price-details">
                <span className="price-suffix">000</span>
                <span className="price-unit">VNĐ/người</span>
              </div>
            </div>
          </div>

          <div className="pricing-item">
            <h3>TRẺ EM</h3>
            <div className="price-amount">
              <span className="price">FREE</span>
              <div className="price-details">
                <span className="discount-info">&lt; 1 m</span>
                <span className="discount-info">-70%</span>
                <span className="discount-info">&lt; 1,3 m</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
