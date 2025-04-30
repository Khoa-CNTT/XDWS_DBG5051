import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const loginForm = () => {
    const navigate = useNavigate(); // thêm dòng này vào đầu component

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const api = axios.create({
        baseURL: 'http://localhost:8000/api',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await api.post('/login', { name, password });
            const token = response.data.token;
            const role = response.data.role ?? null; // fallback về null nếu không có

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setIsAuthenticated(true);
            setError('');

            // 🔁 Chuyển hướng dựa theo role
            if (role === 'employee') {
                navigate('/employee');
            } else {
                // Mặc định không có role thì là admin
                navigate('/admin');
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

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to login hoặc show form login
        } else {
            // Gọi API xác thực hoặc tiếp tục load data
        }
    }, []);



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
