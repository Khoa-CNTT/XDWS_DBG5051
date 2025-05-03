import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../Api/AxiosIntance';
import axios from 'axios';
import { login } from '../../Api/Login';
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
            const role = result.role ?? null;

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            console.log('Đăng nhập thành công:', result.role);
            console.log('TOKEN:', token)
            setError('');


            if (role === 'employee') {
                navigate('/employee');
            } else {
                navigate('/admin');
            }

        } catch (error: any) {
            console.error(error);

            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.message);
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
