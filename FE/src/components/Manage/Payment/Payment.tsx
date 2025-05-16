import { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaUniversity, FaPrint, FaCheck, FaTimes, FaHistory } from 'react-icons/fa';

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  tableNumber: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid';
  paymentMethod?: 'cash' | 'bank';
  amountReceived?: number;
  amountReturned?: number;
  createdAt: Date;
}

export const createPayment = async (amount: number) => {
  const res = await fetch('http://localhost:8000/api/staff/vnpay_payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });
  const data = await res.json();
  return data.url;
};

const PaymentManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank'>('cash');
  const [amountReceived, setAmountReceived] = useState<number>(0);
  const [amountReturned, setAmountReturned] = useState<number>(0);
  const [paymentCompleted, setPaymentCompleted] = useState<boolean>(false);
  const [showQRCode, setShowQRCode] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [viewMode, setViewMode] = useState<'pending' | 'history'>('pending');
  const [historySearchTerm, setHistorySearchTerm] = useState<string>('');

  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: 1,
        tableNumber: 'B01',
        items: [
          { id: 1, name: 'Phở bò', quantity: 2, price: 65000 },
          { id: 2, name: 'Nước chanh', quantity: 2, price: 25000 }
        ],
        total: 180000,
        status: 'pending',
        paymentStatus: 'unpaid',
        createdAt: new Date(2025, 3, 20, 12, 30)
      },
      {
        id: 2,
        tableNumber: 'B05',
        items: [
          { id: 3, name: 'Cơm tấm sườn', quantity: 1, price: 55000 },
          { id: 4, name: 'Canh chua', quantity: 1, price: 35000 },
          { id: 5, name: 'Coca Cola', quantity: 1, price: 20000 }
        ],
        total: 110000,
        status: 'pending',
        paymentStatus: 'unpaid',
        createdAt: new Date(2025, 3, 20, 12, 45)
      },
      {
        id: 3,
        tableNumber: 'B08',
        items: [
          { id: 6, name: 'Bún chả', quantity: 3, price: 60000 },
          { id: 7, name: 'Trà đá', quantity: 3, price: 5000 }
        ],
        total: 195000,
        status: 'pending',
        paymentStatus: 'unpaid',
        createdAt: new Date(2025, 3, 20, 13, 15)
      },
      {
        id: 4,
        tableNumber: 'A03',
        items: [
          { id: 8, name: 'Gỏi cuốn', quantity: 2, price: 45000 },
          { id: 9, name: 'Bia Sài Gòn', quantity: 2, price: 30000 }
        ],
        total: 150000,
        status: 'completed',
        paymentStatus: 'paid',
        paymentMethod: 'cash',
        amountReceived: 200000,
        amountReturned: 50000,
        createdAt: new Date(2025, 3, 19, 18, 30)
      },
      {
        id: 5,
        tableNumber: 'A07',
        items: [
          { id: 10, name: 'Lẩu thái', quantity: 1, price: 250000 },
          { id: 11, name: 'Nước suối', quantity: 4, price: 15000 }
        ],
        total: 310000,
        status: 'completed',
        paymentStatus: 'paid',
        paymentMethod: 'bank',
        createdAt: new Date(2025, 3, 19, 19, 15)
      }
    ];

    setOrders(mockOrders);
  }, []);

  const resetPaymentState = () => {
    setSelectedOrder(null);
    setPaymentMethod('cash');
    setAmountReceived(0);
    setAmountReturned(0);
    setPaymentCompleted(false);
    setShowQRCode(false);
    setError('');
  };

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
    setAmountReceived(0);
    setAmountReturned(0);
    setPaymentCompleted(false);
    setShowQRCode(false);
    setError('');
  };

  const handleAmountReceivedChange = (amount: number) => {
    setAmountReceived(amount);
    if (selectedOrder) {
      setAmountReturned(amount - selectedOrder.total);
    }
  };

  const handleCashPayment = () => {
    if (!selectedOrder) return;

    if (amountReceived < selectedOrder.total) {
      setError('Số tiền khách đưa không đủ!');
      return;
    }

    setError('');

    const updatedOrders = orders.map(order => {
      if (order.id === selectedOrder.id) {
        return {
          ...order,
          paymentStatus: 'paid' as const,
          paymentMethod: 'cash' as const,
          amountReceived,
          amountReturned: amountReceived - order.total,
          status: 'completed' as const
        };
      }
      return order;
    });

    setOrders(updatedOrders);
    setPaymentCompleted(true);

  };


  const handleBankPayment = () => {
    if (!selectedOrder) return;

    setShowQRCode(true);
  };

  const confirmBankPayment = () => {
    if (!selectedOrder) return;

    const updatedOrders = orders.map(order => {
      if (order.id === selectedOrder.id) {
        return {
          ...order,
          paymentStatus: 'paid' as const,
          paymentMethod: 'bank' as const,
          status: 'completed' as const
        };
      }
      return order;
    });

    setOrders(updatedOrders);
    setPaymentCompleted(true);
    setShowQRCode(false);

  };

  const handlePrintReceipt = () => {
    alert('Đang in hóa đơn...');
    resetPaymentState();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredOrders = orders.filter(order =>
    viewMode === 'pending'
      ? (order.paymentStatus === 'unpaid' &&
        (order.tableNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toString().includes(searchTerm)))
      : (order.paymentStatus === 'paid' &&
        (order.tableNumber.toLowerCase().includes(historySearchTerm.toLowerCase()) ||
          order.id.toString().includes(historySearchTerm)))
  );

  return (
    <div className="payment-management">
      <div className="payment-management-header">
        <h2>Quản lý thanh toán</h2>
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'pending' ? 'active' : ''}`}
            onClick={() => setViewMode('pending')}
          >
            Chờ thanh toán
          </button>
          <button
            className={`toggle-btn ${viewMode === 'history' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('history');
              resetPaymentState();
            }}
          >
            <FaHistory /> Lịch sử thanh toán
          </button>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder={viewMode === 'pending' ? "Tìm kiếm đơn chờ thanh toán..." : "Tìm kiếm lịch sử thanh toán..."}
            value={viewMode === 'pending' ? searchTerm : historySearchTerm}
            onChange={(e) => viewMode === 'pending'
              ? setSearchTerm(e.target.value)
              : setHistorySearchTerm(e.target.value)
            }
          />
        </div>
      </div>

      <div className="payment-management-content">
        <div className="orders-list">
          <h3>{viewMode === 'pending' ? 'Đơn hàng chờ thanh toán' : 'Lịch sử thanh toán'}</h3>
          {filteredOrders.length === 0 ? (
            <div className="no-orders">
              {viewMode === 'pending'
                ? 'Không có đơn hàng nào chờ thanh toán'
                : 'Không có lịch sử thanh toán nào'
              }
            </div>
          ) : (
            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Bàn số</th>
                    <th>Tổng tiền</th>
                    <th>Thời gian</th>
                    {viewMode === 'history' && <th>Phương thức</th>}
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id} className={selectedOrder?.id === order.id ? 'selected' : ''}>
                      <td>#{order.id}</td>
                      <td>{order.tableNumber}</td>
                      <td>{formatCurrency(order.total)}</td>
                      <td>{formatDateTime(order.createdAt)}</td>
                      {viewMode === 'history' && (
                        <td>{order.paymentMethod === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}</td>
                      )}
                      <td>
                        <button
                          className="view-btn"
                          onClick={() => handleOrderSelect(order)}
                        >
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="payment-details">
          {selectedOrder ? (
            <>
              {paymentCompleted || (viewMode === 'history' && selectedOrder.paymentStatus === 'paid') ? (
                <div className="payment-success">
                  <div className="success-icon">
                    <FaCheck size={40} />
                  </div>
                  <h3>{viewMode === 'history' ? 'Chi tiết thanh toán' : 'Thanh toán thành công!'}</h3>
                  <p>Đơn hàng #{selectedOrder.id} - Bàn {selectedOrder.tableNumber}</p>
                  <p>Phương thức: {selectedOrder.paymentMethod === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}</p>
                  {selectedOrder.paymentMethod === 'cash' && (
                    <>
                      <p>Số tiền nhận: {formatCurrency(selectedOrder.amountReceived || amountReceived)}</p>
                      <p>Tiền thừa: {formatCurrency(selectedOrder.amountReturned || amountReturned)}</p>
                    </>
                  )}
                  <p>Thời gian: {formatDateTime(selectedOrder.createdAt)}</p>

                  <div className="order-items">
                    <h4>Danh sách món</h4>
                    <table>
                      <thead>
                        <tr>
                          <th>Món</th>
                          <th>SL</th>
                          <th>Đơn giá</th>
                          <th>Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map(item => (
                          <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>{formatCurrency(item.price)}</td>
                            <td>{formatCurrency(item.price * item.quantity)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={3}><strong>Tổng cộng:</strong></td>
                          <td><strong>{formatCurrency(selectedOrder.total)}</strong></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {viewMode !== 'history' && (
                    <button className="print-btn" onClick={handlePrintReceipt}>
                      <FaPrint /> In hóa đơn
                    </button>
                  )}
                  <button className="back-btn" onClick={resetPaymentState}>
                    Quay lại danh sách
                  </button>
                </div>
              ) : showQRCode ? (
                <div className="bank-payment">
                  <h3>Thanh toán chuyển khoản</h3>
                  <p>Đơn hàng #{selectedOrder.id} - Bàn {selectedOrder.tableNumber}</p>
                  <p>Tổng tiền: {formatCurrency(selectedOrder.total)}</p>

                  <div className="qr-code">
                    <div className="qr-placeholder">
                      {/* In a real app, this would be an actual QR code */}
                      <div style={{ width: '200px', height: '200px', background: '#f0f0f0', margin: '20px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        QR Code
                      </div>
                    </div>
                    <p>Quét mã QR để chuyển khoản</p>
                    <p className="bank-info">
                      <strong>Thông tin chuyển khoản:</strong><br />
                      Ngân hàng: VIETCOMBANK<br />
                      Số tài khoản: 1234567890<br />
                      Chủ tài khoản: SMART ORDER JSC<br />
                      Nội dung: Thanh toan #{selectedOrder.id}
                    </p>
                  </div>

                  <div className="action-buttons">
                    <button className="confirm-btn" onClick={confirmBankPayment}>
                      <FaCheck /> Xác nhận đã nhận thanh toán
                    </button>
                    <button className="cancel-btn" onClick={() => setShowQRCode(false)}>
                      <FaTimes /> Quay lại
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3>Chi tiết đơn hàng</h3>
                  <div className="order-info">
                    <p><strong>Mã đơn hàng:</strong> #{selectedOrder.id}</p>
                    <p><strong>Bàn số:</strong> {selectedOrder.tableNumber}</p>
                    <p><strong>Thời gian:</strong> {formatDateTime(selectedOrder.createdAt)}</p>
                  </div>

                  <div className="order-items">
                    <h4>Danh sách món</h4>
                    <table>
                      <thead>
                        <tr>
                          <th>Món</th>
                          <th>SL</th>
                          <th>Đơn giá</th>
                          <th>Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map(item => (
                          <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>{formatCurrency(item.price)}</td>
                            <td>{formatCurrency(item.price * item.quantity)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={3}><strong>Tổng cộng:</strong></td>
                          <td><strong>{formatCurrency(selectedOrder.total)}</strong></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="payment-methods">
                    <h4>Chọn phương thức thanh toán</h4>
                    <div className="method-selector">
                      <button
                        className={`method-btn ${paymentMethod === 'cash' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('cash')}
                      >
                        <FaMoneyBillWave /> Tiền mặt
                      </button>
                      <button
                        className={`method-btn ${paymentMethod === 'bank' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('bank')}
                      >
                        <FaUniversity /> Chuyển khoản
                      </button>
                    </div>

                    {paymentMethod === 'cash' && (
                      <div className="cash-payment">
                        <div className="form-group">
                          <label>Số tiền khách đưa:</label>
                          <input
                            type="number"
                            value={amountReceived || ''}
                            onChange={(e) => handleAmountReceivedChange(Number(e.target.value))}
                            min={0}
                          />
                        </div>
                        <div className="form-group">
                          <label>Tiền thừa:</label>
                          <input
                            type="text"
                            value={formatCurrency(amountReturned)}
                            readOnly
                            className={amountReturned < 0 ? 'error' : ''}
                          />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <button
                          className="confirm-btn"
                          onClick={handleCashPayment}
                          disabled={amountReceived < selectedOrder.total}
                        >
                          <FaCheck /> Xác nhận thanh toán
                        </button>
                      </div>
                    )}

                    {paymentMethod === 'bank' && (
                      <div className="bank-payment-button">
                        <button className="confirm-btn" onClick={handleBankPayment}>
                          <FaCheck /> Tạo mã QR thanh toán
                        </button>
                      </div>
                    )}
                  </div>

                  <button className="cancel-btn" onClick={resetPaymentState}>
                    <FaTimes /> Hủy
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="no-order-selected">
              <p>Vui lòng chọn đơn hàng để {viewMode === 'pending' ? 'thanh toán' : 'xem chi tiết'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;
