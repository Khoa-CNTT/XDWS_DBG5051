import { useState } from 'react';
import QrCodeGenerator from '../../components/QrCodeGenerator/QrCodeGenerator';
import './Admin.scss';
import { FaHome, FaQrcode, FaClipboardList, FaBars, FaChartBar, FaSignOutAlt } from 'react-icons/fa';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('qrcode');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple authentication (in a real app, this would use a secure API)
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-page">
        <div className="container">
          <div className="login-box">
            <div className="login-header">
              <img src="https://ext.same-assets.com/0/1160240166.svg" alt="Smart Order" className="logo" />
              <h1>Đăng nhập quản trị</h1>
            </div>

            <form onSubmit={handleLogin}>
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label htmlFor="username">Tên đăng nhập</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Mật khẩu</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="login-btn">
                Đăng nhập
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <img 
            src="https://ext.same-assets.com/0/1160240166.svg" 
            alt="Smart Order" 
            className="logo" 
          />
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
            className={`sidebar-menu-item ${activeTab === 'qrcode' ? 'active' : ''}`}
            onClick={() => setActiveTab('qrcode')}
          >
            <FaQrcode size={20} />
            {!isSidebarCollapsed && <span>Mã QR đặt món</span>}
          </div>
          <div 
            className={`sidebar-menu-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <FaClipboardList size={20} />
            {!isSidebarCollapsed && <span>Quản lý đơn hàng</span>}
          </div>
          <div 
            className={`sidebar-menu-item ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            <FaBars size={20} />
            {!isSidebarCollapsed && <span>Quản lý thực đơn</span>}
          </div>
          <div 
            className={`sidebar-menu-item ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <FaChartBar size={20} />
            {!isSidebarCollapsed && <span>Thống kê</span>}
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
            {activeTab === 'qrcode' && 'Mã QR đặt món'}
            {activeTab === 'orders' && 'Quản lý đơn hàng'}
            {activeTab === 'menu' && 'Quản lý thực đơn'}
            {activeTab === 'stats' && 'Thống kê'}
          </h1>
          <div className="admin-info">
            <span className="admin-name">Admin</span>
          </div>
        </div>

        <div className="content-body">
          {activeTab === 'qrcode' && <QrCodeGenerator />}
          {activeTab === 'dashboard' && <div className="placeholder-content">Tính năng đang phát triển</div>}
          {activeTab === 'orders' && <div className="placeholder-content">Tính năng đang phát triển</div>}
          {activeTab === 'menu' && <div className="placeholder-content">Tính năng đang phát triển</div>}
          {activeTab === 'stats' && <div className="placeholder-content">Tính năng đang phát triển</div>}
        </div>
      </div>
    </div>
  );
};

export default Admin;