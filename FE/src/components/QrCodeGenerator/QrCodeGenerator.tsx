import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './QrCodeGenerator.scss';

const QrCodeGenerator = () => {
  const [numTables, setNumTables] = useState(1);
  const [baseUrl, setBaseUrl] = useState(window.location.origin);
  const [qrCodes, setQrCodes] = useState<Array<{ tableId: number; url: string }>>([]);

  const generateQrCodes = () => {
    const codes = [];
    for (let i = 1; i <= numTables; i++) {
      codes.push({
        tableId: i,
        url: `${baseUrl}/order/${i}`
      });
    }
    setQrCodes(codes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateQrCodes();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="qr-generator">
      <div className="qr-generator-form">
        <h2>Tạo mã QR cho các bàn</h2>
        <p>Tạo mã QR để khách hàng quét và đặt món trực tiếp từ bàn của họ.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="numTables">Số lượng bàn</label>
            <input
              type="number"
              id="numTables"
              min="1"
              max="100"
              value={numTables}
              onChange={(e) => setNumTables(parseInt(e.target.value))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="baseUrl">URL cơ sở</label>
            <input
              type="text"
              id="baseUrl"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              required
            />
            <small>URL này sẽ được tự động kết hợp với ID bàn, ví dụ: {baseUrl}/order/1</small>
          </div>

          <button type="submit" className="generate-btn">
            Tạo mã QR
          </button>
        </form>
      </div>

      {qrCodes.length > 0 && (
        <div className="qr-codes-container">
          <div className="qr-codes-header">
            <h3>Mã QR cho {qrCodes.length} bàn</h3>
            <button onClick={handlePrint} className="print-btn">
              In mã QR
            </button>
          </div>

          <div className="qr-codes-grid">
            {qrCodes.map(code => (
              <div key={code.tableId} className="qr-code-item">
                <div className="qr-code">
                  <QRCodeSVG
                    value={code.url}
                    size={150}
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                    level="L"
                    includeMargin={false}
                  />
                </div>
                <div className="qr-code-details">
                  <h4>Bàn số: {code.tableId}</h4>
                  <p>Quét mã QR để đặt món</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QrCodeGenerator;
