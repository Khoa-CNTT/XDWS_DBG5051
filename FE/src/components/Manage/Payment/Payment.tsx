import { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaUniversity, FaPrint, FaCheck, FaTimes, FaHistory } from 'react-icons/fa';
import { paymentService } from '../../../services/paymentService';
import { orderService, Order } from '../../../services/orderService';
import LoadingSpinner from '../../Loading/LoadingSpinner';

interface OrderWithPayment extends Order {
  payment_status?: 'unpaid' | 'paid';
  payment_method?: 'cash' | 'VNPay';
  amount_received?: number;
  amount_returned?: number;
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
  const [orders, setOrders] = useState<OrderWithPayment[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithPayment | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'VNPay'>('cash');
  const [amountReceived, setAmountReceived] = useState<number>(0);
  const [amountReturned, setAmountReturned] = useState<number>(0);
  const [paymentCompleted, setPaymentCompleted] = useState<boolean>(false);
  const [showQRCode, setShowQRCode] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [viewMode, setViewMode] = useState<'pending' | 'history'>('pending');
  const [historySearchTerm, setHistorySearchTerm] = useState<string>('');
  const [vnpayUrl, setVnpayUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        // Gọi API để lấy danh sách đơn hàng
        const response = await orderService.getAllOrders();
        
        // Chuyển đổi từ Order sang OrderWithPayment
        const ordersWithPayment: OrderWithPayment[] = response.map(order => ({
          ...order,
          payment_status: order.status === 'delivered' ? 'paid' : 'unpaid',
          payment_method: order.status === 'delivered' ? 'cash' : undefined
        }));
        
        setOrders(ordersWithPayment);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách đơn hàng:', error);
        setOrders([]); // Đặt mảng rỗng để tránh lỗi type
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
    
    // // Cập nhật danh sách đơn hàng mỗi 30 giây
    // const intervalId = setInterval(fetchOrders, 30000);
    
    // return () => clearInterval(intervalId);
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

  const handleOrderSelect = (order: OrderWithPayment) => {
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
      setAmountReturned(amount - selectedOrder.total_price);
    }
  };

  const handleCashPayment = async () => {
    if (!selectedOrder) return;
    
    if (amountReceived < selectedOrder.total_price) {
      setError('Số tiền khách đưa không đủ!');
      return;
    }

    setError('');
    setIsLoading(true);
    
    try {
      // Gọi API thanh toán
      await paymentService.processInternalPayment({
        order_id: selectedOrder.id,
        amount: selectedOrder.total_price,
        method: 'cash'
      });
      
      // Cập nhật state
      setOrders(prevOrders => 
        prevOrders.map(order => {
          if (order.id === selectedOrder.id) {
            return {
              ...order,
              payment_status: 'paid' as const,
              payment_method: 'cash' as const,
              amount_received: amountReceived,
              amount_returned: amountReceived - order.total_price,
              status: 'delivered'
            };
          }
          return order;
        })
      );
      
      setPaymentCompleted(true);
    } catch (error) {
      console.error('Lỗi thanh toán:', error);
      setError('Thanh toán thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVNPayPayment = async () => {
    if (!selectedOrder) return;
    
    setIsLoading(true);
    
    try {
      // Gọi API VNPay
      const response = await paymentService.processVnPayPayment({
        order_id: selectedOrder.id,
        amount: selectedOrder.total_price
      });
      
      setVnpayUrl(response.payment_url);
      setShowQRCode(true);
    } catch (error) {
      console.error('Lỗi VNPay:', error);
      setError('Không thể tạo thanh toán VNPay. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmVNPayPayment = async () => {
    if (!selectedOrder) return;
    
    setIsLoading(true);
    
    try {
      // Trong ứng dụng thực tế, việc này sẽ được xử lý bởi URL callback
      // Ở đây chúng ta chỉ cập nhật trạng thái UI
      setOrders(prevOrders => 
        prevOrders.map(order => {
          if (order.id === selectedOrder.id) {
            return {
              ...order,
              payment_status: 'paid' as const,
              payment_method: 'VNPay' as const,
              status: 'delivered'
            };
          }
          return order;
        })
      );
      
      setPaymentCompleted(true);
      setShowQRCode(false);
    } catch (error) {
      console.error('Lỗi xác nhận thanh toán:', error);
      setError('Xác nhận thanh toán thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintReceipt = () => {
    alert('Đang in hóa đơn...');
    resetPaymentState();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
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
      ? (order.payment_status === 'unpaid' && 
         ((order.table?.table_number?.toLowerCase().includes(searchTerm.toLowerCase())) || 
          order.id.toString().includes(searchTerm)))
      : (order.payment_status === 'paid' && 
         ((order.table?.table_number?.toLowerCase().includes(historySearchTerm.toLowerCase())) || 
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
          {isLoading ? (
            <LoadingSpinner 
              loadingText="Đang tải danh sách thanh toán..." 
              showDots={true} 
              showSkeleton={false}
              className="embedded"
            />
          ) : filteredOrders.length === 0 ? (
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
                      <td>{order.table?.table_number || 'N/A'}</td>
                      <td>{formatCurrency(order.total_price)}</td>
                      <td>{formatDateTime(order.created_at)}</td>
                      {viewMode === 'history' && (
                        <td>
                          {order.payment_method === 'cash' ? 'Tiền mặt' : 'VNPay'}
                        </td>
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
              {paymentCompleted || (viewMode === 'history' && selectedOrder.payment_status === 'paid') ? (
                <div className="payment-success">
                  <div className="success-icon">
                    <FaCheck size={40} />
                  </div>
                  <h3>{viewMode === 'history' ? 'Chi tiết thanh toán' : 'Thanh toán thành công!'}</h3>
                  <p>Đơn hàng #{selectedOrder.id} - Bàn {selectedOrder.table?.table_number || 'N/A'}</p>
                  
                  {/* Sử dụng payment_method từ selectedOrder nếu có, nếu không thì dùng paymentMethod từ state */}
                  <p>Phương thức: {selectedOrder.payment_method === 'VNPay' ? 'VNPay' : 
                                   (paymentMethod === 'VNPay' && paymentCompleted) ? 'VNPay' : 'Tiền mặt'}</p>
                  
                  {(selectedOrder.payment_method === 'cash' || 
                    (paymentMethod === 'cash' && paymentCompleted)) && (
                    <>
                      <p>Số tiền nhận: {formatCurrency(selectedOrder.amount_received || amountReceived)}</p>
                      <p>Tiền thừa: {formatCurrency(selectedOrder.amount_returned || amountReturned)}</p>
                    </>
                  )}
                  <p>Thời gian: {formatDateTime(selectedOrder.created_at)}</p>
                  
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
                        {selectedOrder.items.map(item => {
                          // Kiểm tra item và các thuộc tính của nó
                          const menuName = item?.menu?.name || 'Không có tên';
                          const quantity = item?.quantity || 0;
                          const price = item?.price || (item?.menu?.price || 0);
                          const totalPrice = price * quantity;
                          
                          return (
                            <tr key={item?.id || Math.random()}>
                              <td>{menuName}</td>
                              <td>{quantity}</td>
                              <td>{formatCurrency(price)}</td>
                              <td>{formatCurrency(totalPrice)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={3}><strong>Tổng cộng:</strong></td>
                          <td><strong>{formatCurrency(selectedOrder.total_price)}</strong></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {viewMode !== 'history' && (
                    <button className="print-btn" onClick={handlePrintReceipt}>
                      <FaPrint /> In hóa đơn
                    </button>
                  )}
                </div>
              ) : showQRCode ? (
                <div className="vnpay-qr-payment">
                  <h3>Thanh toán VNPay</h3>
                  <p>Quét mã QR để thanh toán:</p>
                  
                  <div className="qr-code">
                    {/* Hiển thị QR code từ vnpayUrl */}
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(vnpayUrl)}`} alt="QR Code" />
                  </div>
                  
                  <p>Hoặc <a href={vnpayUrl} target="_blank" rel="noopener noreferrer">nhấn vào đây</a> để thanh toán</p>
                  
                  <div className="payment-actions">
                    <button className="confirm-btn" onClick={confirmVNPayPayment}>
                      <FaCheck /> Xác nhận đã thanh toán
                    </button>
                    <button className="cancel-btn" onClick={() => setShowQRCode(false)}>
                      <FaTimes /> Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <div className="payment-form">
                  <h3>Thanh toán đơn hàng #{selectedOrder.id}</h3>
                  <p>Bàn: {selectedOrder.table?.table_number || 'N/A'}</p>
                  <p>Tổng tiền: <strong>{formatCurrency(selectedOrder.total_price)}</strong></p>
                  
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
                        {selectedOrder.items.map(item => {
                          // Kiểm tra item và các thuộc tính của nó
                          const menuName = item?.menu?.name || 'Không có tên';
                          const quantity = item?.quantity || 0;
                          const price = item?.price || (item?.menu?.price || 0);
                          const totalPrice = price * quantity;
                          
                          return (
                            <tr key={item?.id || Math.random()}>
                              <td>{menuName}</td>
                              <td>{quantity}</td>
                              <td>{formatCurrency(price)}</td>
                              <td>{formatCurrency(totalPrice)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={3}><strong>Tổng cộng:</strong></td>
                          <td><strong>{formatCurrency(selectedOrder.total_price)}</strong></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="payment-methods">
                    <h4>Phương thức thanh toán</h4>
                    <div className="method-selector">
                      <button
                        className={`method-btn ${paymentMethod === 'cash' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('cash')}
                      >
                        <FaMoneyBillWave /> Tiền mặt
                      </button>
                      <button
                        className={`method-btn ${paymentMethod === 'VNPay' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('VNPay')}
                      >
                        <FaUniversity /> VNPay
                      </button>
                    </div>
                    
                    {paymentMethod === 'cash' && (
                      <div className="cash-payment">
                        <div className="form-group">
                          <label>Số tiền nhận:</label>
                          <input 
                            type="number" 
                            value={amountReceived || ''} 
                            onChange={(e) => handleAmountReceivedChange(Number(e.target.value))}
                            min={selectedOrder.total_price}
                          />
                        </div>
                        <div className="form-group">
                          <label>Tiền thừa:</label>
                          <input 
                            type="text" 
                            value={formatCurrency(amountReturned)} 
                            readOnly 
                          />
                        </div>
                        
                        {error && <div className="error-message">{error}</div>}
                        
                        <button 
                          className="pay-btn"
                          onClick={handleCashPayment}
                          disabled={amountReceived < selectedOrder.total_price}
                        >
                          Thanh toán
                        </button>
                      </div>
                    )}
                    
                    {paymentMethod === 'VNPay' && (
                      <div className="vnpay-payment">
                        <p>Bạn sẽ được chuyển đến cổng thanh toán VNPay.</p>
                        
                        {error && <div className="error-message">{error}</div>}
                        
                        <button 
                          className="pay-btn"
                          onClick={handleVNPayPayment}
                        >
                          Thanh toán qua VNPay
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="no-order-selected">
              <p>Vui lòng chọn một đơn hàng để thanh toán</p>
            </div>
          )}
        </div>
      </div>
      
      {isLoading && selectedOrder && (
        <div className="loading-overlay">
          <LoadingSpinner 
            loadingText="Đang xử lý thanh toán..." 
            showDots={true} 
            showSkeleton={false}
          />
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;
