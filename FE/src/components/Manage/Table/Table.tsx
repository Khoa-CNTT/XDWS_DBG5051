import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaCheck, FaTimes, FaCalendarAlt } from 'react-icons/fa';
import './Table.scss';
import { Toast } from '../../Toast/Toast';
import { tableService, Table, TableRequest } from '../../../services/tableService';
import { bookingService, Booking } from '../../../services/bookingService';
import LoadingSpinner from '../../Loading/LoadingSpinner';
import axios from 'axios';

const TableManagement = () => {
  // State cho danh sách bàn
  const [tables, setTables] = useState<Table[]>([]);
  const [filteredTables, setFilteredTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State cho form thêm/sửa bàn
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTable, setCurrentTable] = useState<Table | null>(null);
  
  // State cho form fields
  const [formData, setFormData] = useState<TableRequest>({
    table_number: '',
    status: 'available'
  });
  
  // State cho validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // State cho toast messages
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  
  // State cho search/filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // State cho đặt bàn
  const [reservations, setReservations] = useState<Booking[]>([]);
  const [pendingReservations, setPendingReservations] = useState<Booking[]>([]);
  const [showReservations, setShowReservations] = useState(false);
  const [hasNewReservations, setHasNewReservations] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Booking | null>(null);
  const [isReservationDetailOpen, setIsReservationDetailOpen] = useState(false);
  
  // Xử lý việc chọn bàn cho đặt bàn
  const [selectedTableForReservation, setSelectedTableForReservation] = useState<string>('');
  const [availableTablesForReservation, setAvailableTablesForReservation] = useState<Table[]>([]);

  // Lấy dữ liệu bàn và đặt bàn từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const tablesData = await tableService.getAllTables();
        setTables(tablesData);
        setFilteredTables(tablesData);
        
        const bookingsData = await bookingService.getAllBookings();
        setReservations(bookingsData);
        
        const pending = bookingsData.filter(booking => booking.status === 'pending');
        setPendingReservations(pending);
        
        if (pending.length > 0) {
          setHasNewReservations(true);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        showToastMessage('Không thể tải dữ liệu. Vui lòng thử lại sau.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Set up polling để kiểm tra đặt bàn mới
    const pollingInterval = setInterval(async () => {
      try {
        const bookingsData = await bookingService.getAllBookings();
        const newPendingReservations = bookingsData.filter(booking => booking.status === 'pending');
        
        if (newPendingReservations.length > pendingReservations.length) {
          setPendingReservations(newPendingReservations);
          setHasNewReservations(true);
          showToastMessage('Có đặt bàn mới!', 'info');
        }
      } catch (error) {
        console.error('Error checking new reservations:', error);
      }
    }, 60000); // Check mỗi phút
    
    return () => clearInterval(pollingInterval);
  }, []);

  // Lọc bàn phù hợp cho đặt bàn
  useEffect(() => {
    if (selectedReservation) {
      // Chỉ lọc các bàn trống
      const suitableTables = tables.filter(table => 
        table.status === 'available'
      );
      
      console.log('Available tables:', suitableTables);
      setAvailableTablesForReservation(suitableTables);
      
      // Reset selected table
      setSelectedTableForReservation('');
    }
  }, [selectedReservation, tables]);

  // Hàm filter tables dựa trên search term và filter status
  useEffect(() => {
    let filtered = tables;
    
    if (searchTerm) {
  filtered = filtered.filter(table =>
    table.table_number?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.id?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );
}

    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(table => table.status === filterStatus);
    }
    
    setFilteredTables(filtered);
  }, [searchTerm, filterStatus, tables]);

  // Hiển thị toast
  const showToastMessage = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Xử lý xem danh sách đặt bàn đang chờ
  const handleViewReservations = () => {
    setShowReservations(true);
    setHasNewReservations(false);
  };

  // Xử lý xem chi tiết đặt bàn
  const handleViewReservationDetail = (reservation: Booking) => {
    setSelectedReservation(reservation);
    setIsReservationDetailOpen(true);
  };

  // Xử lý thay đổi bàn được chọn
  const handleTableSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTableForReservation(e.target.value);
  };

  // Xử lý thêm bàn mới
  const handleAddTable = () => {
    setIsEditing(false);
    setFormData({
      table_number: '',
      status: 'available'
    });
    setIsFormOpen(true);
  };

  // Xử lý sửa bàn
  const handleEditTable = (table: Table) => {
    setIsEditing(true);
    setCurrentTable(table);
    setFormData({
      table_number: table.table_number,
      status: table.status
    });
    setIsFormOpen(true);
  };

  // Xử lý thay đổi trạng thái bàn
  const handleStatusChange = async (tableId: string, newStatus: 'available' | 'reserved' | 'occupied') => {
    try {
      const current = tables.find(t => t.id === tableId);
      if (!current) return;
  
      // Gửi chỉ trạng thái (status) mới
      const updatedTable = await tableService.updateTableStatus(tableId, newStatus);
  
      setTables(prev =>
        prev.map(table => table.id === tableId ? updatedTable : table)
      );
  
      showToastMessage(`Đã cập nhật trạng thái bàn thành ${
        newStatus === 'available' ? 'Trống' :
        newStatus === 'reserved' ? 'Đã đặt' : 'Đang sử dụng'
      }`);
    } catch (error) {
      console.error('Error updating table status:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Không thể cập nhật trạng thái bàn';
        showToastMessage(`Lỗi: ${errorMessage}`, 'error');
      } else {
        showToastMessage('Không thể cập nhật trạng thái bàn', 'error');
      }
    }
};
  
  // Xử lý xóa bàn
  const handleDeleteTable = async (tableId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bàn này?')) {
      try {
        await tableService.deleteTable(tableId);
        setTables(prev => prev.filter(table => table.id !== tableId));
        showToastMessage('Đã xóa bàn thành công');
      } catch (error) {
        console.error('Error deleting table:', error);
        showToastMessage('Không thể xóa bàn', 'error');
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.table_number?.trim()) {
      newErrors.table_number = 'Vui lòng nhập số bàn';
    } else if (isEditing && formData.table_number === currentTable?.table_number) {
      // Nếu đang sửa và số bàn không thay đổi thì không cần kiểm tra trùng
      return true;
    } else {
      // Kiểm tra số bàn trùng
      const isDuplicate = tables.some(table => 
        table.table_number === formData.table_number && 
        table.id !== currentTable?.id
      );
      
      if (isDuplicate) {
        newErrors.table_number = 'Số bàn này đã tồn tại';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        if (isEditing && currentTable) {
          // Update existing table
          const updatedTable = await tableService.updateTable(currentTable.id, {
            table_number: formData.table_number,
            status: formData.status
          });          
          
          setTables(prev =>
            prev.map(table =>
              table.id === currentTable.id ? updatedTable : table
            )
          );
          
          showToastMessage('Cập nhật bàn thành công');
        } else {
          // Add new table
          if (!formData.table_number) {
            showToastMessage('Vui lòng nhập số bàn', 'error');
            return;
          }
          
          const newTable = await tableService.createTable({
            table_number: formData.table_number,
            status: formData.status || 'available'
          });
          
          setTables(prev => [...prev, newTable]);
          showToastMessage('Thêm bàn mới thành công');
        }
        
        setIsFormOpen(false);
        setCurrentTable(null);
      } catch (error) {
        console.error('Error saving table:', error);
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.message || 'Không thể lưu thông tin bàn';
          console.error('Server response:', error.response?.data);
          if (error.response?.status === 422) {
            showToastMessage(`Lỗi: ${errorMessage}`, 'error');
          } else if (error.response?.status === 500) {
            showToastMessage('Lỗi server: Vui lòng thử lại sau', 'error');
          } else {
            showToastMessage(`Lỗi: ${errorMessage}`, 'error');
          }
        } else {
          showToastMessage('Không thể lưu thông tin bàn', 'error');
        }
      }
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Render status badge with appropriate color
  const renderStatusBadge = (status: string) => {
    let badgeClass = '';
    let statusText = '';
    
    switch (status) {
      case 'available':
        badgeClass = 'status-available';
        statusText = 'Trống';
        break;
      case 'reserved':
        badgeClass = 'status-reserved';
        statusText = 'Đã đặt';
        break;
      case 'occupied':
        badgeClass = 'status-occupied';
        statusText = 'Đang sử dụng';
        break;
      default:
        badgeClass = '';
        statusText = status;
    }
    
    return <span className={`status-badge ${badgeClass}`}>{statusText}</span>;
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    console.log('Formatting date:', dateStr);
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString('vi-VN');
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // Format time for display
  const formatTime = (timeStr: string) => {
    console.log('Formatting time:', timeStr);
    if (!timeStr) return '';
    // Nếu timeStr đã ở định dạng HH:mm thì trả về luôn
    if (/^\d{2}:\d{2}$/.test(timeStr)) {
      return timeStr;
    }
    // Nếu là booking_time thì sử dụng nó
    return timeStr;
  };

  // Format date time for display
  const formatDateTime = (dateTimeStr: string) => {
    console.log('Formatting datetime:', dateTimeStr);
    if (!dateTimeStr) return '';
    try {
      const date = new Date(dateTimeStr);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting datetime:', error);
      return '';
    }
  };

  return (
    <div className="table-management">
      <div className="table-management-header">
        <div className="search-filter-container">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm bàn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-box">
            <label htmlFor="status-filter">Lọc theo trạng thái:</label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="available">Trống</option>
              <option value="reserved">Đã đặt</option>
              <option value="occupied">Đang sử dụng</option>
            </select>
          </div>
        </div>
        
        <div className="action-buttons">
          <button
            className={`reservations-btn ${hasNewReservations ? 'has-new' : ''}`}
            onClick={handleViewReservations}
          >
            <FaCalendarAlt /> Đặt bàn
            {hasNewReservations && <span className="notification-badge">{pendingReservations.length}</span>}
          </button>
          
          <button className="add-table-btn" onClick={handleAddTable}>
            <FaPlus /> Thêm bàn mới
          </button>
        </div>
      </div>
      
      {!showReservations ? (
        <div className="tables-grid">
          {isLoading ? (
            <div style={{ gridColumn: '1 / -1', width: '100%' }}>
              <LoadingSpinner loadingText="Đang tải danh sách bàn..." showDots={true} />
            </div>
          ) : filteredTables.length > 0 ? (
            filteredTables.map(table => (
              <div key={table.id} className={`table-card ${table.status}`}>
                <div className="table-card-header">
                  <h3>Bàn {table.table_number}</h3>
                  {renderStatusBadge(table.status)}
                </div>
                
                <div className="table-card-content">
                  <p><strong>Mã bàn:</strong> {table.id}</p>
                  {table.qr_code && (
                    <div className="qr-code">
                      <img src={table.qr_code} alt={`QR Code for Table ${table.table_number}`} />
                    </div>
                  )}
                </div>
                
                <div className="table-card-actions">
                  <div className="status-actions">
                    <label>Trạng thái:</label>
                    <select
                      value={table.status}
                      onChange={(e) => handleStatusChange(
                        table.id,
                        e.target.value as 'available' | 'reserved' | 'occupied'
                      )}
                    >
                      <option value="available">Trống</option>
                      <option value="reserved">Đã đặt</option>
                      <option value="occupied">Đang sử dụng</option>
                    </select>
                  </div>
                  
                  <div className="card-buttons">
                    <button className="edit-btn" onClick={() => handleEditTable(table)}>
                      <FaEdit /> Sửa
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteTable(table.id)}>
                      <FaTrash /> Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-tables-message">
              <p>Không tìm thấy bàn nào</p>
            </div>
          )}
        </div>
      ) : (
        <div className="reservations-section">
          <div className="reservations-header">
            <h2>Danh sách đặt bàn đang chờ xác nhận ({pendingReservations.length})</h2>
            <button
              className="back-btn"
              onClick={() => setShowReservations(false)}
            >
              Quay lại quản lý bàn
            </button>
          </div>
          
          <div className="reservations-list">
            {pendingReservations.length > 0 ? (
              <table className="reservations-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Ngày đặt</th>
                    <th>Giờ</th>
                    <th>Khách</th>
                    <th>Tên khách hàng</th>
                    <th>Liên lạc</th>
                    <th>Thời gian đặt</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingReservations.map(reservation => {
                    console.log('Reservation data:', reservation);
                    return (
                      <tr key={reservation.id}>
                        <td>{reservation.id}</td>
                        <td>{formatDate(reservation.booking_date)}</td>
                        <td>{formatTime(reservation.booking_time)}</td>
                        <td>{reservation.guests} người</td>
                        <td>{reservation.customer_name || reservation.name}</td>
                        <td>
                          <div>📞 {reservation.phone}</div>
                          <div>✉️ {reservation.email}</div>
                        </td>
                        <td>{formatDateTime(reservation.created_at)}</td>
                        <td>
                          <div className="table-row-actions">
                            <button
                              className="view-btn"
                              onClick={() => handleViewReservationDetail(reservation)}
                            >
                              Xem chi tiết
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="no-reservations-message">
                <p>Không có đặt bàn nào đang chờ xác nhận</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {isFormOpen && (
        <div className="table-form-overlay">
          <div className="table-form-container">
            <div className="form-header">
              <h2>{isEditing ? 'Cập nhật thông tin bàn' : 'Thêm bàn mới'}</h2>
              <button className="close-btn" onClick={() => setIsFormOpen(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="table_number">Số bàn <span className="required">*</span></label>
                <input
                  type="text"
                  id="table_number"
                  name="table_number"
                  value={formData.table_number}
                  onChange={handleInputChange}
                  className={errors.table_number ? 'error' : ''}
                />
                {errors.table_number && <div className="error-message">{errors.table_number}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="status">Trạng thái</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="available">Trống</option>
                  <option value="reserved">Đã đặt</option>
                  <option value="occupied">Đang sử dụng</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsFormOpen(false)}>
                  Hủy
                </button>
                <button type="submit" className="submit-btn">
                  {isEditing ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {isReservationDetailOpen && selectedReservation && (
        <div className="reservation-detail-overlay">
          <div className="reservation-detail-container">
            <div className="detail-header">
              <h2>Chi tiết đặt bàn</h2>
              <button className="close-btn" onClick={() => setIsReservationDetailOpen(false)}>×</button>
            </div>
            
            <div className="detail-content">
              <div className="detail-section">
                <h3>Thông tin đặt bàn</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Ngày đặt:</span>
                    <span className="detail-value">{formatDate(selectedReservation.booking_date)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Giờ đặt:</span>
                    <span className="detail-value">{formatTime(selectedReservation.booking_time)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Số khách:</span>
                    <span className="detail-value">{selectedReservation.guests} người</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Trạng thái:</span>
                    <span className={`detail-value status-${selectedReservation.status}`}>
                      {selectedReservation.status === 'pending' ? 'Chờ xác nhận' :
                       selectedReservation.status === 'confirmed' ? 'Đã xác nhận' : 'Đã hủy'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h3>Thông tin khách hàng</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Họ tên:</span>
                    <span className="detail-value">{selectedReservation.customer_name || selectedReservation.name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Số điện thoại:</span>
                    <span className="detail-value">{selectedReservation.phone}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedReservation.email}</span>
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h3>Ghi chú</h3>
                <div className="notes-section">
                  {selectedReservation.note ? (
                    <p className="note-content">{selectedReservation.note}</p>
                  ) : (
                    <p className="no-note">Không có ghi chú</p>
                  )}
                </div>
              </div>
              
              <div className="detail-section">
                <h3>Xác nhận đặt bàn</h3>
                <div className="table-selection">
                  <label htmlFor="table-select">Chọn bàn:</label>
                  <select
                    id="table-select"
                    value={selectedTableForReservation}
                    onChange={handleTableSelectionChange}
                    className="table-select"
                  >
                    <option value="">-- Chọn bàn --</option>
                    {availableTablesForReservation.length > 0 ? (
                      availableTablesForReservation.map(table => (
                        <option key={table.id} value={table.id}>
                          Bàn {table.table_number}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>Không có bàn trống</option>
                    )}
                  </select>
                  {availableTablesForReservation.length === 0 && (
                    <p className="no-tables-message">Hiện tại không có bàn trống</p>
                  )}
                </div>
                
                <div className="confirmation-actions">
                  <button
                    className="confirm-btn"
                    onClick={async () => {
                      try {
                        await bookingService.updateBookingStatus(selectedReservation.id, 'confirmed');
                        showToastMessage('Đã xác nhận đặt bàn thành công');
                        setIsReservationDetailOpen(false);
                        // Refresh data
                        const bookingsData = await bookingService.getAllBookings();
                        setReservations(bookingsData);
                        setPendingReservations(bookingsData.filter(booking => booking.status === 'pending'));
                      } catch (error) {
                        console.error('Error confirming booking:', error);
                        showToastMessage('Không thể xác nhận đặt bàn', 'error');
                      }
                    }}
                    disabled={!selectedTableForReservation}
                  >
                    <FaCheck /> Xác nhận
                  </button>
                  
                  <button
                    className="cancel-btn"
                    onClick={async () => {
                      try {
                        await bookingService.updateBookingStatus(selectedReservation.id, 'cancelled');
                        showToastMessage('Đã hủy đặt bàn');
                        setIsReservationDetailOpen(false);
                        // Refresh data
                        const bookingsData = await bookingService.getAllBookings();
                        setReservations(bookingsData);
                        setPendingReservations(bookingsData.filter(booking => booking.status === 'pending'));
                      } catch (error) {
                        console.error('Error cancelling booking:', error);
                        showToastMessage('Không thể hủy đặt bàn', 'error');
                      }
                    }}
                  >
                    <FaTimes /> Hủy đặt bàn
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default TableManagement;
