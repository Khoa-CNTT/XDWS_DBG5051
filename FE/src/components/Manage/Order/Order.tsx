import { useState, useEffect } from 'react';
import { useOrders, Order, OrderStatus } from '../../../context/OrderContext';
import { FaSearch, FaFilter, FaEye } from 'react-icons/fa';
import './Order.scss';

interface OrderFilter {
  status: OrderStatus | 'all';
  searchQuery: string;
  sortBy: 'newest' | 'oldest';
}

const OrderManagement = () => {
  const { 
    orders, 
    updateOrderStatus 
  } = useOrders();
  
  
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  
  const [filter, setFilter] = useState<OrderFilter>({
    status: 'all',
    searchQuery: '',
    sortBy: 'newest'
  });

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
        order.id.toLowerCase().includes(query) || 
        order.tableId.toLowerCase().includes(query)
      );
    }
    
    // Sort orders
    result.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return filter.sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
    
    setFilteredOrders(result);
  }, [orders, filter]);

  const handleFilterChange = (field: keyof OrderFilter, value: any) => {
    setFilter(prev => ({ ...prev, [field]: value }));
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
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
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div key={order.id} className={`order-card ${order.status}`}>
              <div className="order-card-header">
                <h3>Đơn {order.id.replace('order_', '#')}</h3>
                <span className={`status-badge ${getStatusClass(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              
              <div className="order-card-content">
                <div className="order-info">
                  <p><strong>Bàn:</strong> {order.tableId}</p>
                  <p><strong>Thời gian:</strong> {formatDate(order.timestamp)}</p>
                  <p><strong>Tổng tiền:</strong> {order.total.toLocaleString('vi-VN')}đ</p>
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
            <div className="modal-body">
              <div className="order-info">
                <div className="info-row">
                  <div className="info-group">
                    <span className="label">Mã đơn:</span>
                    <span className="value">{selectedOrder.id.replace('order_', '#')}</span>
                  </div>
                  <div className="info-group">
                    <span className="label">Bàn:</span>
                    <span className="value">Bàn {selectedOrder.tableId}</span>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-group">
                    <span className="label">Thời gian:</span>
                    <span className="value">{formatDate(selectedOrder.timestamp)}</span>
                  </div>
                  <div className="info-group">
                    <span className="label">Trạng thái:</span>
                    <span className={`status-badge ${getStatusClass(selectedOrder.status)}`}>
                      {getStatusText(selectedOrder.status)}
                    </span>
                  </div>
                </div>
                {selectedOrder.estimatedTime && (
                  <div className="info-row">
                    <div className="info-group">
                      <span className="label">Thời gian dự kiến:</span>
                      <span className="value">{selectedOrder.estimatedTime} phút</span>
                    </div>
                  </div>
                )}
                {selectedOrder.note && (
                  <div className="info-row">
                    <div className="info-group full-width">
                      <span className="label">Ghi chú:</span>
                      <span className="value note">{selectedOrder.note}</span>
                    </div>
                  </div>
                )}
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
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.price.toLocaleString('vi-VN')}đ</td>
                        <td>{(item.price * item.quantity).toLocaleString('vi-VN')}đ</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3}>Tổng cộng</td>
                      <td>{selectedOrder.total.toLocaleString('vi-VN')}đ</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <div className="status-actions modal-status-actions">
                <label>Cập nhật trạng thái:</label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    updateOrderStatus(selectedOrder.id, e.target.value as OrderStatus);
                    setSelectedOrder({...selectedOrder, status: e.target.value as OrderStatus});
                  }}
                >
                  <option value="pending">Chờ duyệt</option>
                  <option value="preparing">Đang chuẩn bị</option>
                  <option value="ready">Sẵn sàng phục vụ</option>
                  <option value="delivered">Đã phục vụ</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
              <button 
                className="btn close-btn"
                onClick={() => setShowModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;