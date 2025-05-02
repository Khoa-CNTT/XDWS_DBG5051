import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaCheck, FaTimes, FaCalendarAlt } from 'react-icons/fa';
import './Table.scss';
import { Toast } from '../../Toast/Toast';
import axios from 'axios';

// Định nghĩa kiểu dữ liệu Table
interface Table {
  id: string;
  name: string;
  status: 'available' | 'reserved' | 'occupied';
  qrCodeUrl?: string;
}

// Định nghĩa kiểu dữ liệu Reservation
interface Reservation {
  id: string;
  date: string;
  time: string;
  guests: number;
  name: string;
  phone: string;
  email: string;
  notes: string;
  withChildren: boolean;
  birthday: boolean;
  window: boolean;
  childrenChair: boolean;
  status: 'pending' | 'confirmed' | 'cancelled';
  tableId?: string;
  createdAt: string;
}

const TableManagement = () => {
  // State cho danh sách bàn
  const [tables, setTables] = useState<Table[]>([]);
  const [filteredTables, setFilteredTables] = useState<Table[]>([]);
  
  // State cho form thêm/sửa bàn
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTable, setCurrentTable] = useState<Table | null>(null);
  
  // State cho form fields
  const [formData, setFormData] = useState({
    id: '',
    name: '',
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
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [pendingReservations, setPendingReservations] = useState<Reservation[]>([]);
  const [showReservations, setShowReservations] = useState(false);
  const [hasNewReservations, setHasNewReservations] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isReservationDetailOpen, setIsReservationDetailOpen] = useState(false);
  
  // Xử lý việc chọn bàn cho đặt bàn
  const [selectedTableForReservation, setSelectedTableForReservation] = useState<string>('');
  const [availableTablesForReservation, setAvailableTablesForReservation] = useState<Table[]>([]);

  // Lấy dữ liệu bàn và đặt bàn từ API
  useEffect(() => {
    // Simulating API fetch for tables
    const mockTables: Table[] = [
      { id: '1', name: 'Bàn 1', status: 'available' },
      { id: '2', name: 'Bàn 2', status: 'available' },
      { id: '3', name: 'Bàn 3', status: 'occupied' },
      { id: '4', name: 'Bàn VIP 1', status: 'available' },
    ];
    
    setTables(mockTables);
    setFilteredTables(mockTables);
    
    // Simulating API fetch for reservations
    const mockReservations: Reservation[] = [
      {
        id: '1',
        date: '2025-04-10',
        time: '18:30',
        guests: 4,
        name: 'Nguyễn Văn A',
        phone: '0912345678',
        email: 'nguyenvana@gmail.com',
        notes: 'Mong muốn có ghế cao cho trẻ nhỏ',
        withChildren: true,
        birthday: false,
        window: true,
        childrenChair: true,
        status: 'pending',
        createdAt: '2025-04-09T09:15:23'
      },
      {
        id: '2',
        date: '2025-04-10',
        time: '19:00',
        guests: 6,
        name: 'Trần Thị B',
        phone: '0387654321',
        email: 'tranthib@gmail.com',
        notes: 'Đặt bàn sinh nhật, cần chuẩn bị bánh kem',
        withChildren: false,
        birthday: true,
        window: false,
        childrenChair: false,
        status: 'pending',
        createdAt: '2025-04-09T10:22:45'
      },
      {
        id: '3',
        date: '2025-04-11',
        time: '12:00',
        guests: 2,
        name: 'Lê Văn C',
        phone: '0923456789',
        email: 'levanc@gmail.com',
        notes: '',
        withChildren: false,
        birthday: false,
        window: true,
        childrenChair: false,
        status: 'confirmed',
        tableId: '2',
        createdAt: '2025-04-08T16:45:12'
      }
    ];
    
    setReservations(mockReservations);
    
    // Lọc ra các đặt bàn đang chờ phê duyệt
    const pending = mockReservations.filter(res => res.status === 'pending');
    setPendingReservations(pending);
    
    // Kiểm tra nếu có đặt bàn mới
    if (pending.length > 0) {
      setHasNewReservations(true);
    }
    
    // Trong thực tế, bạn sẽ sử dụng axios để gọi API
    // Ví dụ:
    /*
    const fetchData = async () => {
      try {
        const tablesResponse = await axios.get('/api/tables');
        setTables(tablesResponse.data);
        setFilteredTables(tablesResponse.data);
        
        const reservationsResponse = await axios.get('/api/reservations');
        setReservations(reservationsResponse.data);
        
        const pendingReservations = reservationsResponse.data.filter(
          (res: Reservation) => res.status === 'pending'
        );
        setPendingReservations(pendingReservations);
        
        if (pendingReservations.length > 0) {
          setHasNewReservations(true);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        showToastMessage('Không thể tải dữ liệu. Vui lòng thử lại sau.', 'error');
      }
    };
    
    fetchData();
    
    // Set up polling để kiểm tra đặt bàn mới
    const pollingInterval = setInterval(async () => {
      try {
        const newReservationsResponse = await axios.get('/api/reservations/pending');
        const newPendingReservations = newReservationsResponse.data;
        
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
    */
  }, []);

  // Lọc bàn phù hợp cho đặt bàn
  useEffect(() => {
    if (selectedReservation) {
      // Lọc bàn trống
      const suitableTables = tables.filter(table =>
        table.status === 'available'
      );
      
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
        table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        table.id.toLowerCase().includes(searchTerm.toLowerCase())
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
  const handleViewReservationDetail = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsReservationDetailOpen(true);
  };

  // Xử lý thay đổi bàn được chọn
  const handleTableSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTableForReservation(e.target.value);
  };

  // Xử lý xác nhận đặt bàn
  const handleConfirmReservation = async (reservationId: string, tableId: string) => {
    try {
      // Trong thực tế, bạn sẽ gọi API
      /*
      await axios.put(`/api/reservations/${reservationId}/confirm`, { tableId });
      */
      
      // Update reservation status
     const updatedReservations = reservations.map(res =>
        res.id === reservationId
            ? { ...res, status: 'confirmed' as const, tableId }
            : res
      );
      setReservations(updatedReservations);
      
      // Update pending reservations
      const newPendingReservations = pendingReservations.filter(res => res.id !== reservationId);
      setPendingReservations(newPendingReservations);
      
      // Update table status
      const updatedTables = tables.map(table =>
        table.id === tableId
            ? { ...table, status: 'reserved' as const }
            : table
      );
      setTables(updatedTables);
      
      showToastMessage('Đã xác nhận đặt bàn thành công', 'success');
      
      // Close details modal if open
      if (isReservationDetailOpen) {
        setIsReservationDetailOpen(false);
      }
    } catch (error) {
      console.error('Error confirming reservation:', error);
      showToastMessage('Không thể xác nhận đặt bàn. Vui lòng thử lại.', 'error');
    }
  };

  // Xử lý từ chối đặt bàn
  const handleRejectReservation = async (reservationId: string) => {
    try {
      // Trong thực tế, bạn sẽ gọi API
      /*
      await axios.put(`/api/reservations/${reservationId}/cancel`);
      */
      
      // Update reservation status
      const updatedReservations = reservations.map(res =>
        res.id === reservationId
          ? { ...res, status: 'cancelled' as const }
          : res
      );
      setReservations(updatedReservations);
      
      // Update pending reservations
      const newPendingReservations = pendingReservations.filter(res => res.id !== reservationId);
      setPendingReservations(newPendingReservations);
      
      showToastMessage('Đã từ chối đặt bàn', 'info');
      
      // Close details modal if open
      if (isReservationDetailOpen) {
        setIsReservationDetailOpen(false);
      }
    } catch (error) {
      console.error('Error rejecting reservation:', error);
      showToastMessage('Không thể từ chối đặt bàn. Vui lòng thử lại.', 'error');
    }
  };

  // Xử lý form change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors khi người dùng nhập lại
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Vui lòng nhập tên bàn';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý thêm bàn mới
  const handleAddTable = () => {
    setIsEditing(false);
    setFormData({
      id: '',
      name: '',
      status: 'available'
    });
    setIsFormOpen(true);
  };

  // Xử lý sửa bàn
  const handleEditTable = (table: Table) => {
    setIsEditing(true);
    setCurrentTable(table);
    setFormData({
      id: table.id,
      name: table.name,
      status: table.status
    });
    setIsFormOpen(true);
  };

  // Xử lý thay đổi trạng thái bàn
  const handleStatusChange = (tableId: string, newStatus: 'available' | 'reserved' | 'occupied') => {
    setTables(prev =>
      prev.map(table =>
        table.id === tableId ? { ...table, status: newStatus } : table
      )
    );
    showToastMessage(`Đã cập nhật trạng thái bàn thành ${
      newStatus === 'available' ? 'Trống' :
      newStatus === 'reserved' ? 'Đã đặt' : 'Đang sử dụng'
    }`);
  };

  // Xử lý xóa bàn
  const handleDeleteTable = (tableId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bàn này?')) {
      setTables(prev => prev.filter(table => table.id !== tableId));
      showToastMessage('Đã xóa bàn thành công');
    }
  };

  // Xử lý submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (isEditing && currentTable) {
        // Update existing table
        setTables(prev =>
          prev.map(table =>
            table.id === currentTable.id ? { ...formData as Table } : table
          )
        );
        showToastMessage('Cập nhật bàn thành công');
      } else {
        // Add new table
        const newId = (Math.max(...tables.map(t => parseInt(t.id)), 0) + 1).toString();
        const newTable: Table = {
          ...formData,
          id: newId
        } as Table;
        
        setTables(prev => [...prev, newTable]);
        showToastMessage('Thêm bàn mới thành công');
      }
      
      setIsFormOpen(false);
      setCurrentTable(null);
    }
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
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
  };

  // Format time for display
  const formatTime = (timeStr: string) => {
    return timeStr;
  };

  // Format date time for display
  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('vi-VN');
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
          {filteredTables.length > 0 ? (
            filteredTables.map(table => (
              <div key={table.id} className={`table-card ${table.status}`}>
                <div className="table-card-header">
                  <h3>{table.name}</h3>
                  {renderStatusBadge(table.status)}
                </div>
                
                <div className="table-card-content">
                  <p><strong>Mã bàn:</strong> {table.id}</p>
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
                  {pendingReservations.map(reservation => (
                    <tr key={reservation.id}>
                      <td>{reservation.id}</td>
                      <td>{formatDate(reservation.date)}</td>
                      <td>{formatTime(reservation.time)}</td>
                      <td>{reservation.guests}</td>
                      <td>{reservation.name}</td>
                      <td>{reservation.phone}</td>
                      <td>{formatDateTime(reservation.createdAt)}</td>
                      <td>
                        <div className="table-row-actions">
                          <button
                            className="view-btn"
                            onClick={() => handleViewReservationDetail(reservation)}
                          >
                            Chi tiết
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
                <label htmlFor="name">Tên bàn <span className="required">*</span></label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <div className="error-message">{errors.name}</div>}
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
              <h2>Chi tiết đặt bàn #{selectedReservation.id}</h2>
              <button
                className="close-btn"
                onClick={() => setIsReservationDetailOpen(false)}
              >
                ×
              </button>
            </div>
            
            <div className="reservation-details">
              <div className="detail-section">
                <h3>Thông tin đặt bàn</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Ngày đặt:</span>
                    <span className="detail-value">{formatDate(selectedReservation.date)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Thời gian:</span>
                    <span className="detail-value">{selectedReservation.time}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Số lượng khách:</span>
                    <span className="detail-value">{selectedReservation.guests} người</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Thời gian đặt:</span>
                    <span className="detail-value">{formatDateTime(selectedReservation.createdAt)}</span>
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h3>Thông tin khách hàng</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Họ tên:</span>
                    <span className="detail-value">{selectedReservation.name}</span>
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
                <h3>Yêu cầu đặc biệt</h3>
                <div className="special-requests">
                  {selectedReservation.withChildren && (
                    <div className="request-tag">Có trẻ em</div>
                  )}
                  {selectedReservation.birthday && (
                    <div className="request-tag">Tiệc sinh nhật</div>
                  )}
                  {selectedReservation.window && (
                    <div className="request-tag">Bàn gần cửa sổ</div>
                  )}
                  {selectedReservation.childrenChair && (
                    <div className="request-tag">Cần ghế trẻ em</div>
                  )}
                </div>
                
                {selectedReservation.notes && (
                  <div className="notes-section">
                    <h4>Ghi chú:</h4>
                    <p>{selectedReservation.notes}</p>
                  </div>
                )}
              </div>
              
              <div className="detail-section">
                <h3>Xử lý đặt bàn</h3>
                
                <div className="table-selection">
                  <label htmlFor="table-select">Chọn bàn:</label>
                  <select
                    id="table-select"
                    value={selectedTableForReservation}
                    onChange={handleTableSelectionChange}
                  >
                    <option value="">-- Chọn bàn --</option>
                    {availableTablesForReservation.map(table => (
                      <option key={table.id} value={table.id}>
                        {table.name} (Mã bàn: {table.id})
                      </option>
                    ))}
                  </select>
                  
                  {availableTablesForReservation.length === 0 && (
                    <div className="warning-message">
                      <p>Không có bàn trống phù hợp với số lượng khách!</p>
                    </div>
                  )}
                </div>
                
                <div className="action-buttons">
                  <button
                    className="reject-btn"
                    onClick={() => handleRejectReservation(selectedReservation.id)}
                  >
                    <FaTimes /> Từ chối đặt bàn
                  </button>
                  
                  <button
                    className="confirm-btn"
                    disabled={!selectedTableForReservation}
                    onClick={() => handleConfirmReservation(selectedReservation.id, selectedTableForReservation)}
                  >
                    <FaCheck /> Xác nhận đặt bàn
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

// import { useState, useEffect } from 'react';
// import { FaPlus, FaEdit, FaTrash, FaSearch, FaCheck, FaTimes, FaCalendarAlt } from 'react-icons/fa';
// import './TableManagement.scss';
// import { Toast } from '../Toast/Toast';

// interface Table {
//   id: string;
//   name: string;
//   status: 'available' | 'reserved' | 'occupied';
//   qrCodeUrl?: string;
// }

// interface Reservation {
//   id: string;
//   date: string;
//   time: string;
//   guests: number;
//   name: string;
//   phone: string;
//   email: string;
//   notes: string;
//   withChildren: boolean;
//   birthday: boolean;
//   window: boolean;
//   childrenChair: boolean;
//   status: 'pending' | 'confirmed' | 'cancelled';
//   tableId?: string;
//   createdAt: string;
// }

// const TableManagement = () => {
//   const [tables, setTables] = useState<Table[]>([]);
//   const [filteredTables, setFilteredTables] = useState<Table[]>([]);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentTable, setCurrentTable] = useState<Table | null>(null);
//   const [formData, setFormData] = useState({
//     id: '',
//     name: '',
//     status: 'available'
//   });
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [showToast, setShowToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState('');
//   const [toastType, setToastType] = useState<'success' | 'error' | 'info' | 'warning'>('success');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');

//   const [reservations, setReservations] = useState<Reservation[]>([]);
//   const [pendingReservations, setPendingReservations] = useState<Reservation[]>([]);
//   const [showReservations, setShowReservations] = useState(false);
//   const [hasNewReservations, setHasNewReservations] = useState(false);

//   useEffect(() => {
//     const mockTables: Table[] = [
//       { id: '1', name: 'Bàn 1', status: 'available' },
//       { id: '2', name: 'Bàn 2', status: 'available' },
//       { id: '3', name: 'Bàn 3', status: 'occupied' },
//       { id: '4', name: 'Bàn VIP 1', status: 'available' },
//     ];
//     setTables(mockTables);
//     setFilteredTables(mockTables);

//     const mockReservations: Reservation[] = [
//       {
//         id: '1',
//         date: '2025-04-10',
//         time: '18:30',
//         guests: 4,
//         name: 'Nguyễn Văn A',
//         phone: '0912345678',
//         email: 'nguyenvana@gmail.com',
//         notes: 'Mong muốn có ghế cao cho trẻ nhỏ',
//         withChildren: true,
//         birthday: false,
//         window: true,
//         childrenChair: true,
//         status: 'pending',
//         createdAt: '2025-04-09T09:15:23'
//       },
//       {
//         id: '2',
//         date: '2025-04-10',
//         time: '19:00',
//         guests: 6,
//         name: 'Trần Thị B',
//         phone: '0387654321',
//         email: 'tranthib@gmail.com',
//         notes: 'Đặt bàn sinh nhật, cần chuẩn bị bánh kem',
//         withChildren: false,
//         birthday: true,
//         window: false,
//         childrenChair: false,
//         status: 'pending',
//         createdAt: '2025-04-09T10:22:45'
//       }
//     ];
//     setReservations(mockReservations);
//     const pending = mockReservations.filter(res => res.status === 'pending');
//     setPendingReservations(pending);
//     if (pending.length > 0) setHasNewReservations(true);
//   }, []);

//   const showToastMessage = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
//     setToastMessage(message);
//     setToastType(type);
//     setShowToast(true);
//     setTimeout(() => setShowToast(false), 3000);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     if (errors[name]) {
//       setErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors[name];
//         return newErrors;
//       });
//     }
//   };

//   const validateForm = (): boolean => {
//     const newErrors: Record<string, string> = {};
//     if (!formData.name || formData.name.trim() === '') {
//       newErrors.name = 'Vui lòng nhập tên bàn';
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleAddTable = () => {
//     setIsEditing(false);
//     setFormData({ id: '', name: '', status: 'available' });
//     setIsFormOpen(true);
//   };

//   const handleEditTable = (table: Table) => {
//     setIsEditing(true);
//     setCurrentTable(table);
//     setFormData({ id: table.id, name: table.name, status: table.status });
//     setIsFormOpen(true);
//   };

//   const handleStatusChange = (tableId: string, newStatus: 'available' | 'reserved' | 'occupied') => {
//     setTables(prev =>
//       prev.map(table =>
//         table.id === tableId ? { ...table, status: newStatus } : table
//       )
//     );
//     showToastMessage(`Đã cập nhật trạng thái bàn thành ${newStatus}`);
//   };

//   const handleDeleteTable = (tableId: string) => {
//     if (window.confirm('Bạn có chắc chắn muốn xóa bàn này?')) {
//       setTables(prev => prev.filter(table => table.id !== tableId));
//       showToastMessage('Đã xóa bàn thành công');
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (validateForm()) {
//       if (isEditing && currentTable) {
//         setTables(prev =>
//           prev.map(table =>
//             table.id === currentTable.id ? ({ ...formData } as Table) : table
//           )
//         );
//         showToastMessage('Cập nhật bàn thành công');
//       } else {
//         const newId = (Math.max(...tables.map(t => parseInt(t.id)), 0) + 1).toString();
//         const newTable: Table = { ...formData, id: newId } as Table;
//         setTables(prev => [...prev, newTable]);
//         showToastMessage('Thêm bàn mới thành công');
//       }
//       setIsFormOpen(false);
//       setCurrentTable(null);
//     }
//   };

//   const renderStatusBadge = (status: string) => {
//     let badgeClass = '';
//     let statusText = '';
//     switch (status) {
//       case 'available': badgeClass = 'status-available'; statusText = 'Trống'; break;
//       case 'reserved': badgeClass = 'status-reserved'; statusText = 'Đã đặt'; break;
//       case 'occupied': badgeClass = 'status-occupied'; statusText = 'Đang sử dụng'; break;
//       default: statusText = status;
//     }
//     return <span className={`status-badge ${badgeClass}`}>{statusText}</span>;
//   };

//   const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('vi-VN');
//   const formatTime = (timeStr: string) => timeStr;
//   const formatDateTime = (dateTimeStr: string) => new Date(dateTimeStr).toLocaleString('vi-VN');

//   return (
//     <div className="table-management">
//       <div className="table-management-header">
//         <div className="search-filter-container">
//           <div className="search-box">
//             <FaSearch className="search-icon" />
//             <input
//               type="text"
//               placeholder="Tìm kiếm bàn..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <div className="filter-box">
//             <label htmlFor="status-filter">Lọc theo trạng thái:</label>
//             <select
//               id="status-filter"
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//             >
//               <option value="all">Tất cả</option>
//               <option value="available">Trống</option>
//               <option value="reserved">Đã đặt</option>
//               <option value="occupied">Đang sử dụng</option>
//             </select>
//           </div>
//         </div>
//         <div className="action-buttons">
//           <button
//             className={`reservations-btn ${hasNewReservations ? 'has-new' : ''}`}
//             onClick={() => setShowReservations(true)}
//           >
//             <FaCalendarAlt /> Đặt bàn
//             {hasNewReservations && <span className="notification-badge">{pendingReservations.length}</span>}
//           </button>
//           <button className="add-table-btn" onClick={handleAddTable}>
//             <FaPlus /> Thêm bàn mới
//           </button>
//         </div>
//       </div>

//       {!showReservations ? (
//         <div className="tables-grid">
//           {filteredTables.length > 0 ? (
//             filteredTables.map(table => (
//               <div key={table.id} className={`table-card ${table.status}`}>
//                 <div className="table-card-header">
//                   <h3>{table.name}</h3>
//                   {renderStatusBadge(table.status)}
//                 </div>
//                 <div className="table-card-content">
//                   <p><strong>Mã bàn:</strong> {table.id}</p>
//                 </div>
//                 <div className="table-card-actions">
//                   <div className="status-actions">
//                     <label>Trạng thái:</label>
//                     <select
//                       value={table.status}
//                       onChange={(e) => handleStatusChange(table.id, e.target.value as Table['status'])}
//                     >
//                       <option value="available">Trống</option>
//                       <option value="reserved">Đã đặt</option>
//                       <option value="occupied">Đang sử dụng</option>
//                     </select>
//                   </div>
//                   <div className="card-buttons">
//                     <button className="edit-btn" onClick={() => handleEditTable(table)}>
//                       <FaEdit /> Sửa
//                     </button>
//                     <button className="delete-btn" onClick={() => handleDeleteTable(table.id)}>
//                       <FaTrash /> Xóa
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="no-tables-message">
//               <p>Không tìm thấy bàn nào</p>
//             </div>
//           )}
//         </div>
//       ) : (
//         <div className="reservations-section">
//           <div className="reservations-header">
//             <h2>Danh sách đặt bàn đang chờ xác nhận ({pendingReservations.length})</h2>
//             <button
//               className="back-btn"
//               onClick={() => setShowReservations(false)}
//             >
//               Quay lại quản lý bàn
//             </button>
//           </div>
//           <div className="reservations-list">
//             {pendingReservations.length > 0 ? (
//               <table className="reservations-table">
//                 <thead>
//                   <tr>
//                     <th>ID</th>
//                     <th>Ngày</th>
//                     <th>Giờ</th>
//                     <th>Khách</th>
//                     <th>Khách hàng</th>
//                     <th>Liên hệ</th>
//                     <th>Thời gian đặt</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {pendingReservations.map(res => (
//                     <tr key={res.id}>
//                       <td>{res.id}</td>
//                       <td>{formatDate(res.date)}</td>
//                       <td>{formatTime(res.time)}</td>
//                       <td>{res.guests}</td>
//                       <td>{res.name}</td>
//                       <td>{res.phone}</td>
//                       <td>{formatDateTime(res.createdAt)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <div className="no-reservations-message">
//                 <p>Không có đặt bàn nào đang chờ</p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {isFormOpen && (
//         <div className="table-form-overlay">
//           <div className="table-form-container">
//             <div className="form-header">
//               <h2>{isEditing ? 'Cập nhật thông tin bàn' : 'Thêm bàn mới'}</h2>
//               <button className="close-btn" onClick={() => setIsFormOpen(false)}>×</button>
//             </div>
//             <form onSubmit={handleSubmit}>
//               <div className="form-group">
//                 <label htmlFor="name">Tên bàn <span className="required">*</span></label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className={errors.name ? 'error' : ''}
//                 />
//                 {errors.name && <div className="error-message">{errors.name}</div>}
//               </div>
//               <div className="form-group">
//                 <label htmlFor="status">Trạng thái</label>
//                 <select
//                   id="status"
//                   name="status"
//                   value={formData.status}
//                   onChange={handleInputChange}
//                 >
//                   <option value="available">Trống</option>
//                   <option value="reserved">Đã đặt</option>
//                   <option value="occupied">Đang sử dụng</option>
//                 </select>
//               </div>
//               <div className="form-actions">
//                 <button type="button" className="cancel-btn" onClick={() => setIsFormOpen(false)}>
//                   Hủy
//                 </button>
//                 <button type="submit" className="submit-btn">
//                   {isEditing ? 'Cập nhật' : 'Thêm mới'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {showToast && (
//         <Toast
//           message={toastMessage}
//           type={toastType}
//           onClose={() => setShowToast(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default TableManagement;
