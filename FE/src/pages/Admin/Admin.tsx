import { useState } from 'react';
import QrCodeGenerator from '../../components/QrCodeGenerator/QrCodeGenerator';
import './Admin.scss';
import { FaHome, FaQrcode, FaClipboardList, FaBars, FaChartBar, FaSignOutAlt, FaList, FaMoneyBillWave, } from 'react-icons/fa';
import Menu from '../../components/Manage/Menu/Menu.tsx';
import { FaPeopleGroup, FaTableCells, FaTableList } from 'react-icons/fa6';
import Table from '../../components/Manage/Table/Table.tsx'
import Staff from '../../components/Manage/Staff/Staff.tsx'
import PaymentManagement from '../../components/Manage/Payment/Payment';
import Category from '../../components/Manage/Category/Category.tsx';
import OrderManagement from '../../components/Manage/Order/Order.tsx';
import ReportDashboard from '../../components/Manage/Report/Report.tsx';
import { useNavigate } from 'react-router-dom';
const Admin = () => {
  const [activeTab, setActiveTab] = useState('qrcode');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
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
            className={`sidebar-menu-item ${activeTab === 'cate' ? 'active' : ''}`}
            onClick={() => setActiveTab('cate')}
          >
            <FaList size={20} />
            {!isSidebarCollapsed && <span>Quản lý Danh mục</span>}
          </div>
          <div
            className={`sidebar-menu-item ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            <FaTableList size={20} />
            {!isSidebarCollapsed && <span>Quản lý thực đơn</span>}
          </div>
          <div
            className={`sidebar-menu-item ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <FaChartBar size={20} />
            {!isSidebarCollapsed && <span>Thống kê</span>}
          </div>

          <div
            className={`sidebar-menu-item ${activeTab === 'table' ? 'active' : ''}`}
            onClick={() => setActiveTab('table')}
          >
            <FaTableCells size={20} />
            {!isSidebarCollapsed && <span>Quản Lý Bàn</span>}
          </div>

          <div
            className={`sidebar-menu-item ${activeTab === 'staff' ? 'active' : ''}`}
            onClick={() => setActiveTab('staff')}
          >
            <FaPeopleGroup size={20} />
            {!isSidebarCollapsed && <span>Quản Lý Nhân Viên</span>}
          </div>
          <div
            className={`sidebar-menu-item ${activeTab === 'payment' ? 'active' : ''}`}
            onClick={() => setActiveTab('payment')}
          >
            <FaMoneyBillWave size={20} />
            {!isSidebarCollapsed && <span>Quản lý thanh toán</span>}
          </div>
        </div>

        <div className="sidebar-footer">
          <div
            className="sidebar-menu-item logout"
            // onClick={() => setIsAuthenticated(false)}
            style={{ cursor: 'pointer' }}
            onClick={handleLogout}
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
            {activeTab === 'table' && 'Quản Lý Bàn'}
            {activeTab === 'staff' && 'Quản Lý Nhân Viên'}
            {activeTab === 'payment' && 'Quản Lý Thanh toán'}

          </h1>
          <div className="admin-info">
            <span className="admin-name">Admin</span>
          </div>
        </div>

        <div className="content-body">
          {activeTab === 'qrcode' && <QrCodeGenerator />}
          {activeTab === 'dashboard' && <div className="placeholder-content">Tính năng đang phát triển</div>}
          {activeTab === 'orders' && <div><OrderManagement /></div>}
          {activeTab === 'cate' && <div><Category /></div>}
          {activeTab === 'menu' && <div><Menu /></div>}
          {activeTab === 'stats' && <div><ReportDashboard /></div>}
          {activeTab === 'table' && <div><Table /></div>}
          {activeTab === 'staff' && <div><Staff /></div>}
          {activeTab === 'payment' && <div><PaymentManagement /></div>}
        </div>
      </div>
    </div>
  );
};

export default Admin;