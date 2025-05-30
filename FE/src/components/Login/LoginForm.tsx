import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../Api/AxiosIntance';
import axios from 'axios';
import { login, getUserInfo } from '../../Api/Login';

const loginForm = () => {
    const [name, setName] = useState('a');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const result = await login(name, password);
            const token = result.token;
            const role = result.role;
            const Name = result.name;
            // Lưu token vào localStorage và set header
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('name', Name)

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            console.log('TOKEN:', token);
            console.log('Role', role);
            console.log('name', name);

            setError('');

            // Lấy thông tin người dùng và kiểm tra role
            try {
                const userInfo = await getUserInfo();
                console.log('Thông tin người dùng:', userInfo);

                // Lưu role và name vào localStorage
                localStorage.setItem('role', userInfo.role);
                localStorage.setItem('name', userInfo.name || 'User');

                navigate('/admin');
            } catch (error) {
                console.error('Lỗi khi lấy thông tin người dùng:', error);
                setError('Không thể lấy thông tin người dùng');
            }

        } catch (error: any) {
            console.error(error);

            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Đăng nhập thất bại, vui lòng thử lại.');
            }
        }
    };

    return (
        <div className="admin-login-page">
            <div className="container">
                <div className="login-box">
                    <div className="login-header">
                        <img src="/src/assets/logo-smartorder.png" alt="Smart Order" className="logo" />
                        <h1>Đăng nhập quản trị</h1>
                    </div>

                    <form onSubmit={handleLogin}>
                        {error && <div className="error-message">{error}</div>}

                        <div className="form-group">
                            <label htmlFor="username">Tên đăng nhập</label>
                            <input
                                type="text"
                                id="username"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
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
    )
}

export default loginForm;
