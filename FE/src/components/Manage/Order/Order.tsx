import React, { useState, useEffect, ErrorInfo } from 'react';
import { FaSearch, FaFilter, FaEye } from 'react-icons/fa';
import './Order.scss';
import { orderService, Order as OrderType } from '../../../services/orderService';
import LoadingSpinner from '../../Loading/LoadingSpinner';

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

interface OrderFilter {
  status: OrderStatus | 'all';
  searchQuery: string;
  sortBy: 'newest' | 'oldest';
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error in component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h3>Đã xảy ra lỗi khi hiển thị nội dung</h3>
          <button onClick={() => this.setState({ hasError: false })}>
            Thử lại
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filteredOrders, setFilteredOrders] = useState<OrderType[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  
  const [filter, setFilter] = useState<OrderFilter>({
    status: 'all',
    searchQuery: '',
    sortBy: 'newest'
  });

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orderService.getAllOrders();
        setOrders(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    
    // Refresh orders every 30 seconds
    const intervalId = setInterval(fetchOrders, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Apply filters to orders
  useEffect(() => {
    let result = [...orders];
    
    // Filter by status
    if (filter.status !== 'all') {
      result = result.filter(order => order.status === filter.status);
    }
    
    // Search by table ID or order ID
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      result = result.filter(order => 
        order.id.toString().includes(query) || 
        order.table.name.toLowerCase().includes(query)
      );
    }
    
    // Sort orders
    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return filter.sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
    
    setFilteredOrders(result);
  }, [orders, filter]);

  const handleFilterChange = (field: keyof OrderFilter, value: any) => {
    setFilter(prev => ({ ...prev, [field]: value }));
  };

  const handleViewOrder = async (order: OrderType) => {
    try {
      // Lấy thông tin chi tiết đơn hàng từ API để đảm bảo dữ liệu đầy đủ
      const detailedOrder = await orderService.getOrderById(order.id);
      console.log('Detailed order data:', detailedOrder); 
      console.log('Table info:', detailedOrder?.table); // Thêm log để kiểm tra thông tin bàn
      
      // Đảm bảo dữ liệu items có đầy đủ thông tin
      if (detailedOrder && Array.isArray(detailedOrder.items)) {
        setSelectedOrder(detailedOrder);
        setShowModal(true);
      } else {
        throw new Error('Dữ liệu đơn hàng không hợp lệ');
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      alert('Không thể tải chi tiết đơn hàng. Vui lòng thử lại sau.');
    }
  };

  const updateOrderStatus = async (id: number, status: OrderStatus) => {
    try {
      await orderService.updateOrderStatus(id, status);
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === id ? { ...order, status } : order
        )
      );
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại sau.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusText = (status: OrderStatus) => {
    const statusMap: Record<OrderStatus, string> = {
      'pending': 'Chờ duyệt',
      'preparing': 'Đang chuẩn bị',
      'ready': 'Sẵn sàng phục vụ',
      'delivered': 'Đã phục vụ',
      'cancelled': 'Đã hủy'
    };
    return statusMap[status];
  };

  const getStatusClass = (status: OrderStatus) => {
    const statusClassMap: Record<OrderStatus, string> = {
      'pending': 'pending',
      'preparing': 'preparing',
      'ready': 'ready',
      'delivered': 'delivered',
      'cancelled': 'cancelled'
    };
    return statusClassMap[status];
  };

  return (
    <div className="order-management">
      <div className="filter-bar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm theo mã đơn hoặc bàn..."
            value={filter.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
          />
        </div>

        <div className="filter-options">
          <div className="filter-group">
            <FaFilter />
            <select
              value={filter.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="pending">Chờ duyệt</option>
              <option value="preparing">Đang chuẩn bị</option>
              <option value="ready">Sẵn sàng phục vụ</option>
              <option value="delivered">Đã phục vụ</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          <div className="filter-group">
            <select
              value={filter.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value as 'newest' | 'oldest')}
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
            </select>
          </div>
        </div>
      </div>

      <div className="orders-grid">
        {loading ? (
          <div style={{ gridColumn: '1 / -1', width: '100%' }}>
            <LoadingSpinner 
              loadingText="Đang tải danh sách đơn hàng..." 
              showDots={true} 
              showSkeleton={false}
              className="embedded"
            />
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div key={order.id} className={`order-card ${order.status}`}>
              <div className="order-card-header">
                <h3>Đơn #{order.id}</h3>
                <span className={`status-badge ${getStatusClass(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              
              <div className="order-card-content">
                <div className="order-info">
                  <p><strong>Bàn:</strong> {order.table?.table_number || 'Không xác định'}</p>
                  <p><strong>Thời gian:</strong> {formatDate(order.created_at)}</p>
                  <p><strong>Tổng tiền:</strong> {order.total_price.toLocaleString('vi-VN')}đ</p>
                  <p><strong>Số món:</strong> {order.items.length}</p>
                </div>
              </div>
              
              <div className="order-card-actions">
                <div className="status-actions">
                  <label>Trạng thái:</label>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(
                      order.id,
                      e.target.value as OrderStatus
                    )}
                  >
                    <option value="pending">Chờ duyệt</option>
                    <option value="preparing">Đang chuẩn bị</option>
                    <option value="ready">Sẵn sàng phục vụ</option>
                    <option value="delivered">Đã phục vụ</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
                
                <div className="card-buttons">
                  <button className="view-btn" onClick={() => handleViewOrder(order)}>
                    <FaEye /> Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-orders-message">
            <p>Không có đơn hàng nào phù hợp với bộ lọc</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Chi tiết đơn hàng</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <ErrorBoundary>
              <div className="modal-body">
                <div className="order-info">
                  <div className="info-row">
                    <div className="info-group">
                      <span className="label">Mã đơn:</span>
                      <span className="value">#{selectedOrder.id}</span>
                    </div>
                    <div className="info-group">
                      <span className="label">Bàn:</span>
                      <span className="value">{selectedOrder.table?.table_number || 'Không xác định'}</span>
                    </div>
                  </div>
                  <div className="info-row">
                    <div className="info-group">
                      <span className="label">Thời gian:</span>
                      <span className="value">{formatDate(selectedOrder.created_at)}</span>
                    </div>
                    <div className="info-group">
                      <span className="label">Trạng thái:</span>
                      <span className={`status-badge ${getStatusClass(selectedOrder.status)}`}>
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="order-items">
                  <h3>Danh sách món</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Món</th>
                        <th>Số lượng</th>
                        <th>Đơn giá</th>
                        <th>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items && selectedOrder.items.map((item) => {
                        // Kiểm tra item và các thuộc tính của nó
                        const menuName = item?.menu?.name || 'Không có tên';
                        const quantity = item?.quantity || 0;
                        const price = item?.price || (item?.menu?.price || 0);
                        const totalPrice = price * quantity;
                        
                        return (
                          <tr key={item?.id || Math.random()}>
                            <td>{menuName}</td>
                            <td>{quantity}</td>
                            <td>{price.toLocaleString('vi-VN')}đ</td>
                            <td>{totalPrice.toLocaleString('vi-VN')}đ</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={3}><strong>Tổng cộng</strong></td>
                        <td><strong>{selectedOrder.total_price.toLocaleString('vi-VN')}đ</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </ErrorBoundary>
            <div className="modal-footer">
              <button className="close-btn" onClick={() => setShowModal(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
