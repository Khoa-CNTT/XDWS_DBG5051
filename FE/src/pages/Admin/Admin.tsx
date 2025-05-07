import React, { useEffect, useState } from 'react';
import QrCodeGenerator from '../../components/QrCodeGenerator/QrCodeGenerator';
import './Admin.scss';
import { FaHome, FaQrcode, FaClipboardList, FaBars, FaChartBar, FaSignOutAlt, FaList, } from 'react-icons/fa';
import Menu from '../../components/Manage/Menu/Menu.tsx';
import { FaDisplay, FaPeopleGroup, FaTableCells, FaTableList } from 'react-icons/fa6';
import Table from '../../components/Manage/Table/Table.tsx'
import Staff from '../../components/Manage/Staff/Staff.tsx'
import Category from '../../components/Manage/Category/Category.tsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Admin = () => {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('qrcode');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();








  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };


  const role = localStorage.getItem('role');
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

          {
            role === 'staff' ?
              <div
                className={`sidebar-menu-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <FaClipboardList size={20} />
                {!isSidebarCollapsed && <span>Quản lý đơn hàng</span>}

              </div>
              : ''

          }
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

          </h1>
          <div className="admin-info">
            <span className="admin-name">Admin</span>
          </div>
        </div>

        <div className="content-body">
          {activeTab === 'qrcode' && <QrCodeGenerator />}
          {activeTab === 'dashboard' && <div className="placeholder-content">Tính năng đang phát triển</div>}
          {activeTab === 'orders' && <div className="placeholder-content">Tính năng đang phát triển</div>}
          {activeTab === 'cate' && <div><Category /></div>}
          {activeTab === 'menu' && <div><Menu /></div>}
          {activeTab === 'stats' && <div className="placeholder-content">Tính năng đang phát triển</div>}
          {activeTab === 'table' && <div><Table /></div>}
          {activeTab === 'staff' && <div><Staff /></div>}

        </div>
      </div>
    </div>
  );
};

export default Admin;