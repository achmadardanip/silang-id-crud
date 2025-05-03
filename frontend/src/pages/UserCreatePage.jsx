import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import LoadingIndicator from '../components/LoadingIndicator'; // <-- Import loader

const UserCreatePage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false); // State loading form
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true); // Mulai loading
        try {
            await axiosInstance.post('/users', { name, email, password });
            navigate('/users');
        } catch (err) {
            console.error("Create user error:", err);
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({ general: [err.response?.data?.message || 'Failed to create user. Please try again.'] });
            }
        } finally {
            setIsLoading(false); // Selesai loading
        }
    };

    return (
        <div>
            {isLoading && <LoadingIndicator message="Creating user..." />}

            <h1 className="page-title">Create New User</h1>
            <form onSubmit={handleSubmit} style={{ filter: isLoading ? 'blur(1px)' : 'none' }}>
                {errors.general && <p className="error-message">{errors.general.join(', ')}</p>}
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading}/>
                     {errors.name && <p className="error-message">{errors.name.join(', ')}</p>}
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete='off' disabled={isLoading}/>
                     {errors.email && <p className="error-message">{errors.email.join(', ')}</p>}
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete='new-password' disabled={isLoading}/>
                     {errors.password && <p className="error-message">{errors.password.join(', ')}</p>}
                </div>
                <div style={{ flexDirection: 'row', gap: '1rem', marginTop: '1rem' }}>
                    <button type="submit" disabled={isLoading}>
                       Create User
                    </button>
                     <Link to="/users" style={{ padding: '0.7rem 1rem', textAlign: 'center', backgroundColor: '#6c757d', color: 'white', borderRadius: '4px', pointerEvents: isLoading ? 'none' : 'auto' }}>Cancel</Link>
                </div>
            </form>
        </div>
    );
};

export default UserCreatePage;