import { useState, useEffect } from 'react';
import { 
  FaChartLine, 
  FaUtensils, 
  FaChair, 
  FaUsers, 
  FaCalendarAlt, 
  FaDownload,
  FaSearch,
  FaExclamationTriangle
} from 'react-icons/fa';
import axios from 'axios';

// Types
interface RevenueData {
  date: string;
  amount: number;
}

interface PopularItem {
  id: number;
  name: string;
  quantity: number;
  revenue: number;
  category: string;
}

interface TableStatus {
  id: number;
  tableNumber: string;
  status: 'available' | 'reserved' | 'occupied';
  reservations?: number;
  occupancyRate?: number;
}

interface StaffPerformance {
  id: number;
  name: string;
  ordersProcessed: number;
  totalSales: number;
  averageOrderValue: number;
}

interface Report {
  startDate: string;
  endDate: string;
  totalRevenue: number;
  averageDailyRevenue: number;
  totalOrders: number;
  revenueByDay: RevenueData[];
  popularItems: PopularItem[];
  tableStatus: TableStatus[];
  staffPerformance: StaffPerformance[];
}

type ReportType = 'revenue' | 'popularItems' | 'tableStatus' | 'staffPerformance';
type TimeFrame = 'daily' | 'weekly' | 'monthly';

const ReportDashboard = () => {
  // State
  const [reportType, setReportType] = useState<ReportType>('revenue');
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('daily');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [category, setCategory] = useState<string>('all');
  const [staffId, setStaffId] = useState<string>('all');
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [categoryList, setCategoryList] = useState<{id: string, name: string}[]>([]);
  const [staffList, setStaffList] = useState<{id: string, name: string}[]>([]);

  // Set default dates (current month)
  useEffect(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    setStartDate(formatDate(firstDay));
    setEndDate(formatDate(lastDay));
    
    // Load categories and staff lists
    fetchCategories();
    fetchStaffList();
  }, []);

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const fetchCategories = async () => {
    try {
      // This would be replaced with your actual API endpoint
      const response = await axios.get('http://127.0.0.1:8000/api/cate');
      if (response.data && response.data.data) {
        setCategoryList(response.data.data.map((cat: any) => ({
          id: cat.id,
          name: cat.name
        })));
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      // Use mock data in case API fails
      setCategoryList([
        { id: '1', name: 'Món chính' },
        { id: '2', name: 'Món khai vị' },
        { id: '3', name: 'Món tráng miệng' },
        { id: '4', name: 'Đồ uống' }
      ]);
    }
  };

  const fetchStaffList = async () => {
    try {
      // This would be replaced with your actual API endpoint
      const response = await axios.get('http://127.0.0.1:8000/api/staff');
      if (response.data && response.data.data) {
        setStaffList(response.data.data.map((staff: any) => ({
          id: staff.id,
          name: staff.name
        })));
      }
    } catch (err) {
      console.error('Failed to fetch staff list:', err);
      // Use mock data in case API fails
      setStaffList([
        { id: '1', name: 'Nguyễn Văn A' },
        { id: '2', name: 'Trần Thị B' },
        { id: '3', name: 'Lê Văn C' },
        { id: '4', name: 'Phạm Thị D' }
      ]);
    }
  };

  const generateReport = async () => {
    // Validate input
    if (!startDate || !endDate) {
      setError('Vui lòng chọn khoảng thời gian');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('Ngày bắt đầu phải trước ngày kết thúc');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // This would be replaced with your actual API endpoint
      // const response = await axios.post('http://127.0.0.1:8000/api/reports', {
      //   reportType,
      //   timeFrame,
      //   startDate,
      //   endDate,
      //   category: category !== 'all' ? category : undefined,
      //   staffId: staffId !== 'all' ? staffId : undefined
      // });
      
      // For demonstration, we'll use mock data
      setTimeout(() => {
        const mockReport = generateMockReport();
        setReport(mockReport);
        setLoading(false);
        setSuccess(true);
      }, 1000);
    } catch (err) {
      console.error('Failed to generate report:', err);
      setError('Không thể tạo báo cáo. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  const generateMockReport = (): Report => {
    // Generate dates between start and end date
    const dates: string[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(formatDate(d));
    }

    // Generate revenue data
    const revenueByDay: RevenueData[] = dates.map(date => {
      const baseRevenue = Math.floor(Math.random() * 5000000) + 5000000; // 5M-10M VND
      return {
        date,
        amount: baseRevenue
      };
    });

    // Calculate total revenue
    const totalRevenue = revenueByDay.reduce((sum, day) => sum + day.amount, 0);
    
    // Popular items mock data
    const itemNames = [
      'Phở bò', 'Bún chả', 'Cơm tấm sườn', 'Bún bò Huế', 
      'Gỏi cuốn', 'Chả giò', 'Bánh xèo', 'Cà phê sữa đá',
      'Trà đào', 'Sinh tố xoài', 'Bánh flan', 'Chè thái'
    ];
    
    const popularItems: PopularItem[] = itemNames.slice(0, 8).map((name, idx) => {
      const quantity = Math.floor(Math.random() * 50) + 20; // 20-70 items
      const unitPrice = Math.floor(Math.random() * 50000) + 30000; // 30K-80K VND
      return {
        id: idx + 1,
        name,
        quantity,
        revenue: quantity * unitPrice,
        category: idx < 4 ? 'Món chính' : idx < 8 ? 'Món khai vị' : idx < 10 ? 'Đồ uống' : 'Món tráng miệng'
      };
    }).sort((a, b) => b.revenue - a.revenue);
    
    // Table status mock data
    const tableStatus: TableStatus[] = Array.from({ length: 10 }, (_, idx) => {
      const tableNumber = `B${String(idx + 1).padStart(2, '0')}`;
      const statusOptions: ('available' | 'reserved' | 'occupied')[] = ['available', 'reserved', 'occupied'];
      const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      const reservations = Math.floor(Math.random() * 30);
      const occupancyRate = Math.floor(Math.random() * 60) + 40; // 40-100%
      
      return {
        id: idx + 1,
        tableNumber,
        status,
        reservations,
        occupancyRate
      };
    });
    
    // Staff performance mock data
    const staffNames = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D', 'Hoàng Văn E'];
    const staffPerformance: StaffPerformance[] = staffNames.map((name, idx) => {
      const ordersProcessed = Math.floor(Math.random() * 50) + 30; // 30-80 orders
      const totalSales = (Math.floor(Math.random() * 5000000) + 3000000); // 3M-8M VND
      
      return {
        id: idx + 1,
        name,
        ordersProcessed,
        totalSales,
        averageOrderValue: Math.round(totalSales / ordersProcessed)
      };
    }).sort((a, b) => b.totalSales - a.totalSales);
    
    return {
      startDate,
      endDate,
      totalRevenue,
      averageDailyRevenue: Math.round(totalRevenue / revenueByDay.length),
      totalOrders: Math.floor(Math.random() * 300) + 200, // 200-500 orders
      revenueByDay,
      popularItems,
      tableStatus,
      staffPerformance
    };
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleDownloadReport = () => {
    // In a real application, this would generate a PDF or Excel file
    // For now, we'll just show an alert
    alert('Báo cáo đang được tải xuống...');
  };

  // Get the appropriate title based on report type
  const getReportTitle = (): string => {
    switch(reportType) {
      case 'revenue':
        return 'Báo cáo doanh thu';
      case 'popularItems':
        return 'Báo cáo món ăn bán chạy';
      case 'tableStatus':
        return 'Báo cáo tình trạng bàn';
      case 'staffPerformance':
        return 'Báo cáo hiệu suất nhân viên';
      default:
        return 'Báo cáo';
    }
  };

  // Get the appropriate time frame title
  const getTimeFrameTitle = (): string => {
    switch(timeFrame) {
      case 'daily':
        return 'theo ngày';
      case 'weekly':
        return 'theo tuần';
      case 'monthly':
        return 'theo tháng';
      default:
        return '';
    }
  };

  return (
    <div className="report-dashboard">
      <div className="dashboard-header">
        <h1>Thống kê và báo cáo</h1>
        <p>Truy xuất và phân tích dữ liệu kinh doanh</p>
      </div>

      <div className="report-container">
        <div className="report-sidebar">
          <h3>Loại báo cáo</h3>
          <ul className="report-types">
            <li 
              className={reportType === 'revenue' ? 'active' : ''}
              onClick={() => setReportType('revenue')}
            >
              <FaChartLine /> Doanh thu
            </li>
            <li 
              className={reportType === 'popularItems' ? 'active' : ''}
              onClick={() => setReportType('popularItems')}
            >
              <FaUtensils /> Món ăn bán chạy
            </li>
            <li 
              className={reportType === 'tableStatus' ? 'active' : ''}
              onClick={() => setReportType('tableStatus')}
            >
              <FaChair /> Tình trạng bàn
            </li>
            <li 
              className={reportType === 'staffPerformance' ? 'active' : ''}
              onClick={() => setReportType('staffPerformance')}
            >
              <FaUsers /> Hiệu suất nhân viên
            </li>
          </ul>

          <div className="filter-section">
            <h3>Bộ lọc</h3>
            
            <div className="filter-group">
              <label>Khung thời gian:</label>
              <div className="time-frame-buttons">
                <button 
                  className={timeFrame === 'daily' ? 'active' : ''}
                  onClick={() => setTimeFrame('daily')}
                >
                  Ngày
                </button>
                <button 
                  className={timeFrame === 'weekly' ? 'active' : ''}
                  onClick={() => setTimeFrame('weekly')}
                >
                  Tuần
                </button>
                <button 
                  className={timeFrame === 'monthly' ? 'active' : ''}
                  onClick={() => setTimeFrame('monthly')}
                >
                  Tháng
                </button>
              </div>
            </div>
            
            <div className="filter-group">
              <label htmlFor="startDate">Từ ngày:</label>
              <input 
                type="date" 
                id="startDate" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            
            <div className="filter-group">
              <label htmlFor="endDate">Đến ngày:</label>
              <input 
                type="date" 
                id="endDate"  
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            
            {(reportType === 'popularItems') && (
              <div className="filter-group">
                <label htmlFor="category">Danh mục:</label>
                <select 
                  id="category" 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="all">Tất cả danh mục</option>
                  {categoryList.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            )}
            
            {(reportType === 'staffPerformance') && (
              <div className="filter-group">
                <label htmlFor="staffId">Nhân viên:</label>
                <select 
                  id="staffId" 
                  value={staffId} 
                  onChange={(e) => setStaffId(e.target.value)}
                >
                  <option value="all">Tất cả nhân viên</option>
                  {staffList.map(staff => (
                    <option key={staff.id} value={staff.id}>{staff.name}</option>
                  ))}
                </select>
              </div>
            )}
            
            <button 
              className="generate-report-btn"
              onClick={generateReport}
              disabled={loading}
            >
              {loading ? (
                <span>Đang tạo báo cáo...</span>
              ) : (
                <>
                  <FaSearch /> Tạo báo cáo
                </>
              )}
            </button>
          </div>
        </div>

        <div className="report-content">
          {error && (
            <div className="error-message">
              <FaExclamationTriangle /> {error}
            </div>
          )}
          
          {report && success && (
            <div className="report-results">
              <div className="report-header">
                <h2>{getReportTitle()} {getTimeFrameTitle()}</h2>
                <p>Từ {new Date(report.startDate).toLocaleDateString('vi-VN')} đến {new Date(report.endDate).toLocaleDateString('vi-VN')}</p>
                <button className="download-btn" onClick={handleDownloadReport}>
                  <FaDownload /> Tải xuống báo cáo
                </button>
              </div>
              
              <div className="report-summary">
                <div className="summary-card">
                  <h3>Tổng doanh thu</h3>
                  <p className="summary-value">{formatCurrency(report.totalRevenue)}</p>
                </div>
                <div className="summary-card">
                  <h3>Trung bình {timeFrame === 'daily' ? 'ngày' : timeFrame === 'weekly' ? 'tuần' : 'tháng'}</h3>
                  <p className="summary-value">{formatCurrency(report.averageDailyRevenue)}</p>
                </div>
                <div className="summary-card">
                  <h3>Tổng đơn hàng</h3>
                  <p className="summary-value">{report.totalOrders}</p>
                </div>
                <div className="summary-card">
                  <h3>Giá trị trung bình/đơn</h3>
                  <p className="summary-value">{formatCurrency(report.totalRevenue / report.totalOrders)}</p>
                </div>
              </div>
              
              {reportType === 'revenue' && (
                <div className="revenue-chart">
                  <h3>Biểu đồ doanh thu theo {timeFrame === 'daily' ? 'ngày' : timeFrame === 'weekly' ? 'tuần' : 'tháng'}</h3>
                  {/* Chart would be here - for now, we'll show a table */}
                  <div className="revenue-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Ngày</th>
                          <th>Doanh thu</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.revenueByDay.map((day, idx) => (
                          <tr key={idx}>
                            <td>{new Date(day.date).toLocaleDateString('vi-VN')}</td>
                            <td>{formatCurrency(day.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {reportType === 'popularItems' && (
                <div className="popular-items">
                  <h3>Món ăn bán chạy nhất</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Tên món</th>
                        <th>Danh mục</th>
                        <th>Số lượng</th>
                        <th>Doanh thu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.popularItems.map((item, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.category}</td>
                          <td>{item.quantity}</td>
                          <td>{formatCurrency(item.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {reportType === 'tableStatus' && (
                <div className="table-status">
                  <h3>Tình trạng bàn</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Số bàn</th>
                        <th>Trạng thái hiện tại</th>
                        <th>Số lần đặt</th>
                        <th>Tỷ lệ sử dụng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.tableStatus.map((table, idx) => (
                        <tr key={idx}>
                          <td>{table.tableNumber}</td>
                          <td>
                            <span className={`status-badge ${table.status}`}>
                              {table.status === 'available' ? 'Trống' : 
                               table.status === 'reserved' ? 'Đã đặt' : 'Đang sử dụng'}
                            </span>
                          </td>
                          <td>{table.reservations}</td>
                          <td>
                            <div className="progress-bar">
                              <div 
                                className="progress" 
                                style={{ width: `${table.occupancyRate}%` }}
                              ></div>
                              <span>{table.occupancyRate}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {reportType === 'staffPerformance' && (
                <div className="staff-performance">
                  <h3>Hiệu suất nhân viên</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Nhân viên</th>
                        <th>Đơn hàng xử lý</th>
                        <th>Tổng doanh số</th>
                        <th>Giá trị trung bình/đơn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.staffPerformance.map((staff, idx) => (
                        <tr key={idx}>
                          <td>{staff.name}</td>
                          <td>{staff.ordersProcessed}</td>
                          <td>{formatCurrency(staff.totalSales)}</td>
                          <td>{formatCurrency(staff.averageOrderValue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          
          {!report && !error && !loading && (
            <div className="no-report">
              <div className="calendar-icon">
                <FaCalendarAlt size={50} />
              </div>
              <h3>Chọn loại báo cáo và khoảng thời gian</h3>
              <p>Nhấn nút "Tạo báo cáo" để xem thống kê chi tiết</p>
            </div>
          )}
          
          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Đang tạo báo cáo...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportDashboard;