import { useState } from 'react';
import PaymentManagement from '../../components/Manage/Payment/Payment';
import OrderManagement from '../../components/Manage/Order/Order';
import './Staff.scss';
import { FaHome, FaClipboardList, FaBars, FaSignOutAlt, FaMoneyBillWave } from 'react-icons/fa';

const Staff = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === '1' && password === '1') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // if (!isAuthenticated) {
  //   return (
  //     <div className="staff-login-page">
  //       <div className="container">
  //         <div className="login-box">
  //           <div className="login-header">
  //             <img src="/src/assets/logo-smartorder.png" alt="Smart Order" className="logo" />
  //             <h1>Đăng nhập nhân viên</h1>
  //           </div>

  //           <form onSubmit={handleLogin}>
  //             {error && <div className="error-message">{error}</div>}

  //             <div className="form-group">
  //               <label htmlFor="username">Tên đăng nhập</label>
  //               <input
  //                 type="text"
  //                 id="username"
  //                 value={username}
  //                 onChange={(e) => setUsername(e.target.value)}
  //                 required
  //               />
  //             </div>

  //             <div className="form-group">
  //               <label htmlFor="password">Mật khẩu</label>
  //               <input
  //                 type="password"
  //                 id="password"
  //                 value={password}
  //                 onChange={(e) => setPassword(e.target.value)}
  //                 required
  //               />
  //             </div>

  //             <button type="submit" className="login-btn">
  //               Đăng nhập
  //             </button>
  //           </form>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="staff-dashboard">
      <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <img src="/src/assets/logo-smartorder.png" alt="Smart Order" className="logo" />
          {!isSidebarCollapsed && <h2>Smart Order</h2>}
          <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
            <FaBars size={20} />
          </button>
        </div>

        <div className="sidebar-menu">
          <div
            className={`sidebar-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <FaHome size={20} />
            {!isSidebarCollapsed && <span>Tổng quan</span>}
          </div>
          <div
            className={`sidebar-menu-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <FaClipboardList size={20} />
            {!isSidebarCollapsed && <span>Quản lý đơn hàng</span>}
          </div>
          <div
            className={`sidebar-menu-item ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            <FaMoneyBillWave size={20} />
            {!isSidebarCollapsed && <span>Quản lý thanh toán</span>}
          </div>
        </div>

        <div className="sidebar-footer">
          <div
            className="sidebar-menu-item logout"
            onClick={() => setIsAuthenticated(false)}
          >
            <FaSignOutAlt size={20} />
            {!isSidebarCollapsed && <span>Đăng xuất</span>}
          </div>
        </div>
      </div>

      <div className={`main-content ${isSidebarCollapsed ? 'expanded' : ''}`}>
        <div className="content-header">
          <h1>
            {activeTab === 'dashboard' && 'Tổng quan'}
            {activeTab === 'orders' && 'Quản lý đơn hàng'}
            {activeTab === 'payments' && 'Quản lý thanh toán'}
          </h1>
          <div className="staff-info">
            <span className="staff-name">Nhân viên</span>
          </div>
        </div>

        <div className="content-body">
          {activeTab === 'dashboard' && <div className="placeholder-content">Xin chào nhân viên!</div>}
          {activeTab === 'orders' && <OrderManagement />}
          {activeTab === 'payments' && <PaymentManagement />}
        </div>
      </div>
    </div>
  );
};

export default Staff;